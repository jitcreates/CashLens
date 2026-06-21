from typing import List, Dict, Any

class InsightEngine:
    def __init__(self):
        pass

    def generate_insights(self, health_data: Dict[str, Any], behavior_data: Dict[str, Any], leak_data: Dict[str, Any]) -> List[str]:
        insights = []

        # 1. Evaluate cash flow and savings rate indicators
        breakdown = health_data.get("breakdown", {})
        cash_flow = breakdown.get("cash_flow_strength", 50)
        if cash_flow >= 80:
            insights.append("Your net cash flow remains exceptionally strong, consistently maintaining a healthy surplus between cycles.")
        elif cash_flow < 40:
            insights.append("Narrow structural margins detected: current consumption tracks closely to total income inflows.")

        # 2. Extract lifestyle inflation observations
        inflation = behavior_data.get("lifestyle_inflation", {})
        if inflation.get("detected"):
            growth = inflation.get("expense_growth_rate", 0.0)
            insights.append(f"Lifestyle inflation alert: monthly outflows expanded by {growth}% without a matching change in income.")

        # 3. Extract weekend vs weekday multipliers
        weekend_factor = behavior_data.get("weekend_vs_weekday_factor", 1.0)
        if weekend_factor >= 2.0:
            insights.append(f"Weekend spending velocity spikes significantly, tracking at {weekend_factor}x your average weekday baseline.")

        # 4. Highlight merchant dependencies
        dependency = behavior_data.get("merchant_dependency", {})
        if dependency.get("allocation_ratio", 0.0) >= 25.0:
            merchant = dependency.get("primary_merchant", "Unknown")
            ratio = dependency.get("allocation_ratio", 0.0)
            insights.append(f"Concentration risk identified: {merchant} accounts for {ratio}% of total tracked debit transactions.")

        # 5. Highlight structural leaks
        leaks = leak_data.get("leaks", {})
        if "food_delivery" in leaks:
            food = leaks["food_delivery"]
            if food.get("order_count", 0) > 10:
                insights.append(f"High-frequency food delivery detected ({food.get('order_count')} orders). Projected annual leak: ₹{food.get('estimated_annual_cost')}.")

        if behavior_data.get("impulse_velocity_detected"):
            insights.append("Impulse velocity pattern flag: multiple retail transactions logged within tight, consecutive 24-hour windows.")

        # Fallback if profile behaves optimally across categories
        if not insights:
            insights.append("Transactional structure is balanced with zero anomalous spending surges or leak indicators detected.")

        return insights