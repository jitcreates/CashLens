import io
import pandas as pd
from typing import List, Dict, Any, Optional
from app.processors.parsers.base_parser import BaseParser

class CSVStatementParser(BaseParser):
    def __init__(self):
        self.date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y"]
        self.header_mappings = {
            "date": ["date", "transaction date", "txndate", "txn date", "value date"],
            "description": ["description", "narration", "transaction remarks", "particulars"],
            "amount": ["amount", "transaction amount", "value"],
            "debit": ["debit", "withdrawal", "dr", "amount (dr)"],
            "credit": ["credit", "deposit", "cr", "amount (cr)"]
        }

    def parse(self, file_content: bytes) -> List[Dict[str, Any]]:
        df = pd.read_csv(io.BytesIO(file_content))
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        resolved_mappings = self._map_headers(df.columns)
        if not resolved_mappings.get("date") or not resolved_mappings.get("description"):
            raise ValueError("Required columns (Date, Description) could not be mapped.")

        transactions = []
        
        for _, row in df.iterrows():
            raw_date = str(row[resolved_mappings["date"]])
            iso_date = self._parse_date(raw_date, self.date_formats)
            if not iso_date or pd.isna(row[resolved_mappings["date"]]):
                continue

            description = str(row[resolved_mappings["description"]]).strip()
            
            amount = 0.0
            tx_type = "debit"

            if resolved_mappings.get("amount") and resolved_mappings["amount"] in df.columns:
                raw_amount = str(row[resolved_mappings["amount"]])
                amount = self._clean_amount(raw_amount)
                if "cr" in raw_amount.lower() or "credit" in raw_amount.lower():
                    tx_type = "credit"
            else:
                debit_col = resolved_mappings.get("debit")
                credit_col = resolved_mappings.get("credit")
                
                debit_val = self._clean_amount(str(row[debit_col])) if debit_col and not pd.isna(row[debit_col]) else 0.0
                credit_val = self._clean_amount(str(row[credit_col])) if credit_col and not pd.isna(row[credit_col]) else 0.0
                
                if credit_val > 0:
                    amount = credit_val
                    tx_type = "credit"
                else:
                    amount = debit_val
                    tx_type = "debit"

            if amount == 0.0 and description == "":
                continue

            transactions.append({
                "date": iso_date,
                "description": description,
                "amount": amount,
                "type": tx_type
            })

        return sorted(transactions, key=lambda x: x["date"])

    def _map_headers(self, columns: List[str]) -> Dict[str, Optional[str]]:
        mapped = {}
        for internal_key, variations in self.header_mappings.items():
            mapped[internal_key] = None
            for col in columns:
                if col in variations:
                    mapped[internal_key] = col
                    break
        return mapped