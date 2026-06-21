from app.ai.llm_router import LocalFallbackRouter

class CategoryEngine:
    def __init__(self):
        # Initialize our local offline deep keyword engine
        self.local_router = LocalFallbackRouter()

        # Maps explicitly cleaned merchants or structural intents to robust financial categories
        self.category_map = {
            # Structural & Banking actions
            "SBI Fixed Deposit": "Investments",
            "ATM Cash Withdrawal": "Cash Handling",
            "Branch Cash Deposit": "Cash Handling",
            "Bank Transfer": "Transfers",
            "IMPS Transfer": "Transfers",
            "NEFT Transfer": "Transfers",
            "RTGS Transfer": "Transfers",
            
            # Known Commercial Merchants
            "Swiggy": "Food & Dining",
            "Zomato": "Food & Dining",
            "KFC": "Food & Dining",
            "Starbucks": "Food & Dining",
            
            "Amazon": "Shopping",
            "Flipkart": "Shopping",
            "Myntra": "Shopping",
            "Baazar Retail": "Shopping",
            
            "Uber": "Transportation",
            "Ola": "Transportation",
            
            "Netflix": "Entertainment",
            "Spotify": "Entertainment",
            "YouTube Premium": "Entertainment",
            
            "Google One": "Software & Subscriptions",
            "ChatGPT": "Software & Subscriptions",
            
            "Jio": "Utilities & Telecom",
            "Airtel": "Utilities & Telecom",
            
            "Apollo Pharmacy": "Healthcare"
        }

    def classify(self, merchant_name: str, raw_description: str, tx_type: str) -> str:
        # --- NEW PIPELINE: Read Smart Vector Cache ---
        if merchant_name.startswith("CACHED: "):
            payload = merchant_name.replace("CACHED: ", "")
            parts = payload.split(" | ")
            if len(parts) == 2:
                return parts[1]
        # ---------------------------------------------

        # --- NEW PIPELINE: P2P Safety Net ---
        if merchant_name.startswith("P2P: "):
            return "Transfers"
        # ------------------------------------

        # 1. Exact match against our known categories mapping
        if merchant_name in self.category_map:
            return self.category_map[merchant_name]
            
        # 2. Heuristic fallback for unknown entities
        desc_upper = raw_description.upper()
        
        # Handle all Credits explicitly
        if tx_type == "credit":
            if "SALARY" in desc_upper or "SAL" in desc_upper:
                return "Income"
            if "REFUND" in desc_upper or "REV" in desc_upper:
                return "Refunds"
            return "Inbound Transfer"
            
        # --- NEW PIPELINE: Local Router Fallback ---
        # Instead of instantly throwing it in Miscellaneous, let the offline 
        # NLP keyword system analyze the tokens and check for sub-string matches.
        resolved_category = self.local_router.categorize_unknown(raw_description)
        return resolved_category