# Download the image
FROM node:18.19-bullseye AS build
ENV STATE=staging
ENV APP_HOME=/srv/app
WORKDIR $APP_HOME

# Install the dependencies
COPY ./package.json ./.yarnrc.yml $APP_HOME/
RUN yarn set version 4.4.1
RUN yarn install

# Copy everything else and build
COPY ./ $APP_HOME/

# Environment file
RUN rm -rf $APP_HOME/.env

# Build project
RUN yarn build:srv:stg

# Download the image
FROM node:18.19-bullseye AS publish
ENV STATE=staging
ENV PORT_APP=80
ENV PORT=$PORT_APP
ENV PORT_SSH=2222
ENV APP_HOME_BUILD=/srv/app
ENV APP_HOME_PUBLISH=/srv/app
WORKDIR $APP_HOME_PUBLISH

# Set the timezone
RUN echo 'tzdata tzdata/Areas select Asia' | debconf-set-selections
RUN echo 'tzdata tzdata/Zones/Asia select Bangkok' | debconf-set-selections
RUN DEBIAN_FRONTEND="noninteractive" apt install -y tzdata

# Copying compiled code from .output
COPY --from=build $APP_HOME_BUILD/.output $APP_HOME_PUBLISH/

# Start and enable SSH
COPY --from=build $APP_HOME_BUILD/docker/$STATE/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod u+x /docker-entrypoint.sh
RUN apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd
COPY --from=build $APP_HOME_BUILD/docker/$STATE/sshd_config /etc/ssh/

# Exposing internal port
EXPOSE $PORT_APP $PORT_SSH

ENTRYPOINT [ "/docker-entrypoint.sh" ]