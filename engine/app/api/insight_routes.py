from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.analytics.leak_detector import LeakDetector
from app.analytics.health_score import FinancialHealthScore
from app.analytics.spending_dna import SpendingDna
from app.analytics.behavior import BehavioralAnalytics
from app.generators.insights import InsightEngine
from app.generators.story import FinancialStoryGenerator

router = APIRouter()

leak_detector = LeakDetector()
health_engine = FinancialHealthScore()
dna_engine = SpendingDna()
behavioral_engine = BehavioralAnalytics()
insight_engine = InsightEngine()
story_generator = FinancialStoryGenerator()

@router.post("/process-analytics")
async def generate_pipeline_analytics(transactions: List[Dict[str, Any]]):
    if not transactions:
        raise HTTPException(status_code=400, detail="Transaction array payload cannot be empty.")

    try:
        leaks_data = leak_detector.analyze(transactions)
        health_data = health_engine.calculate(transactions, leaks_data["subscription_summary"])
        dna_data = dna_engine.determine_profile(transactions)
        behavior_data = behavioral_engine.analyze_patterns(transactions)
        
        generated_insights = insight_engine.generate_insights(health_data, behavior_data, leaks_data)
        story_narrative = story_generator.compile_narrative(health_data, dna_data, behavior_data, leaks_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics calculation failure: {str(e)}")

    return {
        "health_score": health_data,
        "spending_dna": dna_data,
        "behavioral_analytics": behavior_data,
        "insights": generated_insights,
        "financial_story": story_narrative
    }