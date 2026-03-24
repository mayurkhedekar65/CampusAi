from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CampusAI FastAPI"
    VERSION: str = "1.0.0"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
