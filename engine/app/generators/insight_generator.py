class InsightGenerator:
    def __init__(self):
        pass

    def generate(self, behavioral_analytics, transactions=None):
        insights = []
        
        # Weekend vs Weekday Velocity
        if behavioral_analytics.weekend_vs_weekday_factor > 1.5:
            insights.append(f"High Weekend Velocity: You spend {behavioral_analytics.weekend_vs_weekday_factor}x more on weekends than weekdays.")
            
        # Merchant Dependency Check
        primary = behavioral_analytics.merchant_dependency.primary_merchant
        ratio = behavioral_analytics.merchant_dependency.allocation_ratio
        if ratio > 20:
            insights.append(f"Merchant Dependency: {ratio}% of your transaction volume goes to a single merchant ({primary}).")
            
        # Discretionary Drain Warning
        if behavioral_analytics.late_range_discretionary_ratio > 40:
            insights.append("Late-Cycle Drain: High discretionary spending detected in the final week of the billing cycle.")
            
        # Impulse check
        if behavioral_analytics.impulse_velocity_detected:
            insights.append("Micro-Transaction Leak: High frequency of small, fragmented purchases detected.")
            
        if not insights:
            insights.append("Your transactional behavior is highly stabilized with no critical leakages.")
            
        return insights