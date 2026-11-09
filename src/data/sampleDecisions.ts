import { DecisionAnalysis } from '../types/decision';

export const SAMPLE_DECISIONS: DecisionAnalysis[] = [
  {
    id: 'sample-career-startup-vs-corp',
    title: 'Career Crossroads: Early-Stage AI Startup vs. Senior Staff at Enterprise',
    coreQuestion: 'Should I join a fast-paced Series A AI startup as Head of Engineering or remain as Senior Staff Engineer at a profitable Fortune 500 enterprise?',
    context: 'Currently 7 years at enterprise, comfortable $240k base + $90k stock, 35 hrs/wk, predictable growth. Startup offers $190k base + 1.2% equity, 50-60 hrs/wk, high autonomy, 18 months runway.',
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    decisionType: 'Type 1 (Irreversible / High Stakes)',
    summary: 'A classic trade-off between institutional security with incremental compounding versus asymmetrical career acceleration with elevated burnout and equity risk.',
    options: [
      {
        id: 'opt-enterprise',
        title: 'Option A: Stay at Enterprise as Senior Staff',
        description: 'Maintain current institutional seniority, secure compensation, high work-life balance, and focus on internal leadership.',
        pros: [
          {
            id: 'p1',
            text: 'Guaranteed liquidity and market-beating base compensation ($330k total comp)',
            impact: 5,
            category: 'Financial',
            note: 'Predictable vesting schedule and zero financial stress for family goals.',
          },
          {
            id: 'p2',
            text: 'Predictable 35-40 hr weekly schedule with low existential urgency',
            impact: 4,
            category: 'Well-being',
            note: 'Allows side projects, physical health, and family presence.',
          },
          {
            id: 'p3',
            text: 'High institutional capital and credibility within the organization',
            impact: 4,
            category: 'Career Growth',
            note: 'Path to Principal Director over the next 24 months.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'Bureaucratic friction and slower velocity of technological impact',
            impact: 4,
            category: 'Execution',
            note: 'Large committees, regulatory reviews, and legacy codebase maintenance.',
            mitigation: 'Sponsor internal innovation labs or open-source initiatives to keep cutting-edge skills sharp.',
          },
          {
            id: 'c2',
            text: 'Career skill stagnation in modern zero-to-one engineering leadership',
            impact: 3,
            category: 'Career Growth',
            note: 'Enterprise processes shield engineers from raw market validation.',
            mitigation: 'Take on technical advisory roles for seed-stage startups during off-hours.',
          },
        ],
        swot: {
          strengths: [
            'Deep political and architectural knowledge of existing systems',
            'Strong baseline cash flow with no payroll dependency on VC markets',
            'Established team of high-performing senior reports',
          ],
          weaknesses: [
            'Diminishing returns on incremental learning curve',
            'Risk of becoming overly specialized in proprietary corporate tooling',
          ],
          opportunities: [
            'Promote to Principal level overseeing multi-org architectural decisions',
            'Negotiate dedicated R&D budget for emerging AI internal tools',
          ],
          threats: [
            'Corporate restructuring or leadership changes eroding existing influence',
            'Inflation eroding fixed compensation bonuses over extended horizon',
          ],
          strategicTakeaways: [
            'If staying, leverage high compensation and surplus energy to build independent domain authority and angel investments.',
          ],
        },
        costBenefit: {
          directCosts: [
            { item: 'Annual Foregone Startup Equity Value (Opportunity Cost)', estimate: 'Potentially $500k+ if 10x exit', frequency: 'Eventual' },
          ],
          indirectCosts: [
            { item: 'Loss of zero-to-one executive leadership credentials', description: 'Staying makes it harder to pitch yourself as an agile founding engineer later.' },
          ],
          tangibleBenefits: [
            { item: 'Guaranteed compensation premium over startup', estimate: '+ $50,000 cash/year guaranteed' },
            { item: 'Retirement 401(k) matching and healthcare subsidy', estimate: '~ $18,000/year' },
          ],
          intangibleBenefits: [
            { item: 'Low psychological anxiety & cognitive peace', description: 'No dread of venture runway expiration or sudden bankruptcy.' },
            { item: 'Personal calendar sovereignty', description: 'Evenings and weekends remain protected.' },
          ],
          netSummary: 'Superior immediate cash certainty and personal stability, traded off against explosive upside and high-velocity learning.',
          roiTimeline: 'Immediate steady positive cash flow.',
        },
      },
      {
        id: 'opt-startup',
        title: 'Option B: Join AI Startup as Head of Engineering',
        description: 'Take command of technical strategy, build engineering culture from 4 to 25 engineers, and participate in high-stakes equity growth.',
        pros: [
          {
            id: 'p1',
            text: 'Uncapped financial upside via 1.2% equity stake in high-momentum sector',
            impact: 5,
            category: 'Financial',
            note: 'Valuation inflection point could yield life-changing liquidity.',
          },
          {
            id: 'p2',
            text: 'Radical steepening of executive decision-making and hiring learning curve',
            impact: 5,
            category: 'Career Growth',
            note: 'Direct exposure to board meetings, fundraising, product-market fit, and scaling.',
          },
          {
            id: 'p3',
            text: 'Total autonomy over technical stack, architecture, and team standards',
            impact: 4,
            category: 'Strategic',
            note: 'No red tape, instant ship velocity, zero bureaucracy.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'Startup failure probability and 18-month runway risk',
            impact: 5,
            category: 'Risk',
            note: 'Series A to B conversion rate is currently ~35% in current market.',
            mitigation: 'Thoroughly audit unit economics, customer churn, and burn rate before signature.',
          },
          {
            id: 'c2',
            text: 'Substantial compensation cut ($50k cash delta) and increased weekly hours',
            impact: 4,
            category: 'Financial',
            note: 'Expect 55-hour weeks and constant on-call executive responsibility.',
            mitigation: 'Build an emergency fund covering 12 months living expenses before joining.',
          },
        ],
        swot: {
          strengths: [
            'Direct access to top venture syndicate and founders with prior exits',
            'Proprietary model training pipeline showing early product-market fit',
            'Full greenfield freedom to design the engineering organization',
          ],
          weaknesses: [
            'Fragile infrastructure with technical debt from hackathon prototypes',
            'Lack of middle management; founder still micro-manages releases',
          ],
          opportunities: [
            'First-mover advantage in specialized enterprise agent orchestration',
            'Establish personal industry brand as a pioneering AI engineering leader',
          ],
          threats: [
            'Hyperscaler giants launching competing features natively into their suites',
            'Venture capital cooling cycle if enterprise AI budgets contract',
          ],
          strategicTakeaways: [
            'Negotiate an acceleration clause upon change-of-control and clear milestone-based equity refreshes.',
          ],
        },
        costBenefit: {
          directCosts: [
            { item: 'Immediate annual salary reduction', estimate: '- $50,000 cash/year', frequency: 'Recurring' },
            { item: 'Family health plan out-of-pocket delta', estimate: '- $6,000/year', frequency: 'Recurring' },
          ],
          indirectCosts: [
            { item: 'Severe loss of discretionary personal leisure time', description: 'Requires 15-20 additional hours per week for at least 18 months.' },
            { item: 'Elevated stress and cortisol spikes during fundraising rounds', description: 'High emotional involvement in business survival.' },
          ],
          tangibleBenefits: [
            { item: 'Potential 1.2% equity value at $100M exit', estimate: '$1,200,000 pretax' },
            { item: 'Potential 1.2% equity value at $300M exit', estimate: '$3,600,000 pretax' },
          ],
          intangibleBenefits: [
            { item: 'Definitive transition to executive tier', description: 'Positions user permanently for VP/CTO level roles in future ventures.' },
            { item: 'Deep professional pride in building something from zero', description: 'Direct attribution of company success.' },
          ],
          netSummary: 'Asymmetric upside profile: negative short-term cash flow and high exertion in exchange for potentially transformative equity and career velocity.',
          roiTimeline: 'Break-even within 3 years if Series B closes; loss if venture winds down in 18 months.',
        },
      },
    ],
    comparisonMatrix: {
      criteria: [
        { id: 'c-financial', name: 'Financial Upside Potential', weight: 5, description: 'Long term asset creation & wealth generation' },
        { id: 'c-cashflow', name: 'Cashflow Stability & Security', weight: 5, description: 'Guaranteed income floor & absence of payroll risk' },
        { id: 'c-growth', name: 'Leadership & Skill Velocity', weight: 4, description: 'Speed of gaining premier executive skills' },
        { id: 'c-stress', name: 'Work-Life Balance & Health', weight: 4, description: 'Protection against chronic burnout' },
        { id: 'c-optionality', name: 'Future Career Optionality', weight: 4, description: 'Quality of doors opened in the subsequent decade' },
      ],
      ratings: {
        'opt-enterprise': {
          'c-financial': { score: 6, rationale: 'Stable high income, but bounded ceiling without explosive equity.' },
          'c-cashflow': { score: 10, rationale: 'Practically zero default risk; pristine corporate stability.' },
          'c-growth': { score: 5, rationale: 'Incremental enterprise stewardship; slow feedback cycles.' },
          'c-stress': { score: 9, rationale: 'Predictable boundaries and ample personal flexibility.' },
          'c-optionality': { score: 7, rationale: 'Valuable at other large companies; less enticing for startups.' },
        },
        'opt-startup': {
          'c-financial': { score: 9, rationale: 'Substantial equity payout potential if business hits Series B.' },
          'c-cashflow': { score: 5, rationale: 'Reduced base with 18-month burn rate countdown.' },
          'c-growth': { score: 10, rationale: 'Intense crucible of leadership, architecture, and team building.' },
          'c-stress': { score: 4, rationale: 'Demanding work rhythm and heavy operational accountability.' },
          'c-optionality': { score: 9, rationale: 'Positions directly for CTO/Founder roles regardless of outcome.' },
        },
      },
    },
    blindspots: [
      'The "Founder Co-existence" Risk: Have you stress-tested working directly under the CEO during a product crisis? Founder misalignment causes 60% of early executive departures.',
      'Dilution Ignorance: A 1.2% Series A stake will dilute by 20-30% in each subsequent round (Series B, C), requiring realistic exit modeling at 0.6%-0.8% net.',
      'Sunk Capital Bias: Staying at enterprise may feel "safe", but staying 10+ years at one legacy firm can inadvertently discount your external market value.',
    ],
    devilsAdvocate: {
      'opt-enterprise': 'Are you choosing to stay out of authentic strategic calculation, or simply out of comfortable fear of having your technical chops publicly tested?',
      'opt-startup': 'If the startup fails in 14 months and equity is worth $0, will the sheer experience and title have justified $80k in lost salary and 1,000 lost hours with family?',
    },
    recommendation: {
      primaryChoice: 'Option B: Join AI Startup as Head of Engineering (with specific safety conditions)',
      verdictRationale: 'At your current career stage with 7 years of enterprise pedigree, your downside is firmly bounded (you can easily return to a Senior Staff enterprise role within 90 days if needed), while your upside in leadership growth and equity optionality is radically asymmetrical.',
      contingencyPlan: 'Negotiate a 12-month severance cushion or maintain warm relationships with enterprise leadership. Set a firm 9-month review checkpoint: if team culture is toxic or burn rate is reckless, exit proactively.',
      lowRiskNextStep: 'Spend a Saturday doing a technical audit of the startup repo and an informal dinner with the founding engineers to assess true codebase reality.',
      reversibleTest: 'Request to act as paid technical consultant for 2 weekends prior to resignation to experience the team dynamic firsthand.',
    },
  },
  {
    id: 'sample-housing-buy-vs-rent',
    title: 'Financial Decision: Buy a $750k Suburban Home vs. Rent Downtown & Invest Surplus',
    coreQuestion: 'Should we purchase a $750k single-family home with 20% down at 6.8% mortgage, or rent a modern 2-bedroom downtown apartment and invest the down payment and monthly savings in broad market index funds?',
    context: 'Married couple, 32 years old, household income $260k, $180k liquid savings. Planning for first child in 2-3 years. Suburban home estimated $5,100/mo all-in (mortgage, property tax, insurance, maintenance). Renting downtown $3,100/mo.',
    createdAt: '2026-11-02T14:00:00.000Z',
    updatedAt: '2026-11-02T14:00:00.000Z',
    decisionType: 'Type 1 (Irreversible / High Stakes)',
    summary: 'A long-term capital allocation dilemma balancing forced equity accumulation and lifestyle permanence against liquidity, mobility, and compound stock market growth.',
    options: [
      {
        id: 'opt-buy',
        title: 'Option A: Buy $750k Suburban Home',
        description: 'Commit $150k down payment + closing costs into real property. Establish permanent roots and hedge against regional rental inflation.',
        pros: [
          {
            id: 'p1',
            text: 'Long-term equity accumulation and mortgage principal paydown',
            impact: 4,
            category: 'Financial',
            note: 'Acts as forced savings vehicle over a 15-30 year horizon.',
          },
          {
            id: 'p2',
            text: 'Full sovereignty to renovate, landscape, and customize living space',
            impact: 5,
            category: 'Well-being',
            note: 'High psychological utility and satisfaction for growing family.',
          },
          {
            id: 'p3',
            text: 'Protection against unpredictable rent increases or landlord lease non-renewals',
            impact: 4,
            category: 'Stability',
            note: 'Predictable fixed-rate mortgage payment for 30 years.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'Extreme illiquidity and high friction transaction costs (6-8% upon future sale)',
            impact: 5,
            category: 'Financial',
            note: 'Ties up $180k in cash reserves that cannot be accessed quickly in emergencies.',
            mitigation: 'Preserve at least a 6-month liquid cash reserve separate from down payment.',
          },
          {
            id: 'c2',
            text: 'Uncapped maintenance liability (roof, HVAC, property taxes, HOA fees)',
            impact: 4,
            category: 'Risk',
            note: 'The mortgage is the minimum you will pay; rent is the maximum you will pay.',
            mitigation: 'Budget an annual 1.5% property value ($11k/yr) maintenance sinking fund.',
          },
        ],
        swot: {
          strengths: ['Predictable fixed housing base', 'Large physical space, yard, and storage for children', 'Access to top-rated public school district'],
          weaknesses: ['High monthly outlay ($5,100/mo) limiting savings rate', '45-minute suburban commute compared to 15-minute city transit'],
          opportunities: ['Refinance mortgage if interest rates drop into the 5% range in future years', 'Property value appreciation in high-growth school boundary'],
          threats: ['Local municipal property tax re-assessments increasing escrow', 'Unanticipated foundation or plumbing failures in year 1-3'],
          strategicTakeaways: ['Ensure purchase is made with minimum 7-10 year commitment horizon to overcome initial closing fee drag.'],
        },
        costBenefit: {
          directCosts: [
            { item: 'Down Payment & Closing Costs', estimate: '$165,000 one-time', frequency: 'One-time' },
            { item: 'Monthly Outlay (PITI + Maintenance)', estimate: '$5,100 / month', frequency: 'Recurring' },
          ],
          indirectCosts: [
            { item: 'Commute time loss', description: 'Additional 1 hour roundtrip daily driving vs downtown walking.' },
            { item: 'Opportunity cost of $165k lump sum out of index equities', description: 'At historical 8% return, $165k compounds to $356k in 10 years.' },
          ],
          tangibleBenefits: [
            { item: 'Equity principal paid down over first 7 years', estimate: '~ $78,000' },
            { item: 'Projected appreciation at 3.5% over 7 years', estimate: '~ $204,000 value gain' },
          ],
          intangibleBenefits: [
            { item: 'Deep sense of permanence and community neighborhood belonging', description: 'Stable environment for child upbringing.' },
          ],
          netSummary: 'High upfront cash drag and high monthly fixed commitment, but yields high psychological satisfaction and leveraged real estate equity if held 7+ years.',
          roiTimeline: 'Break-even after 5-7 years against renting and investing.',
        },
      },
      {
        id: 'opt-rent',
        title: 'Option B: Rent Downtown & Invest Surplus in Index Funds',
        description: 'Rent a $3,100/mo luxury downtown apartment. Invest $150k liquid capital + $2,000/mo monthly savings into low-cost diversified global index funds.',
        pros: [
          {
            id: 'p1',
            text: 'Maximum financial flexibility and instant 100% liquidity of net worth',
            impact: 5,
            category: 'Financial',
            note: 'Capital can be mobilized instantly for market opportunities or career moves.',
          },
          {
            id: 'p2',
            text: '$2,000 monthly cash surplus compounded into high-yield equities',
            impact: 5,
            category: 'Financial',
            note: 'Zero maintenance headaches; landlord covers all repairs and amenities.',
          },
          {
            id: 'p3',
            text: 'Low commute stress and vibrant walkable urban lifestyle',
            impact: 4,
            category: 'Well-being',
            note: '15-minute commute saves ~200 hours of vehicle transit per year.',
          },
        ],
        cons: [
          {
            id: 'c1',
            text: 'Vulnerability to annual rent increases and lease terminations',
            impact: 4,
            category: 'Stability',
            note: 'Lack of long-term control over tenure.',
            mitigation: 'Negotiate 24-month multi-year lease agreements with capped escalators.',
          },
          {
            id: 'c2',
            text: 'Limited space constraints once child reaches toddler years',
            impact: 3,
            category: 'Well-being',
            note: 'Will likely necessitate a move when child reaches school age in 4-5 years.',
            mitigation: 'Re-evaluate suburban purchase in 3-4 years when equity portfolio has grown.',
          },
        ],
        swot: {
          strengths: ['Pure liquid balance sheet with zero debt leverage', 'Urban convenience, walkability to dining, arts, and workplaces'],
          weaknesses: ['Zero equity in physical domicile', 'Restrictions on pets, painting, and architectural alterations'],
          opportunities: ['Stock market compounding historically outperforming residential real estate price growth', 'Freedom to relocate cities if a prime career opportunity arises'],
          threats: ['Downtown rental market escalating faster than salary gains', 'Psychological urge to spend the monthly surplus rather than diligently investing it'],
          strategicTakeaways: ['Requires ironclad automated transfers into index funds on the 1st of every month to beat the real estate forced-savings effect.'],
        },
        costBenefit: {
          directCosts: [
            { item: 'Monthly Rent & Tenant Insurance', estimate: '$3,150 / month', frequency: 'Recurring' },
            { item: 'Security Deposit', estimate: '$3,100 one-time refundable', frequency: 'One-time' },
          ],
          indirectCosts: [
            { item: 'Potential relocation expense if lease is non-renewed', description: '$3,000-$5,000 moving costs every 2-3 years.' },
          ],
          tangibleBenefits: [
            { item: 'Compound value of $150k + $2,000/mo at 8% over 5 years', estimate: '$368,000 liquid portfolio' },
            { item: 'Zero property taxes, HOA fees, or emergency repair expenses', estimate: 'Saved ~$15,000/year' },
          ],
          intangibleBenefits: [
            { item: 'Absolute peace of mind regarding maintenance emergencies', description: 'A burst pipe is a landlord call, not a $10,000 surprise.' },
            { item: 'Geographic and career agility', description: 'Can move in 30 days if desired.' },
          ],
          netSummary: 'Financially superior in expected liquid net worth over 3-5 years, provided the monthly surplus is ruthlessly invested rather than lifestyle-inflated.',
          roiTimeline: 'Immediate compounding advantage.',
        },
      },
    ],
    comparisonMatrix: {
      criteria: [
        { id: 'c-wealth', name: 'Net Worth Accumulation (5-Yr)', weight: 5, description: 'Total equity built after all transaction costs and expenses' },
        { id: 'c-liquidity', name: 'Capital Liquidity & Safety', weight: 4, description: 'Ability to access funds in under 72 hours' },
        { id: 'c-lifestyle', name: 'Family Living Quality & Space', weight: 4, description: 'Readiness for children, yard, and nursery space' },
        { id: 'c-convenience', name: 'Low Maintenance Burden', weight: 3, description: 'Time spent on house chores, repairs, and landscaping' },
        { id: 'c-stability', name: 'Tenure Permanence', weight: 4, description: 'Freedom from landlord decisions or forced moves' },
      ],
      ratings: {
        'opt-buy': {
          'c-wealth': { score: 7, rationale: 'Solid real estate equity, but heavily suppressed in first 5 years by 6.8% interest and closing fees.' },
          'c-liquidity': { score: 3, rationale: 'Net worth locked into residential illiquid brick and mortar.' },
          'c-lifestyle': { score: 9, rationale: 'Exceptional square footage, dedicated nursery, quiet yard, and family environment.' },
          'c-convenience': { score: 4, rationale: 'Significant weekend time lost to maintenance, mowing, and contractor calls.' },
          'c-stability': { score: 10, rationale: 'Permanent ownership; nobody can displace you.' },
        },
        'opt-rent': {
          'c-wealth': { score: 8, rationale: '$150k compounding in S&P 500 historically beats 5-year leveraged home equity at 6.8% mortgage.' },
          'c-liquidity': { score: 10, rationale: 'Complete liquidity; capital can be wired within 48 hours.' },
          'c-lifestyle': { score: 6, rationale: 'Pleasant luxury apartment today, but cramped once baby turns into a toddler.' },
          'c-convenience': { score: 9, rationale: 'Zero maintenance duty; concierge and building maintenance handle all issues.' },
          'c-stability': { score: 5, rationale: 'Subject to landlord whims and annual lease negotiations.' },
        },
      },
    },
    blindspots: [
      'The "Phantom Wealth" Trap: Real estate returns are frequently quoted as gross appreciation, forgetting to deduct property taxes, mortgage interest, homeowners insurance, and transaction fees (which easily total 40-50% of appreciation).',
      'Child Timing Reality: A newborn child does not require a suburban backyard in year 0-2; they mostly sleep in a parent room crib. You have a 3-year runway before schools matter.',
      'Discipline Assumption: Renting only beats buying financially IF the $2,000/mo differential is faithfully auto-invested into index funds instead of spent on luxury lifestyle creep.',
    ],
    devilsAdvocate: {
      'opt-buy': 'Are you rushing into buying a home right now at peak interest rates because you genuinely need the house today, or because society convinced you that renting in your 30s is "throwing money away"?',
      'opt-rent': 'Will you truly possess the behavioral discipline to invest the full $2,000 monthly difference every month for 5 years without spending it on vacations and dining out?',
    },
    recommendation: {
      primaryChoice: 'Option B: Rent Downtown for 2 More Years, Then Reassess',
      verdictRationale: 'Since the baby is 2-3 years away, buying today at 6.8% interest incurs heavy non-recoverable interest, property taxes, and maintenance fees before you actually need the suburban space. Renting for 24 more months while auto-investing the down payment will build a stronger financial fortress and allow you to buy when the child truly needs space.',
      contingencyPlan: 'If regional housing prices begin skyrocketing >10% annualized, shift to pre-approval and target smaller turn-key townhomes.',
      lowRiskNextStep: 'Set up an automated monthly investment simulation for 3 months to test whether you actually save and invest the $2,000 differential.',
      reversibleTest: 'Rent an Airbnb in your target suburban neighborhood for 1 week to test the daily commute and weekend rhythm before committing $165k.',
    },
  },
];
