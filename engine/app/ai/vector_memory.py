import os
import json
from rapidfuzz import process, fuzz

class VectorMemory:
    def __init__(self):
        # We will store our "learned" transactions in a local JSON file 
        # so you don't lose them when the server restarts.
        self.memory_file = "app/ai/learned_merchants.json"
        self.memory_bank = self._load_memory()

    def _load_memory(self) -> dict:
        if os.path.exists(self.memory_file):
            with open(self.memory_file, 'r') as f:
                return json.load(f)
        return {}

    def _save_memory(self):
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.memory_file), exist_ok=True)
        with open(self.memory_file, 'w') as f:
            json.dump(self.memory_bank, f, indent=4)

    def learn(self, messy_string: str, clean_name: str, category: str):
        """
        Teaches the engine a new string. 
        Example: learn("UPI/DR/PAYTMQR281", "Baazar Retail", "Shopping")
        """
        normalized_string = messy_string.upper().strip()
        self.memory_bank[normalized_string] = {
            "clean_name": clean_name,
            "category": category
        }
        self._save_memory()

    def search(self, messy_string: str) -> dict:
        """
        Fuzzy matches a new transaction against the learned memory bank.
        """
        if not self.memory_bank:
            return None

        normalized_string = messy_string.upper().strip()
        
        # 1. Check for an exact match first (O(1) lookup)
        if normalized_string in self.memory_bank:
            return self.memory_bank[normalized_string]

        # 2. Perform Semantic/Fuzzy Search
        known_strings = list(self.memory_bank.keys())
        
        # Extract the closest match mathematically
        best_match = process.extractOne(
            normalized_string, 
            known_strings, 
            scorer=fuzz.token_set_ratio, 
            score_cutoff=85.0 # Must be an 85% mathematical match or higher
        )

        if best_match:
            matched_key = best_match[0]
            return self.memory_bank[matched_key]
            
        return None