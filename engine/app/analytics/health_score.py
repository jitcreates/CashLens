import pandas as pd
from typing import List, Dict, Any

class FinancialHealthScore:
    def __init__(self):
        pass

    def calculate(self, transactions: List[Dict[str, Any]], subscription_summary: Dict[str, Any]) -> Dict[str, Any]:
        if not transactions:
            return {"overall_score": 0, "breakdown": {}, "grade": "F"}

        df = pd.DataFrame(transactions)
        
        total_income = df[df['type'] == 'credit']['amount'].sum()
        total_expense = df[df['type'] == 'debit']['amount'].sum()
        
        if total_income == 0:
            return {"overall_score": 0, "breakdown": {}, "grade": "F"}

        # Metric 1: Cash Flow Strength
        savings_rate = (total_income - total_expense) / total_income
        cash_flow_score = max(0, min(100, int(savings_rate * 200))) 

        # Metric 2: Saving Discipline
        saving_discipline = 85 if savings_rate > 0.20 else max(0, int(savings_rate * 400))

        # Metric 3: Subscription Efficiency
        sub_cost = subscription_summary.get("monthly_cost", 0.0)
        sub_ratio = sub_cost / total_income if total_income > 0 else 0
        sub_efficiency = max(0, min(100, int(100 - (sub_ratio * 500))))

        # Metric 4: Spending Stability
        debits = df[df['type'] == 'debit']
        if len(debits) > 1:
            variance_factor = debits['amount'].std() / debits['amount'].mean() if debits['amount'].mean() > 0 else 1
            spending_stability = max(0, min(100, int(100 - (variance_factor * 20))))
        else:
            spending_stability = 70

        # Metric 5: Financial Resilience
        net_savings = total_income - total_expense
        resilience_score = 90 if net_savings > (total_expense * 0.5) else 70

        overall_score = int(
            (cash_flow_score * 0.30) +
            (saving_discipline * 0.25) +
            (spending_stability * 0.20) +
            (sub_efficiency * 0.15) +
            (resilience_score * 0.10)
        )
        overall_score = max(0, min(100, overall_score))

        if overall_score >= 90: grade = "A+"
        elif overall_score >= 80: grade = "A"
        elif overall_score >= 70: grade = "B"
        elif overall_score >= 60: grade = "C"
        else: grade = "D"

        return {
            "overall_score": overall_score,
            "grade": grade,
            "breakdown": {
                "cash_flow_strength": cash_flow_score,
                "saving_discipline": saving_discipline,
                "spending_stability": spending_stability,
                "subscription_efficiency": sub_efficiency,
                "financial_resilience": resilience_score
            }
        }