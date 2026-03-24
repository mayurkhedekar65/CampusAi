from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class AptitudeRequest(BaseModel):
    category: str
    difficulty: str
    num_questions: int = 5

class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str

@router.post("/generate", response_model=List[Question])
async def generate_aptitude_test(request: AptitudeRequest):
    # Mocking integration with an AI service like Gemini/OpenAI
    # In production, this would prompt the AI to generate `num_questions` regarding `category` at `difficulty` level
    mock_questions = [
        Question(
            id=i,
            question=f"Sample {request.difficulty} question {i} about {request.category}",
            options=["A", "B", "C", "D"],
            correct_answer="A"
        ) for i in range(1, request.num_questions + 1)
    ]
    return mock_questions
