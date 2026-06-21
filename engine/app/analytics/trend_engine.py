import math
from collections import defaultdict
from datetime import datetime

class TrendAnalyzer:
    def __init__(self):
        # We flag any transaction that is 2.5x larger than the average transaction
        self.anomaly_multiplier = 2.5 

    def analyze(self, transactions: list, tenure: str) -> dict:
        monthly_buckets = defaultdict(lambda: {
            "inflow": 0.0, 
            "outflow": 0.0, 
            "categories": defaultdict(float)
        })
        
        total_inflow = 0.0
        total_outflow = 0.0
        expense_amounts = []

        # 1. First Pass: Aggregate Data & Group by Month
        for tx in transactions:
            amt = float(tx.get("amount", 0.0))
            raw_date = tx.get("date", "")
            cat = tx.get("category", "Miscellaneous")
            tx_type = tx.get("type")

            # Parse date to extract "YYYY-MM" (Assumes YYYY-MM-DD input from parser)
            try:
                # If date is DD/MM/YYYY
                if "/" in raw_date:
                    dt = datetime.strptime(raw_date, "%d/%m/%Y")
                else:
                    dt = datetime.strptime(raw_date, "%Y-%m-%d")
                month_key = dt.strftime("%b %Y") # e.g., "Jun 2026"
            except:
                month_key = "Unknown"

            if tx_type == "credit":
                monthly_buckets[month_key]["inflow"] += amt
                total_inflow += amt
            elif tx_type == "debit":
                monthly_buckets[month_key]["outflow"] += amt
                monthly_buckets[month_key]["categories"][cat] += amt
                total_outflow += amt
                expense_amounts.append({"tx": tx, "amount": amt, "month": month_key})

        # 2. Second Pass: Anomaly Detection (The "Bad Points")
        anomalies = []
        if len(expense_amounts) > 2:
            # Calculate Mean
            mean_expense = sum(e["amount"] for e in expense_amounts) / len(expense_amounts)
            
            # Calculate Standard Deviation
            variance = sum((e["amount"] - mean_expense) ** 2 for e in expense_amounts) / len(expense_amounts)
            stdev = math.sqrt(variance)
            
            # Define the danger threshold (Mean + 2.5 * Sigma)
            danger_threshold = mean_expense + (stdev * self.anomaly_multiplier)

            for item in expense_amounts:
                # If a transaction blows past the standard deviation threshold and isn't an investment
                if item["amount"] > danger_threshold and item["tx"].get("category") not in ["Investments", "Transfers"]:
                    anomalies.append({
                        "date": item["tx"]["date"],
                        "merchant": item["tx"]["merchant"],
                        "amount": item["amount"],
                        "category": item["tx"]["category"],
                        "severity": "HIGH",
                        "context": f"Spike detected: {int((item['amount'] / mean_expense) * 100)}% above normal median spend."
                    })

        # 3. Format Data for the UI Graphs
        formatted_trends = []
        for month, data in monthly_buckets.items():
            formatted_trends.append({
                "month": month,
                "inflow": data["inflow"],
                "outflow": data["outflow"],
                "top_drain": max(data["categories"], key=data["categories"].get) if data["categories"] else "None"
            })

        # Sort chronologically (rough sort based on dictionary order preservation)
        formatted_trends.reverse() 

        return {
            "tenure_processed": f"{tenure} Months",
            "global_metrics": {
                "total_inflow": total_inflow,
                "total_outflow": total_outflow,
                "net_retention": total_inflow - total_outflow
            },
            "monthly_trends": formatted_trends,
            "anomaly_signals": sorted(anomalies, key=lambda x: x["amount"], reverse=True)
        }