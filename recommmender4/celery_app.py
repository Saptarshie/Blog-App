from app.services.task_queue import celery

# for CLI: celery -A celery_app.celery worker --loglevel=info
# celery -A celery_app.celery worker --loglevel=info -P solo