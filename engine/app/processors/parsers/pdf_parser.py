import io
import pdfplumber
from app.processors.parsers.banks.sbi_parser import SBIParser

class PDFStatementRouter:
    def __init__(self):
        # We will add more banks (HDFC, ICICI, Axis) here later
        self.parsers = {
            "sbi": SBIParser(),
            # "hdfc": HDFCParser(), 
            # "icici": ICICIParser(),
        }

    def _detect_bank_signature(self, file_contents: bytes) -> str:
        """
        Reads the first page of the PDF to find the bank's unique footprint.
        """
        pdf_file = io.BytesIO(file_contents)
        try:
            with pdfplumber.open(pdf_file) as pdf:
                if not pdf.pages:
                    return "unknown"
                
                # Extract text from just the first page to identify the bank
                first_page_text = (pdf.pages[0].extract_text() or "").upper()
                
                # Fingerprinting logic
                if "STATE BANK OF INDIA" in first_page_text or "SBI" in first_page_text:
                    return "sbi"
                elif "HDFC BANK" in first_page_text:
                    return "hdfc"
                elif "ICICI BANK" in first_page_text:
                    return "icici"
                    
                return "unknown"
        except Exception as e:
            return "unknown"

    def parse(self, file_contents: bytes) -> list:
        # 1. Identify the Bank
        bank_id = self._detect_bank_signature(file_contents)
        
        if bank_id == "unknown":
            raise ValueError("Unsupported or unrecognizable bank statement format.")
            
        if bank_id not in self.parsers:
            raise NotImplementedError(f"Detected {bank_id.upper()}, but the parsing engine for this bank is not yet built.")
            
        # 2. Route the file to the specific bank's engine
        selected_parser = self.parsers[bank_id]
        return selected_parser.parse(file_contents)

PDFStatementParser = PDFStatementRouter