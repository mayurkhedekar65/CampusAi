from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class RoadmapRequest(BaseModel):
    goal: str
    current_skill_level: str
    timeframe_weeks: int

@router.post("/generate")
async def generate_roadmap(request: RoadmapRequest):
    # Generates a JSON roadmap broken down week-by-week
    mock_roadmap = {
        "goal": request.goal,
        "weeks": []
    }
    for week in range(1, request.timeframe_weeks + 1):
        mock_roadmap["weeks"].append({
            "week": week,
            "focus": f"Learning Fundamentals level {request.current_skill_level} step {week}",
            "tasks": ["Read documentation", "Complete mini-project", "Review concepts"]
        })
    return mock_roadmap
