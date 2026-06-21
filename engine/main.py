from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.processors.parsers import get_parser
from app.processors.cleaner.merchant_matcher import MerchantMatcher
from app.processors.classifier.category_engine import CategoryEngine
from app.analytics.leak_detector import LeakDetector
from app.analytics.spending_dna import SpendingDna
from app.analytics.behavior import BehavioralAnalytics
from app.generators.insights import InsightEngine
from app.generators.story import FinancialStoryGenerator
from app.models.schemas import AnalysisResponse
from app.processors.classifier.health_score_engine import HealthScoreEngine

app = FastAPI()

# Enable CORS for communication with the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow absolutely everything for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Engines
merchant_matcher = MerchantMatcher()
category_engine = CategoryEngine()
leak_detector = LeakDetector()
health_score_engine = HealthScoreEngine()
spending_dna_engine = SpendingDna()
behavioral_engine = BehavioralAnalytics()
insight_engine = InsightEngine()
story_generator = FinancialStoryGenerator()

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_statement(file: UploadFile = File(...)):
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid uploaded file structure.")
        
    ext = filename.split(".")[-1]
    try:
        parser = get_parser(ext)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    contents = await file.read()
    try:
        raw_transactions = parser.parse(contents)
    except Exception as e:
        raise HTTPException(status_code=422, detail=format(f"Parsing failed: {str(e)}"))

    processed_transactions = []
    
    # Process each raw transaction through the cleaning and classification pipeline
    for tx in raw_transactions:
        clean_merchant = merchant_matcher.clean_description(tx["description"])
        assigned_category = category_engine.classify(clean_merchant, tx["description"], tx["type"])
        
        processed_transactions.append({
            "date": tx["date"],
            "description": tx["description"],
            "amount": tx["amount"],
            "type": tx["type"],
            "merchant": clean_merchant,
            "category": assigned_category
        })

    # Run downstream behavioral analytics pipelines
    leaks_data = leak_detector.analyze(processed_transactions)
    health_data = health_score_engine.calculate(processed_transactions, leaks_data["subscription_summary"])
    dna_data = spending_dna_engine.determine_profile(processed_transactions)
    behavior_data = behavioral_engine.analyze_patterns(processed_transactions)
    
    # Generate contextual narratives
    generated_insights = insight_engine.generate_insights(health_data, behavior_data, leaks_data)
    story_narrative = story_generator.compile_narrative(health_data, dna_data, behavior_data, leaks_data)

    return {
        "status": "success",
        "message": "Statement analyzed successfully.",
        "data": {
            "transactions": processed_transactions, # Check note below if this stays underlined!
            "health_score": health_data,
            "spending_dna": dna_data,
            "behavioral_analytics": behavior_data,
            "insights": generated_insights,
            "financial_story": story_narrative
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "operational"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)