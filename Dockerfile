FROM node:8-alpine

WORKDIR /app

COPY .env  ./

COPY reportToSlack.js ./

COPY package*.json ./

COPY tests tests

RUN npm install -g
