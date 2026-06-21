from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_content: bytes) -> List[Dict[str, Any]]:
        """
        Parses raw file bytes and returns a standardized list of transactions.
        
        Expected output format per transaction:
        {
            "date": "YYYY-MM-DD",
            "description": "RAW TRANSACTION DESCRIPTION TEXT",
            "amount": 1250.50,
            "type": "debit" | "credit",
            "balance": 45000.20  # Optional
        }
        """
        pass

    def _clean_amount(self, amount_str: str) -> float:
        if not amount_str:
            return 0.0
        try:
            cleaned = amount_str.replace(",", "").replace("Cr", "").replace("Dr", "").strip()
            if "(" in cleaned and ")" in cleaned:
                cleaned = "-" + cleaned.replace("(", "").replace(")", "")
            return abs(float(cleaned))
        except ValueError:
            return 0.0

    def _parse_date(self, date_str: str, formats: List[str]) -> Optional[str]:
        cleaned_date = date_str.strip()
        for fmt in formats:
            try:
                return datetime.strptime(cleaned_date, fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        return None