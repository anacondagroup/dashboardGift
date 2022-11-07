# syntax=docker/dockerfile:1.2.1
FROM docker.alycedev.com/public-area/registry/node:16.13.0-alpine as node

WORKDIR /app
COPY package.json yarn.lock ./
COPY node_modules node_modules/
COPY .npmrc ./

RUN yarn config set network-timeout 600000 -g
RUN yarn install

COPY .eslintrc .prettierrc tsconfig.json ./
COPY public public/
COPY src src/

RUN yarn build

FROM docker.alycedev.com/public-area/registry/nginx:1.17.8-alpine
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
RUN apk add --no-cache bash

ARG DOCKERFILE_DIR
COPY ${DOCKERFILE_DIR}/nginx.conf /etc/nginx/nginx.conf
COPY ${DOCKERFILE_DIR}/nginx.vh.conf /etc/nginx/conf.d/default.conf
COPY ${DOCKERFILE_DIR}/security.conf /etc/nginx/conf.d/security.conf
COPY ${DOCKERFILE_DIR}/docker-entrypoint.sh /
RUN chmod +x docker-entrypoint.sh

COPY --from=node /app/build /usr/share/nginx/html/
