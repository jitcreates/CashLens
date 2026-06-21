export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  merchant: string;
  category: string;
}

export interface HealthScoreBreakdown {
  cash_flow_strength: number;
  saving_discipline: number;
  spending_stability: number;
  subscription_efficiency: number;
  financial_resilience: number;
}

export interface HealthScore {
  overall_score: number;
  grade: string;
  breakdown: HealthScoreBreakdown;
}

export interface SpendingDna {
  profile_name: string;
  traits: string[];
}

export interface MerchantDependency {
  primary_merchant: string;
  allocation_ratio: number;
}

export interface LifestyleInflation {
  detected: boolean;
  expense_growth_rate: number;
}

export interface BehavioralAnalytics {
  weekend_vs_weekday_factor: number;
  merchant_dependency: MerchantDependency;
  late_range_discretionary_ratio: number;
  lifestyle_inflation: LifestyleInflation;
  impulse_velocity_detected: boolean;
}

export interface AnalysisPayload {
  transactions: Transaction[];
  health_score: HealthScore;
  spending_dna: SpendingDna;
  behavioral_analytics: BehavioralAnalytics;
  insights: string[];
  financial_story: string;
}