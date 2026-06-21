from typing import Dict, Any

class FinancialStoryGenerator:
    def __init__(self):
        pass

    def compile_narrative(self, health_score: Dict[str, Any], dna_profile: Dict[str, Any], behavior: Dict[str, Any], leaks: Dict[str, Any]) -> str:
        score = health_score.get("overall_score", 0)
        grade = health_score.get("grade", "F")
        profile = dna_profile.get("profile_name", "The Balanced Consumer")
        
        # Segment 1: Establish baseline metrics
        intro = f"Your overall Financial Health Score stands at {score} (Grade {grade}), identifying your behavioral profile as {profile}. "
        
        # Segment 2: Add cash flow analysis
        breakdown = health_score.get("breakdown", {})
        if breakdown.get("cash_flow_strength", 50) >= 75:
            cash_story = "Your incoming capital provides a protective cushion, meaning you consistently save more than you spend. "
        else:
            cash_story = "Your current transactional footprint reveals a tight balance, where immediate lifestyle consumption leaves little room for safety margins. "

        # Segment 3: Call out the biggest merchant and spending drivers
        dependency = behavior.get("merchant_dependency", {})
        if dependency.get("allocation_ratio", 0.0) >= 20.0:
            merchant_story = f"Outflows show a clear focus area, with {dependency.get('primary_merchant')} driving {dependency.get('allocation_ratio')}% of all debit events. "
        else:
            merchant_story = "Your transaction history is well-distributed, with no single merchant dominating your overall spending. "

        # Segment 4: Detail hidden structural leak factors
        leak_map = leaks.get("leaks", {})
        if "food_delivery" in leak_map:
            delivery = leak_map["food_delivery"]
            leak_story = f"Convenience apps represent your largest financial leak, with {delivery.get('order_count')} orders this month scaling toward a projected annual impact of ₹{delivery.get('estimated_annual_cost')}. "
        else:
            leak_story = "Recurring dynamic overhead stays well under control, showing strong defense against hidden lifestyle costs. "

        # Segment 5: Formulate behavioral trajectory conclusion
        if score >= 80:
            conclusion = "Overall, your behavior reflects excellent control and structural discipline, putting you in a great position to grow your long-term wealth."
        elif score >= 60:
            conclusion = "While your structural foundation is stable, keeping an eye on discretionary spending spikes will help you build a much stronger savings rate."
        else:
            conclusion = "Adjusting recurring overhead costs and cutting back on convenience purchases will be key to breaking the paycheck-to-paycheck cycle."

        return f"{intro}{cash_story}{merchant_story}{leak_story}{conclusion}"