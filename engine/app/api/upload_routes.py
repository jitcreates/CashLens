from fastapi import APIRouter, UploadFile, File, HTTPException
from app.processors.parsers import get_parser
from app.processors.cleaner.merchant_matcher import MerchantMatcher
from app.processors.classifier.category_engine import CategoryEngine
from app.core.config import settings

router = APIRouter()

merchant_matcher = MerchantMatcher()
category_engine = CategoryEngine()

@router.post("/upload")
async def upload_and_process_file(file: UploadFile = File(...)):
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid file target.")
        
    ext = filename.split(".")[-1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Extension .{ext} not supported.")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds maximum 10MB threshold.")

    try:
        parser = get_parser(ext)
        raw_transactions = parser.parse(contents)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Processing exception encountered: {str(e)}")

    processed = []
    for tx in raw_transactions:
        clean_merchant = merchant_matcher.clean_description(tx["description"])
        assigned_category = category_engine.classify(clean_merchant, tx["description"], tx["type"])
        
        processed.append({
            "date": tx["date"],
            "description": tx["description"],
            "amount": tx["amount"],
            "type": tx["type"],
            "merchant": clean_merchant,
            "category": assigned_category
        })

    return {"transactions": processed}