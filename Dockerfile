# using alpine linux
FROM python:3.8-alpine3.12

ENV APP_HOME=/web

# set FLASK_ENV to `development` to enable loading environment variables from .env file
# ENV FLASK_ENV=development
ENV FLASK_ENV=production

# comment out the line below when building docker image on GCP(cloud build)
# ENV PORT=8000

WORKDIR $APP_HOME
COPY . ./
RUN \
    apk update && \
    apk add --no-cache build-base && \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip install pipenv && \
    pipenv install --deploy --system --dev && \
    apk --purge del .build-deps

RUN ls -al

ENTRYPOINT exec gunicorn --bind=0.0.0.0:$PORT \
    --workers 4 --worker-class eventlet \
    --timeout 30 \
    --access-logfile - --error-logfile - --log-level debug \
    runapp:app

# EXPOSE $PORT
