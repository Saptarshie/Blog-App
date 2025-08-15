from celery import Celery
from .vector_service import compute_embedding, upsert_vector
from ..config import Settings

settings = Settings()
try:
    celery = Celery(
        "recommender",
        broker=settings.REDIS_URL,
        backend=settings.REDIS_URL,
        include=["app.services.task_queue"]
    )
    celery.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
    )
except Exception as e:
    logger.error(f"Failed to configure Celery: {e}")
    raise


@celery.task(name="tasks.create_vector_task")
def create_vector_task(payload: dict):
    import asyncio
    from ..utils import logger
    from ..database import get_db
    
    # Create a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Get a fresh database connection in this loop
        db = get_db()
        
        # Run async operations
        text = " ".join([
            payload["title"], payload["description"],
            payload["content"], *payload["tags"], payload["author"]
        ])
        # vec = compute_embedding(text)
        
        # Execute the async function
        loop.run_until_complete(upsert_vector(payload["blog_id"], text))
        return {"blog_id": payload["blog_id"]}
    except Exception as e:
        logger.error(f"Task failed: {e}")
        raise
    finally:
        # Close the event loop
        loop.close()
        asyncio.set_event_loop(None)
