# Dockerfile
# recal
# Author: Rushy Panchal
# Date: November 27th, 2017
# Description: Docker configuration.

FROM python:2.7.14-alpine3.6
LABEL maintainer="Rushy Panchal <rpanchal@princeton.edu>"

ARG APP_DIR="/opt/recal"
ARG PORT=5000

ENV DOCKER_CONTAINER 1
ENV PORT "$PORT"

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
  libxslt-dev \
  py-lxml \
  postgresql-dev

### Project Deployment ###
RUN if [ ! -e "$APP_DIR" ]; then mkdir -p "$APP_DIR"; fi
WORKDIR "$APP_DIR"

# By copying the Pipfile.lock file first, making a change in the code does not
# cause requirements to be reinstalled unless Pipfile.lock changed.
COPY Pipfile "$APP_DIR/Pipfile"
COPY Pipfile.lock "$APP_DIR/Pipfile.lock"
RUN pip install --no-cache-dir pipenv
RUN pipenv install --system

# Similarly done for Node.js requirements.
COPY package.json "$APP_DIR/package.json"
RUN npm install

# Copy rest of app code
COPY . "$APP_DIR"

# Compile and collect the static dependencies
RUN node_modules/typescript/bin/tsc -p course_selection/static/js
# --allow-root is required because Docker runs everything as root :(
RUN node_modules/bower/bin/bower install --allow-root
RUN python manage.py collectstatic -i node_modules --noinput

# Port to expose
EXPOSE "$PORT"
CMD gunicorn \
   --log-file - \
   --bind "0.0.0.0:$PORT" \
   --preload \
   course_selection.wsgi:application
