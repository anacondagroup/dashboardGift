FROM docker.alycedev.com/public-area/registry/node:16.13.0-alpine

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

RUN apk add --no-cache bash git # git is required for husky

USER node
COPY package.json yarn.lock .npmrc ./
RUN yarn install

CMD yarn start