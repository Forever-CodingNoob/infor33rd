# using alpine linux
FROM python:3.8-alpine3.12

ENV APP_HOME /web

# comment out the line below when building docker image on GCP(cloud build)
# ENV PORT 8000

WORKDIR $APP_HOME
COPY . ./
RUN \
 apk update && \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pip install pipenv && \
 pipenv install --deploy --system && \
 apk --purge del .build-deps

ENTRYPOINT exec gunicorn --bind=0.0.0.0:$PORT runapp:app

# EXPOSE $PORT