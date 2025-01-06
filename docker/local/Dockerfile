# Download the image
FROM node:18.19-bullseye AS build
ENV APP_HOME=/srv/app
ENV PORT=4280
ENV USR_DOCKER=dev
WORKDIR $APP_HOME

COPY ./package.json ./.yarnrc.yml ./.dockerignore $APP_HOME/

# Check CPU architecture
RUN arch=$(arch | sed s/aarch64/arm64/ | sed s/x86_64/amd64/)
# For Apple M1 only!
RUN if [ $arch = "arm64" ] ; then apt install python3 make g++ && rm -rf /var/cache/apt/*; fi

# Enable yarn package manager
RUN yarn set version 4.4.1
RUN yarn install

# Copy everything else and build
COPY ./ $APP_HOME/
RUN yarn build

# Create the user
RUN adduser --disabled-password --gecos '' $USR_DOCKER
USER $USR_DOCKER

EXPOSE $PORT

CMD [ "node", ".output/server/index.mjs" ]