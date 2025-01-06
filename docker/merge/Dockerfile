# Download the image
FROM node:18.19-bullseye AS build
ENV APP_HOME=/srv/app
WORKDIR $APP_HOME

# Install the dependencies
COPY ./package.json ./.yarnrc.yml $APP_HOME/
RUN yarn set version 4.4.1
RUN yarn install

# Copy everything else and build
COPY ./ $APP_HOME/

# Build project
RUN yarn lint:prettier
RUN yarn build