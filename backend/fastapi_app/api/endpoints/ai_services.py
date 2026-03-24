from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_ai(request: QuestionRequest):
    # This is where the high-performance GPT generation can go
    # It receives requests either directly from frontend or passed from Django
    return {"answer": f"Async response to: '{request.question}'. Fast streaming output can go here."}
