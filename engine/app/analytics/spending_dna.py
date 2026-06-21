import pandas as pd
from typing import List, Dict, Any

class SpendingDna:
    def __init__(self):
        pass

    def determine_profile(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not transactions:
            return {
                "profile_name": "The Observer",
                "traits": ["Insufficient transaction history to generate a baseline financial identity."]
            }

        df = pd.DataFrame(transactions)
        
        debits = df[df['type'] == 'debit']
        credits = df[df['type'] == 'credit']
        
        total_expense = debits['amount'].sum()
        total_income = credits['amount'].sum()

        if total_expense == 0:
            return {
                "profile_name": "The Saver",
                "traits": ["Zero discretionary or essential outflows recorded in this statement."]
            }

        # Calculate allocation ratios dynamically
        category_totals = debits.groupby('category')['amount'].sum()
        
        investment_ratio = category_totals.get("Investments", 0.0) / total_expense
        food_ratio = category_totals.get("Food & Dining", 0.0) / total_expense
        travel_ratio = category_totals.get("Travel", 0.0) / total_expense
        shopping_ratio = category_totals.get("Shopping", 0.0) / total_expense

        savings_rate = (total_income - total_expense) / total_income if total_income > 0 else 0.0

        # Behavioral matching evaluation matrix
        if investment_ratio >= 0.15:
            return {
                "profile_name": "The Investor",
                "traits": [
                    "Prioritizes future wealth building over short-term consumption.",
                    "Maintains consistent capital allocation strategies.",
                    "Displays low impulse purchasing vulnerabilities."
                ]
            }

        if food_ratio >= 0.25 or (shopping_ratio >= 0.20 and len(debits[debits['category'] == 'Shopping']) > 8):
            return {
                "profile_name": "The Convenience Buyer",
                "traits": [
                    "High frequency of localized app-based platform transactions.",
                    "Susceptible to subscription stack overheads.",
                    "Substantial capital allocated to immediate lifestyle delivery services."
                ]
            }

        if travel_ratio >= 0.20:
            return {
                "profile_name": "The Explorer",
                "traits": [
                    "Highly variable monthly transactional volatility profiles.",
                    "Outflows concentrated heavily on mobility, transit, and temporary experiences.",
                    "Discretionary spikes occur outside localized geographic networks."
                ]
            }

        if savings_rate >= 0.25 and shopping_ratio < 0.15:
            return {
                "profile_name": "The Planner",
                "traits": [
                    "Maintains a strict, predictable structural cost balance.",
                    "Consistently logs protective surplus margins across cash cycles.",
                    "Exhibits deep resistance to aggressive commercial marketing events."
                ]
            }

        return {
            "profile_name": "The Balanced Consumer",
            "traits": [
                "Maintains multi-category structural dispersion.",
                "Outflows track standard macroeconomic consumption behaviors.",
                "Modest structural safety margins present between cycles."
            ]
        }