import re
from app.ai.vector_memory import VectorMemory

class LocalFallbackRouter:
    def __init__(self):
        self.memory = VectorMemory()
        
        # A deep, offline dictionary of root words focused entirely on commercial intent
        self.category_keywords = {
            "Food & Dining": ["CAFE", "REST", "FOOD", "SNACK", "BAKER", "DINER", "BIRYANI", "PIZZA", "BURGER", "SWEET", "DAIRY", "SWIGGY", "ZOMATO"],
            "Shopping": ["MART", "STORE", "RETAIL", "SUPERMARKET", "CLOTH", "APPAREL", "MALL", "GARMENT", "FASHION", "TRADER", "ENTERPRISE", "AGENCIES", "AMAZON", "FLIPKART"],
            "Healthcare": ["HOSP", "PHARMA", "CLINIC", "MED", "DOCTOR", "DIAGNOSTIC", "HEALTH", "CARE", "SURGICAL", "APOLLO"],
            "Utilities & Telecom": ["ELEC", "WATER", "GAS", "TELE", "BROADBAND", "RECHARGE", "BILL", "POWER", "RESET", "BESCOM", "MSEDCL", "JIO", "AIRTEL"],
            "Transportation": ["AUTO", "FUEL", "PETROL", "STATION", "TRANS", "CAB", "METRO", "TOLL", "FASTAG", "RAIL", "IRCTC", "UBER", "OLA"],
            "Investments": ["MUTUAL", "FUND", "AMC", "SECURITIES", "BROKING", "ZERODHA", "GROWW", "UPSTOX", "SIP"],
            "Cash Handling": ["ATM", "CASH", "WITHDRAWAL"],
            "Transfers": ["RENT", "LEASE", "PG", "HOSTEL"]
        }

    def categorize_unknown(self, raw_string: str) -> str:
        """
        Tokenizes the raw string and mathematically scores it against our offline dictionary.
        """
        clean_text = re.sub(r"[^\w\s]", " ", raw_string).upper()
        tokens = clean_text.split()
        
        # EXPLICIT SYSTEM FILTER: Strip out structural transaction tags 
        # so they never pollute commercial keyword matching.
        banking_noise = ["DR", "CR", "UPI", "WDL", "TFR", "TRANSFER", "REF", "IFT", "IMPS", "NEFT", "RTGS", "ONLINE"]
        tokens = [t for t in tokens if t not in banking_noise]
        
        best_category = "Miscellaneous"
        highest_score = 0

        # Score the transaction against our dictionary
        for category, keywords in self.category_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in tokens:
                    score += 2
                elif any(keyword in token for token in tokens):
                    score += 1
            
            if score > highest_score:
                highest_score = score
                best_category = category

        # Only learn it if it confidently matched a real merchant keyword
        if highest_score > 0:
            clean_name = raw_string.split('/')[-1].title() if '/' in raw_string else raw_string.title()
            self.memory.learn(raw_string, clean_name, best_category)
            print(f"[LOCAL ROUTER] Successfully categorized: {clean_name} -> {best_category}")
            return best_category
            
        return "Miscellaneous"