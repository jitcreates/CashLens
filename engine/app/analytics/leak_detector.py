import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

class LeakDetector:
    def __init__(self):
        pass

    def analyze(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not transactions:
            return {
                "active_subscriptions": [],
                "subscription_summary": {"monthly_cost": 0.0, "annual_cost": 0.0},
                "leaks": {}
            }

        df = pd.DataFrame(transactions)
        df['date'] = pd.to_datetime(df['date'])
        
        subscriptions = self._detect_subscriptions(df)
        leaks = self._detect_spending_leaks(df)
        
        monthly_sub_cost = sum(sub['cost'] for sub in subscriptions)
        
        return {
            "active_subscriptions": subscriptions,
            "subscription_summary": {
                "monthly_cost": round(monthly_sub_cost, 2),
                "annual_cost": round(monthly_sub_cost * 12, 2)
            },
            "leaks": leaks
        }

    def _detect_subscriptions(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        detected = []
        debits = df[df['type'] == 'debit']
        
        if debits.empty:
            return detected

        grouped = debits.groupby('description')
        for desc, group in grouped:
            if len(group) < 2:
                continue
                
            group = group.sort_values('date')
            intervals = group['date'].diff().dt.days.dropna().tolist()
            
            is_recurring = False
            for days in intervals:
                if 25 <= days <= 35:
                    is_recurring = True
                    break
                    
            if is_recurring or "NETFLIX" in desc.upper() or "SPOTIFY" in desc.upper() or "CHATGPT" in desc.upper():
                avg_amount = group['amount'].mean()
                detected.append({
                    "name": desc.title(),
                    "cost": round(avg_amount, 2),
                    "frequency": "monthly"
                })
                
        return detected

    def _detect_spending_leaks(self, df: pd.DataFrame) -> Dict[str, Any]:
        leaks = {}
        debits = df[df['type'] == 'debit']
        
        if debits.empty:
            return leaks

        food_delivery = debits[debits['description'].str.upper().str.contains("SWIGGY|ZOMATO", na=False)]
        if not food_delivery.empty:
            monthly_count = len(food_delivery)
            total_spent = food_delivery['amount'].sum()
            leaks["food_delivery"] = {
                "order_count": monthly_count,
                "monthly_impact": round(total_spent, 2),
                "estimated_annual_cost": round(total_spent * 12, 2)
            }

        shopping = debits[debits['description'].str.upper().str.contains("AMAZON|FLIPKART", na=False)]
        low_value_shopping = shopping[shopping['amount'] < 1500]
        if not low_value_shopping.empty:
            leaks["shopping_leak"] = {
                "purchase_count": len(low_value_shopping),
                "monthly_impact": round(low_value_shopping['amount'].sum(), 2)
            }

        return leaks