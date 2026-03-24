from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class InterviewRequest(BaseModel):
    job_role: str
    experience_level: str

@router.post("/start")
async def start_interview(request: InterviewRequest):
    # Kick off a dynamic interview session
    return {
        "session_id": "mock_abc123",
        "role": request.job_role,
        "first_question": f"Can you tell me about your experience related to a {request.experience_level} {request.job_role} role?"
    }

class InterviewAnswer(BaseModel):
    session_id: str
    answer: str

@router.post("/answer")
async def submit_answer(request: InterviewAnswer):
    # Evaluates the answer and asks the next relevant question
    return {
        "feedback": "Good answer, clearly stated.",
        "next_question": "How do you handle conflict in a team setting?",
        "is_complete": False
    }
