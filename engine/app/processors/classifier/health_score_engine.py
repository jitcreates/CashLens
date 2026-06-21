class HealthScoreEngine:
    def __init__(self):
        # Wealth-building
        self.savings_categories = ["Investments"]
        
        # STRICT Neutral Categories (Only explicit banking actions allowed here now)
        # Removed "UPI Payment" and "Miscellaneous". If the engine doesn't know 
        # what a debit is, it will assume you spent it on lifestyle.
        self.neutral_categories = [
            "Transfers", 
            "Cash Handling", 
            "Inbound Transfer",
            "Refunds"
        ]

    def calculate(self, transactions: list, subscription_summary: dict = None) -> dict:
        total_income = 0.0
        total_outflow = 0.0
        allocated_savings = 0.0
        true_expenses = 0.0

        for tx in transactions:
            amt = float(tx.get("amount", 0.0))
            cat = tx.get("category", "Miscellaneous")
            
            if tx.get("type") == "credit":
                total_income += amt
            elif tx.get("type") == "debit":
                total_outflow += amt # Track absolute total leaving the account
                
                if cat in self.savings_categories:
                    allocated_savings += amt
                elif cat not in self.neutral_categories:
                    # Penalize unknown expenses at 50%
                    if cat == "Miscellaneous":
                        true_expenses += (amt * 0.5)
                    else:
                        true_expenses += amt

        safe_income = total_income if total_income > 0 else 1.0

        # --- THE FIX: LIQUIDITY RETENTION LOGIC ---
        # If the user's inflows are strictly greater than their total outflows, 
        # the leftover money sitting in the bank is mathematically considered "Saved Cash".
        retained_cash = max(0, total_income - total_outflow)
        
        # Total True Savings = explicitly invested money + unspent bank cash
        total_true_savings = allocated_savings + retained_cash
        
        # 1. Balanced Saving Discipline 
        # We consider saving 20% of your income to be a perfect 100/100 score.
        savings_ratio = total_true_savings / safe_income
        saving_discipline = max(0, min(100, int((savings_ratio / 0.20) * 100)))

        # 2. Balanced Cash Flow Strength
        expense_ratio = true_expenses / safe_income
        if expense_ratio > 1.2: 
            cash_flow_strength = 20 # Floor
        else:
            cash_flow_strength = max(20, min(100, int((1.0 - (expense_ratio * 0.75)) * 100)))

        # 3. Dynamic Spending Stability
        spending_stability = max(40, cash_flow_strength - 10)

        # 4. Financial Resilience
        financial_resilience = int((cash_flow_strength * 0.6) + (saving_discipline * 0.4))

        # Final Weighted Score
        overall_score = int(
            (cash_flow_strength * 0.40) + 
            (saving_discipline * 0.35) + 
            (financial_resilience * 0.25)
        )

        if overall_score >= 90: grade = "A"
        elif overall_score >= 75: grade = "B"
        elif overall_score >= 60: grade = "C"
        elif overall_score >= 50: grade = "D"
        else: grade = "F"

        return {
            "overall_score": overall_score,
            "grade": grade,
            "breakdown": {
                "cash_flow_strength": cash_flow_strength,
                "saving_discipline": saving_discipline,
                "spending_stability": spending_stability,
                "subscription_efficiency": 100,
                "financial_resilience": financial_resilience
            }
        }