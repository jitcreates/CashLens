from app.processors.parsers.pdf_parser import PDFStatementParser
from app.processors.parsers.csv_parser import CSVStatementParser

def get_parser(file_extension: str):
    ext = file_extension.lower().strip(".")
    if ext == "pdf":
        return PDFStatementParser()
    elif ext in ["csv", "txt"]:
        return CSVStatementParser()
    else:
        raise ValueError(f"Unsupported file format extension: {ext}")