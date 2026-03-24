from fastapi import APIRouter
from .endpoints import ai_services, aptitude, roadmap, resume, interview

router = APIRouter()

router.include_router(ai_services.router, prefix="/ai", tags=["ai_services"])
router.include_router(aptitude.router, prefix="/aptitude", tags=["aptitude"])
router.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
router.include_router(resume.router, prefix="/resume", tags=["resume"])
router.include_router(interview.router, prefix="/interview", tags=["interview"])
