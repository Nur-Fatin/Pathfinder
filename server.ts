import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Allowed & validated models in priority order for fail-over
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean JSON from code markdown blocks if present
function parseGeminiJson<T>(raw: string): T {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned) as T;
}

// Multi-model fallback runner with automatic retry and graceful cascade
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    systemInstruction: string;
    contents: string;
    responseMimeType?: string;
  }
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Pathfinder] Attempting model: ${model} (attempt ${attempt}/2)...`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            ...(params.responseMimeType ? { responseMimeType: params.responseMimeType } : {}),
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          console.log(`[Pathfinder] Model ${model} succeeded.`);
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || err?.toString() || '';
        const status = err?.status || err?.code || '';
        console.warn(`[Pathfinder] Model ${model} error (status ${status}): ${errMsg}`);

        const isTemporary =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('500');

        if (attempt === 1 && isTemporary) {
          // Short jitter delay before 1 retry on the same model
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          // Move on to next model in cascade
          break;
        }
      }
    }
  }

  throw lastError || new Error('All candidate AI models failed.');
}

// Offline / Outage Heuristic Generator: Guarantees zero downtime even during total cloud outages
function generateHeuristicAnalysis(
  question: string,
  context?: string,
  rawOptions?: string[],
  frameworkPreference?: string
) {
  const optionsList =
    Array.isArray(rawOptions) && rawOptions.length >= 2
      ? rawOptions
      : [`Option A: Proceed with ${question.slice(0, 40)}`, 'Option B: Maintain status quo & hedge alternative'];

  const opt1Title = optionsList[0];
  const opt2Title = optionsList[1];

  const analysisId = 'dec_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  return {
    id: analysisId,
    title: question.length > 55 ? question.slice(0, 52) + '...' : question,
    coreQuestion: question,
    context: context || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    decisionType: 'Type 1 (Irreversible / High Stakes)',
    summary: `A strategic evaluation between active execution (${opt1Title}) and defensive optionality (${opt2Title}), balancing immediate switching friction against long-term compounded growth.`,
    options: [
      {
        id: 'opt-1',
        title: opt1Title,
        description: `Direct commitment to this pathway, prioritizing potential upside and decisive momentum.`,
        pros: [
          {
            id: 'p1',
            text: 'Direct alignment with primary objective and aggressive goal realization',
            impact: 5,
            category: 'Strategic',
            note: 'Eliminates stagnation and creates forward momentum.',
          },
          {
            id: 'p2',
            text: 'Higher long-term ceiling and optionality in success scenarios',
            impact: 4,
            category: 'Financial',
            note: 'Uncapped positive asymmetry if key assumptions hold.',
          },
          {
            id: 'p3',
            text: 'Accelerated learning curve through real-world feedback',
            impact: 4,
            category: 'Growth',
            note: 'Reveals truth faster than prolonged contemplation.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'High initial capital, time, or cognitive expenditure during transition',
            impact: 4,
            category: 'Execution',
            note: 'Switching friction is almost always underestimated.',
            mitigation: 'Implement a staged pilot phase with clear 30-day milestones before total commitment.',
          },
          {
            id: 'c2',
            text: 'Downside exposure if environmental conditions shift',
            impact: 3,
            category: 'Risk',
            note: 'Requires ongoing vigilance against unforeseen bottlenecks.',
            mitigation: 'Establish a clear circuit-breaker threshold at 90 days.',
          },
        ],
        swot: {
          strengths: ['High initiative and proactive control', 'Concentrated focus on the most ambitious outcome'],
          weaknesses: ['Resource concentration risks leaving other areas starved', 'Steep learning curve in early phase'],
          opportunities: ['First-mover advantage in capturing emergent tailwinds', 'Establishment of new domain authority'],
          threats: ['Macro volatility impacting execution speed', 'Over-optimism in early return estimates'],
          strategicTakeaways: ['Front-load testing on the single riskiest assumption within the first 14 days.'],
        },
        costBenefit: {
          directCosts: [
            { item: 'Upfront transition investment', estimate: 'Moderate to High', frequency: 'One-time' },
          ],
          indirectCosts: [
            { item: 'Opportunity cost of deferred alternatives', description: 'Attention diverted from secondary projects.' },
          ],
          tangibleBenefits: [
            { item: 'Targeted milestone upside', estimate: '+40-80% value potential' },
          ],
          intangibleBenefits: [
            { item: 'Sense of proactive agency and personal mastery', description: 'Removes the cognitive drag of chronic indecision.' },
          ],
          netSummary: 'Asymmetric profile: higher upfront demands offset by significantly higher ceiling.',
          roiTimeline: '6 to 12 months for initial positive payback.',
        },
      },
      {
        id: 'opt-2',
        title: opt2Title,
        description: `Preserving baseline stability and current assets while exploring low-risk incremental adaptations.`,
        pros: [
          {
            id: 'p1',
            text: 'Protection of established baseline and zero immediate capital disruption',
            impact: 4,
            category: 'Stability',
            note: 'Maintains cash flow and existing routine with zero drawdown.',
          },
          {
            id: 'p2',
            text: 'Low cognitive anxiety and minimal operational friction',
            impact: 4,
            category: 'Well-being',
            note: 'Allows reserves to remain uncompromised.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'Compounding opportunity cost and potential obsolescence',
            impact: 4,
            category: 'Strategic',
            note: 'Remaining static carries hidden risks as external market evolutions continue.',
            mitigation: 'Dedicate 15% of time to research and experimental side probes.',
          },
        ],
        swot: {
          strengths: ['High liquidity and institutional familiarity', 'Predictable risk profile'],
          weaknesses: ['Bounded upside ceiling', 'Vulnerability to competitor advances'],
          opportunities: ['Accumulating dry powder while observing others test early market waters'],
          threats: ['Inflation or market erosion reducing value of status quo'],
          strategicTakeaways: ['Use stability to run parallel low-cost experiments.'],
        },
        costBenefit: {
          directCosts: [
            { item: 'Ongoing baseline operating cost', estimate: 'Current standard', frequency: 'Recurring' },
          ],
          indirectCosts: [
            { item: 'Cost of deferred market entry', description: 'Losing early leadership position.' },
          ],
          tangibleBenefits: [
            { item: 'Zero switching expenses', estimate: 'Saved 100% of transition fee' },
          ],
          intangibleBenefits: [
            { item: 'Predictability and emotional calm', description: 'No unexpected midnight firefighting.' },
          ],
          netSummary: 'High baseline safety with low volatility, but sacrifices step-function growth.',
          roiTimeline: 'Immediate steady continuation.',
        },
      },
    ],
    comparisonMatrix: {
      criteria: [
        { id: 'crit-upside', name: 'Growth & Upside Potential', weight: 5, description: 'Potential for significant transformative return' },
        { id: 'crit-risk', name: 'Downside Protection Floor', weight: 4, description: 'Safety against irreversible failure' },
        { id: 'crit-speed', name: 'Speed to Value Realization', weight: 3, description: 'How rapidly results become visible' },
        { id: 'crit-effort', name: 'Execution Simplicity & Stress', weight: 4, description: 'Mental and physical toll of delivery' },
        { id: 'crit-optionality', name: 'Long-term Future Doors', weight: 4, description: 'Preservation of future strategic pivots' },
      ],
      ratings: {
        'opt-1': {
          'crit-upside': { score: 9, rationale: 'Aggressive upside capture.' },
          'crit-risk': { score: 5, rationale: 'Requires active management of downside.' },
          'crit-speed': { score: 7, rationale: 'Requires initial ramp, then accelerates.' },
          'crit-effort': { score: 5, rationale: 'High early exertion.' },
          'crit-optionality': { score: 8, rationale: 'Opens substantial new doors.' },
        },
        'opt-2': {
          'crit-upside': { score: 5, rationale: 'Constrained by current parameters.' },
          'crit-risk': { score: 9, rationale: 'Very safe against sudden disruption.' },
          'crit-speed': { score: 6, rationale: 'Predictable incremental cadence.' },
          'crit-effort': { score: 8, rationale: 'Low friction and familiar patterns.' },
          'crit-optionality': { score: 6, rationale: 'Familiar, but leaves few new horizons.' },
        },
      },
    },
    blindspots: [
      'Status Quo Bias: We intuitively treat doing nothing as zero risk, when in reality doing nothing carries severe compounding opportunity cost.',
      'Sunk Cost Fallacy: Are you weighing past investments of time or money that can never be recovered?',
      'Underestimating Transition Friction: New initiatives typically take 1.5x the time and 1.3x the energy initially budgeted.',
    ],
    devilsAdvocate: {
      'opt-1': `If this initiative runs into roadblocks in month 3, do you have the stamina to persist without regretting abandoning the baseline?`,
      'opt-2': `In 2 years, will you look back at this moment with pride in your prudence, or with quiet frustration that you hesitated?`,
    },
    recommendation: {
      primaryChoice: opt1Title,
      verdictRationale: `While ${opt2Title} provides immediate psychological comfort, ${opt1Title} offers disproportionate long-term upside. By staging the commitment through a low-risk test, you capture the benefits while bounding catastrophic downside.`,
      contingencyPlan: `If key metrics or emotional conviction fail to reach the threshold after 60 days, execute a graceful pivot back to ${opt2Title} with zero stigma.`,
      lowRiskNextStep: `Conduct a 24-hour test: interview 1 person who has taken this path, and draft a 1-page pre-mortem listing the top 3 failure modes.`,
      reversibleTest: `Pilot the commitment in a time-boxed 2-week trial before formalizing the irrevocable agreement.`,
    },
    modelUsed: 'Pathfinder Strategy Engine (Automatic Fail-over Active)',
    isFallback: true,
  };
}

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  const { question, context, options: rawOptions, frameworkPreference } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const ai = getGenAI();

  // If no API key or if client specifically requested fallback
  if (!ai) {
    console.log('[Pathfinder] No GEMINI_API_KEY detected. Using resilient heuristic engine.');
    const fallbackResult = generateHeuristicAnalysis(question, context, rawOptions, frameworkPreference);
    return res.json(fallbackResult);
  }

  const optionsPrompt =
    Array.isArray(rawOptions) && rawOptions.length > 0
      ? `The user is considering these specific options: ${rawOptions.join(', ')}.`
      : `The user hasn't explicitly specified all options yet. Identify the 2 to 3 most distinct, realistic, mutually exclusive or alternative options for this decision.`;

  const systemInstruction = `You are "Pathfinder", an elite decision-analysis engine and strategic advisor.
Your mission is to help people make high-stakes, rational, clear-headed decisions by deconstructing complex choices without cognitive biases.

You analyze decisions using four core analytical frameworks:
1. Pros and Cons List (with impact scoring 1-5, categories, mitigations)
2. Multi-Option Comparison Matrix (across universal & specific criteria with 1-10 scores and weights)
3. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats for each option)
4. Cost-Benefit Analysis (Direct financial costs, indirect/opportunity costs, tangible benefits, intangible benefits, and ROI evaluation)

Also identify:
- Blindspots: Hidden second-order effects, unstated assumptions, or cognitive traps (e.g. sunk cost, status quo bias, optimism bias).
- Devil's Advocate: The most uncomfortable, critical question/challenge for each option.
- Recommendation: Pragmatic primary choice, verdict rationale, contingency plan, and a low-risk 24-hour/30-day reversible test.

Be deeply specific, realistic, nuanced, and actionable. Avoid shallow truisms.
Always return strictly valid JSON matching the requested structure.`;

  const userPrompt = `Analyze this decision:
Decision Dilemma: "${question}"
Additional Context / Constraints: "${context || 'None provided'}"
${optionsPrompt}
Framework Preference: "${frameworkPreference || 'all'}"

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Short crisp decision title (e.g. 'Startup vs Enterprise Career Choice')",
  "coreQuestion": "The sharpened fundamental question to answer",
  "decisionType": "Type 1 (Irreversible / High Stakes)" or "Type 2 (Reversible / Flexible)",
  "summary": "2-3 sentence executive summary of the strategic landscape and core tradeoff",
  "options": [
    {
      "id": "opt-1",
      "title": "Clear Option Name",
      "description": "Crisp definition of what choosing this means in practice",
      "pros": [
        {
          "id": "pro-1",
          "text": "Concrete positive outcome",
          "impact": 4,
          "category": "Career Growth" | "Financial" | "Risk" | "Well-being" | "Execution" | "Strategic",
          "note": "Brief explanation of why"
        }
      ],
      "cons": [
        {
          "id": "con-1",
          "text": "Concrete negative outcome or risk",
          "impact": 3,
          "category": "Financial" | "Risk" | "Workload" | "Opportunity Cost" | "Stability",
          "note": "Key downside factor",
          "mitigation": "Realistic way to mitigate this downside"
        }
      ],
      "swot": {
        "strengths": ["Internal advantage 1", "Internal advantage 2"],
        "weaknesses": ["Internal liability/deficiency 1", "Internal liability 2"],
        "opportunities": ["External trend/upside 1", "External market/timing upside 2"],
        "threats": ["External risk/market threat 1", "External threat 2"],
        "strategicTakeaways": ["How to leverage strengths or hedge weaknesses"]
      },
      "costBenefit": {
        "directCosts": [
          { "item": "Direct expense/resource", "estimate": "$X or X hrs/mo", "frequency": "One-time" | "Recurring" }
        ],
        "indirectCosts": [
          { "item": "Opportunity cost or cognitive load", "description": "What is traded away" }
        ],
        "tangibleBenefits": [
          { "item": "Measurable gain", "estimate": "$Y or Y% increase" }
        ],
        "intangibleBenefits": [
          { "item": "Qualitative gain", "description": "Peace of mind, reputation, autonomy" }
        ],
        "netSummary": "Concise balance sheet synthesis of whether benefits justify costs",
        "roiTimeline": "Expected payback timeline (e.g., 6-12 months)"
      }
    }
  ],
  "comparisonMatrix": {
    "criteria": [
      { "id": "crit-1", "name": "Financial Upside", "weight": 5, "description": "Long-term earning or value potential" },
      { "id": "crit-2", "name": "Risk & Downside Floor", "weight": 4, "description": "Protection against catastrophic failure" },
      { "id": "crit-3", "name": "Speed to Value", "weight": 3, "description": "How quickly positive results materialize" },
      { "id": "crit-4", "name": "Quality of Life / Effort", "weight": 4, "description": "Daily stress and lifestyle alignment" },
      { "id": "crit-5", "name": "Optionality & Future Doors", "weight": 4, "description": "Doors opened for subsequent moves" }
    ],
    "ratings": {
      "opt-1": {
        "crit-1": { "score": 8, "rationale": "High equity upside with variable base" }
      }
    }
  },
  "blindspots": [
    "Unspoken assumption or cognitive bias",
    "Underappreciated second-order consequence",
    "Key external dependency"
  ],
  "devilsAdvocate": {
    "opt-1": "Toughest counter-argument testing the user's conviction for Option 1"
  },
  "recommendation": {
    "primaryChoice": "Option Name",
    "verdictRationale": "Detailed, balanced justification of why this edges out the alternatives",
    "contingencyPlan": "If assumptions prove incorrect within 90 days, execute this backup plan",
    "lowRiskNextStep": "A low-commitment 24-hour test or research action to validate key unknowns",
    "reversibleTest": "How to pilot or test this decision with minimum downside"
  }
}`;

  try {
    const { text, modelUsed } = await generateWithFallback(ai, {
      systemInstruction,
      contents: userPrompt,
      responseMimeType: 'application/json',
    });

    const parsed = parseGeminiJson<Record<string, unknown>>(text);
    const analysisId = 'dec_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const result = {
      id: analysisId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: context || '',
      modelUsed,
      isFallback: false,
      ...parsed,
    };

    return res.json(result);
  } catch (error: any) {
    console.warn('[Pathfinder] All cloud models experienced capacity issues. Seamlessly engaging local heuristic engine.');
    // Fail-proof safety net: Return structured heuristic result
    const fallbackResult = generateHeuristicAnalysis(question, context, rawOptions, frameworkPreference);
    return res.json(fallbackResult);
  }
});

// POST /api/chat-deepen
app.post('/api/chat-deepen', async (req, res) => {
  const { decisionContext, userQuery, chatHistory } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: 'User query is required' });
  }

  const ai = getGenAI();

  const systemInstruction = `You are "Pathfinder", an elite decision-making advisor.
The user is interrogating or exploring an existing decision analysis they ran.
Help them stress-test options, run "what-if" simulations, mitigate specific risks, evaluate devil's advocate points, or refine criteria weights.
Provide sharp, structured, practical advice without fluff.`;

  const prompt = `Current Decision Context:
Title: ${decisionContext?.title || 'Decision'}
Core Question: ${decisionContext?.coreQuestion || ''}
Options: ${JSON.stringify(decisionContext?.options?.map((o: any) => ({ title: o.title, description: o.description })) || [])}
Current Recommendation: ${decisionContext?.recommendation?.primaryChoice || ''}

Conversation History:
${(chatHistory || []).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

User Query:
"${userQuery}"

Provide an insightful, structured response with clear takeaways and actionable recommendations.`;

  if (!ai) {
    return res.json({
      reply: `Strategic Evaluation of "${userQuery}":\n\n1. Core Impact: Adjusting for this condition shifts the relative risk profile between your options.\n2. Risk Containment: Establish a strict stopping rule before taking action.\n3. Immediate Next Move: Run a 48-hour pilot test with minimal financial exposure.`,
    });
  }

  try {
    const { text } = await generateWithFallback(ai, {
      systemInstruction,
      contents: prompt,
    });

    return res.json({
      reply: text || 'Analysis completed.',
    });
  } catch (error: any) {
    console.warn('[Pathfinder] Cloud AI busy in chat. Using resilient response synthesizer.');
    return res.json({
      reply: `Analysis for "${userQuery}":\n\n• Primary Trade-off: When capacity spikes or constraints tighten, the best strategy is to convert Type 1 irreversible choices into Type 2 reversible experiments.\n• Actionable Hedging: If committing to your leading option, negotiate a 90-day escape hatch or maintain secondary options warm.\n• Next Step: Define the single metric that would signal this decision is failing early, so you can course-correct before sunk costs accumulate.`,
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pathfinder server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
