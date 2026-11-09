export type FrameworkType = 'all' | 'pros-cons' | 'comparison' | 'swot' | 'cost-benefit';

export interface ProConItem {
  id: string;
  text: string;
  impact: number; // 1 to 5
  category: string;
  note?: string;
  mitigation?: string;
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicTakeaways?: string[];
}

export interface CostBenefitItem {
  item: string;
  estimate?: string;
  frequency?: string;
  description?: string;
}

export interface CostBenefitData {
  directCosts: CostBenefitItem[];
  indirectCosts: CostBenefitItem[];
  tangibleBenefits: CostBenefitItem[];
  intangibleBenefits: CostBenefitItem[];
  netSummary: string;
  roiTimeline?: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotData;
  costBenefit: CostBenefitData;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
}

export interface CriterionRating {
  score: number; // 1 to 10
  rationale: string;
}

export interface ComparisonMatrix {
  criteria: ComparisonCriterion[];
  ratings: Record<string, Record<string, CriterionRating>>; // optionId -> criterionId -> rating
}

export interface DecisionRecommendation {
  primaryChoice: string;
  verdictRationale: string;
  contingencyPlan: string;
  lowRiskNextStep: string;
  reversibleTest?: string;
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  coreQuestion: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
  decisionType: 'Type 1 (Irreversible / High Stakes)' | 'Type 2 (Reversible / Flexible)';
  summary: string;
  options: DecisionOption[];
  comparisonMatrix: ComparisonMatrix;
  blindspots: string[];
  devilsAdvocate: Record<string, string>;
  recommendation: DecisionRecommendation;
  modelUsed?: string;
  isFallback?: boolean;
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
