from motor.motor_asyncio import AsyncIOMotorClient
from .config import Settings
import threading
import logging

logger = logging.getLogger(__name__)
settings = Settings()
_clint_local = threading.local()
def get_db():
    try:
        client = getattr(_clint_local, "client", None)
        if not client:
            client = AsyncIOMotorClient(settings.MONGODB_URI)
        # Test the connection
        client.admin.command('ping')
        return client[settings.DATABASE_NAME]
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
