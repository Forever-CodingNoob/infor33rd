FROM python:3.8-slim
ENV APP_HOME /web
# ENV PORT 8080
WORKDIR $APP_HOME
COPY . ./
RUN pip install pipenv
RUN pipenv install --deploy --system
CMD exec gunicorn --bind=0.0.0.0:$PORT runapp:app