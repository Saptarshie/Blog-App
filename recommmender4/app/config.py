from pydantic_settings import BaseSettings
import dotenv
dotenv.load_dotenv()
import os
class Settings(BaseSettings):
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    DATABASE_NAME: str = "test"
    REDIS_URL: str = "redis://localhost:6380/0"
    CANDIDATE_POOL_SIZE: int = 100
    RECOMMEND_K: int = 5

    class Config:
        env_file = ".env"