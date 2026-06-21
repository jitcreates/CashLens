from pydantic import BaseModel
from typing import List

class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    type: str  # 'debit' or 'credit'
    merchant: str
    category: str

class HealthScoreBreakdown(BaseModel):
    cash_flow_strength: float
    saving_discipline: float
    spending_stability: float
    subscription_efficiency: float
    financial_resilience: float

class HealthScore(BaseModel):
    overall_score: int
    grade: str
    breakdown: HealthScoreBreakdown

class SpendingDna(BaseModel):
    profile_name: str
    traits: List[str]

class MerchantDependency(BaseModel):
    primary_merchant: str
    allocation_ratio: float

class LifestyleInflation(BaseModel):
    detected: bool
    expense_growth_rate: float

class BehavioralAnalytics(BaseModel):
    weekend_vs_weekday_factor: float
    merchant_dependency: MerchantDependency
    late_range_discretionary_ratio: float
    lifestyle_inflation: LifestyleInflation
    impulse_velocity_detected: bool

class AnalysisPayload(BaseModel):
    transactions: List[Transaction]
    health_score: HealthScore
    spending_dna: SpendingDna
    behavioral_analytics: BehavioralAnalytics
    insights: List[str]
    financial_story: str

# The main response wrapper expected by main.py
class AnalysisResponse(BaseModel):
    status: str
    message: str
    data: AnalysisPayload