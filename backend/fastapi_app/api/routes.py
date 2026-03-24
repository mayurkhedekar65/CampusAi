from fastapi import APIRouter
from .endpoints import ai_services

router = APIRouter()

router.include_router(ai_services.router, prefix="/ai", tags=["ai_services"])
