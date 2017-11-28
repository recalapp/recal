# Dockerfile
# recal
# Author: Rushy Panchal
# Date: November 27th, 2017
# Description: Docker configuration.

FROM python:2.7.14-alpine3.6
MAINTAINER Rushy Panchal <rpanchal@princeton.edu>

ARG PORT

ENV PORT $PORT
ENV DOCKER_CONTAINER 1
ENV APP_DIR "/opt/recal"

### Dependencies ###
RUN apk add --update \
  pdftk \
  graphviz \
  graphviz-dev \
  nodejs \
  nodejs-npm \
  python \
  python-dev \
  build-base \
  libxml2 \
  libxml2-dev \
  py-lxml \
  libxslt-dev \
  postgresql-dev

### Project Deployment ###
RUN if [ ! -e "$APP_DIR" ]; then mkdir -p "$APP_DIR"; fi
WORKDIR "$APP_DIR"

# By copying the Pipfile.lock file first, making a change in the code does not
# cause requirements to be reinstalled unless Pipfile.lock changed.
COPY Pipfile "$APP_DIR/Pipfile"
COPY Pipfile.lock "$APP_DIR/Pipfile.lock"
RUN pip install --no-cache-dir pipenv
RUN pipenv install

# # Similarly done for Node.js requirements.
COPY package.json "$APP_DIR/package.json"
RUN npm install

COPY . "$APP_DIR"
RUN node_modules/typescript/bin/tsc -p course_selection/static/js
# --allow-root is required because Docker runs everything as root :(
RUN node_modules/bower/bin/bower install --allow-root
RUN pipenv run python manage.py collectstatic -i node_modules --noinput

# Port to expose
EXPOSE "$PORT"
CMD pipenv run gunicorn course_selection.wsgi:application
