import re
import io
import pdfplumber
from datetime import datetime

class SBIParser:
    def parse(self, file_contents: bytes) -> list:
        transactions = []
        pdf_file = io.BytesIO(file_contents)
        
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                if not tables:
                    text = page.extract_text() or ""
                    transactions.extend(self._parse_text_lines_fallback(text))
                    continue
                    
                for table in tables:
                    for row in table:
                        if not row or len(row) < 5:
                            continue
                            
                        date_str = (row[0] or "").strip()
                        if not re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}$", date_str):
                            continue
                            
                        desc = (row[2] or "").strip()
                        debit_val = (row[4] or "").strip() if len(row) > 4 else ""
                        credit_val = (row[5] or "").strip() if len(row) > 5 else ""
                        
                        debit_amt = self._clean_amount(debit_val)
                        credit_amt = self._clean_amount(credit_val)
                        
                        if debit_amt == 0.0 and credit_amt == 0.0:
                            continue
                            
                        if debit_amt > 0.0:
                            tx_type = "debit"
                            tx_amount = debit_amt
                        else:
                            tx_type = "credit"
                            tx_amount = credit_amt

                        transactions.append({
                            "date": self._normalize_date(date_str),
                            "description": desc,
                            "amount": tx_amount,
                            "type": tx_type
                        })
                        
        return transactions

    def _clean_amount(self, val: str) -> float:
        if not val or val.strip() == "-":
            return 0.0
        cleaned = re.sub(r"[^\d.]", "", val.replace("\n", "").strip())
        try:
            return float(cleaned) if cleaned else 0.0
        except ValueError:
            return 0.0

    def _normalize_date(self, date_str: str) -> str:
        try:
            sep = "-" if "-" in date_str else "/"
            dt = datetime.strptime(date_str, f"%d{sep}%m{sep}%Y")
            return dt.strftime("%Y-%m-%d")
        except Exception:
            return date_str

    def _parse_text_lines_fallback(self, text: str) -> list:
        transactions = []
        lines = text.split("\n")
        for line in lines:
            date_match = re.match(r"^(\d{2}[-/]\d{2}[-/]\d{4})\s+(\d{2}[-/]\d{2}[-/]\d{4})\s+(.+)$", line.strip())
            if not date_match:
                continue
            date_str, _, remainder = date_match.groups()
            amounts = re.findall(r"\d{1,3}(?:,\d{2,3})*\.\d{2}", remainder)
            if not amounts:
                continue
                
            is_debit = any(x in line.upper() for x in ["WDL", "/DR/", "CHRG", "DEBIT"])
            tx_amount = self._clean_amount(amounts[0])
            
            transactions.append({
                "date": self._normalize_date(date_str),
                "description": line.strip(),
                "amount": tx_amount,
                "type": "debit" if is_debit else "credit"
            })
        return transactions