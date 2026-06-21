import re
from rapidfuzz import process, fuzz
from app.ai.vector_memory import VectorMemory

class MerchantMatcher:
    def __init__(self):
        # Initialize our new Local AI Vector Memory
        self.memory = VectorMemory()
        
        # Known merchant matching database
        self.merchant_directory = {
            "Swiggy": ["swiggy", "swgy", "swiggy instamart"],
            "Zomato": ["zomato", "zmto", "zomato online"],
            "Amazon": ["amazon", "amzn", "amzn mktplace", "amazon pay"],
            "Uber": ["uber", "uber trip", "uber india"],
            "Ola": ["ola cabs", "olacabs"],
            "Netflix": ["netflix", "netflix entertainment"],
            "Spotify": ["spotify", "spotify india"],
            "Google One": ["google storage", "googleone", "gpay google"],
            "ChatGPT": ["openai", "chatgpt subscription"],
            "YouTube Premium": ["youtube", "yt premium"],
            "Flipkart": ["flipkart", "fkrt", "paytm-5650"],
            "Myntra": ["myntra", "myntra marketplace"],
            "Starbucks": ["starbucks", "starbucks coffee"],
            "Jio": ["jio rech", "jioinappdi", "reliance/jio", "jio@citiba"],
            "Airtel": ["airtel", "airtelpred"],
            "KFC": ["kfc", "devyanikfc"],
            "Apollo Pharmacy": ["apollophar", "apollo p"],
            "Baazar Retail": ["baazar r", "paytmqr281"]
        }
        
        # Phase 0: Structural Overrides for Bank Infrastructure Actions
        self.structural_overrides = {
            "FIRDF": "SBI Fixed Deposit",
            "ATM WDL": "ATM Cash Withdrawal",
            "CASH DEPOSIT": "Branch Cash Deposit",
            "ACH/": "ACH Transfer",
            "NEFT/": "NEFT Transfer",
            "RTGS/": "RTGS Transfer",
            "IMPS/": "IMPS Transfer"
        }

        # Compile noise patterns to clean raw bank text strings
        self.noise_patterns = re.compile(
            r"[\d\s\-:\/]+|POS|NOD|ONLINE|CRD|DR|VPS|MKTPLACE|ECOM|TRANSFER|WWW\.|UPI|IMPS|NEFT|RTGS|REF|WDL|DEP|TFR|AT|NAGARUKHRA", 
            re.IGNORECASE
        )

    def clean_description(self, raw_description: str) -> str:
        if not raw_description:
            return "Unknown Entity"
            
        raw_upper = raw_description.upper().strip()
        
        # --- PILLAR 2: Vector Cache Check ---
        # Ask our local memory if we've seen this exact or structurally similar messy string before.
        cached_match = self.memory.search(raw_upper)
        if cached_match:
            return f"CACHED: {cached_match['clean_name']} | {cached_match['category']}"
        # ------------------------------------
        
        # Phase 0: Structural Intercept (Catch FDs, ATMs)
        for key, clean_name in self.structural_overrides.items():
            if key in raw_upper:
                return clean_name

        # --- PILLAR 1: The P2P UPI Intercept ---
        if "UPI/" in raw_upper:
            parts = raw_upper.split('/')
            if len(parts) >= 4:
                potential_name = parts[3].strip()
                if potential_name.isalpha() and len(potential_name) > 2:
                    return f"P2P: {potential_name.title()}"
        # ---------------------------------------

        # Strip common banking system transaction jargon codes
        cleaned = self.noise_patterns.sub(" ", raw_description)
        cleaned = re.sub(r"\s+", " ", cleaned).strip().upper()
        
        if not cleaned:
            return "Bank Transfer"

        # Phase 1: Direct sub-string search
        for clean_name, aliases in self.merchant_directory.items():
            for alias in aliases:
                if alias.upper() in cleaned:
                    return clean_name

        # Phase 2: Fuzzy string distance match
        flat_aliases = []
        alias_to_merchant = {}
        for clean_name, aliases in self.merchant_directory.items():
            for alias in aliases:
                normalized_alias = alias.upper()
                flat_aliases.append(normalized_alias)
                alias_to_merchant[normalized_alias] = clean_name

        best_match = process.extractOne(
            cleaned, 
            flat_aliases, 
            scorer=fuzz.token_set_ratio, 
            score_cutoff=75.0
        )
        
        if best_match:
            matched_alias = best_match[0]
            return alias_to_merchant[matched_alias]

        # Phase 3: Punctuation and Debris Cleanup for Unknown Entities
        cleaned = re.sub(r"\b[A-Z]\b", "", cleaned) 
        cleaned = re.sub(r"[^\w\s]", "", cleaned) 
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        return cleaned.title() if cleaned else "Bank Transfer"