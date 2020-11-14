FROM python:3.8-slim
ENV APP_HOME /web
WORKDIR $APP_HOME
COPY . ./
RUN pip install pipenv
RUN pipenv install --deploy --system
CMD exec gunicorn --bind=0.0.0.0:$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker  --threads 8 runapp:web