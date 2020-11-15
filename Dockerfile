FROM python:3.8-alpine
ENV APP_HOME /web
# ENV PORT 8080
WORKDIR $APP_HOME
COPY . ./
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pip install pipenv && \
 pipenv install --deploy --system && \
 apk --purge del .build-deps

CMD exec gunicorn --bind=0.0.0.0:$PORT runapp:app