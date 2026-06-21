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

        # --- HIGH-LEVEL ALGORITHMIC MATH ---
        
        # 1. Soft-Penalty Savings Discipline
        liquid_retention = max(0, total_income - total_outflow)
        liquidity_deficit = max(0, total_outflow - total_income)
        
        if liquidity_deficit > 0:
            # If they ran a deficit, we don't zero out their FD investments immediately.
            # We apply a 40% "burn penalty" against their explicit savings.
            effective_savings = max(0, allocated_savings - (liquidity_deficit * 0.40))
        else:
            # If they stayed green, they get credit for investments + leftover cash.
            effective_savings = allocated_savings + liquid_retention

        # Grade against a strict 35% target ratio
        savings_ratio = effective_savings / safe_income
        saving_discipline = max(0, min(100, int((savings_ratio / 0.35) * 100)))

        # 2. Dynamic Cash Flow Strength (Smoothed Curve, No Cliffs)
        expense_ratio = true_expenses / safe_income
        
        # If expense ratio is 0.3 (spent 30%), score caps at 100.
        # If expense ratio is 0.8 (spent 80%), score is 50.
        # If expense ratio is > 1.25 (spent 125%), score hits the floor of 5.
        cash_flow_strength = max(5, min(100, int((1.3 - expense_ratio) * 100)))

        # 3. Stability & Resilience
        spending_stability = max(30, cash_flow_strength - 10)
        financial_resilience = int((cash_flow_strength * 0.5) + (saving_discipline * 0.5))

        # 4. Final Weighted Score
        overall_score = int(
            (cash_flow_strength * 0.35) + 
            (saving_discipline * 0.40) + 
            (financial_resilience * 0.25)
        )

        # Institutional Grading Curve
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