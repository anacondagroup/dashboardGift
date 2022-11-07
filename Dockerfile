FROM node:16.13.0-alpine

RUN mkdir -p /app
WORKDIR /app

RUN apk add --no-cache bash
RUN apk add --no-cache yarn
RUN yarn global add lerna

# Install app dependencies
COPY ./* /app/
#RUN yarn install

EXPOSE 3000

CMD ["yarn", "docker:dashboard-app"]
