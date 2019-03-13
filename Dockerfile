FROM node:8-alpine

WORKDIR /app

COPY package*.json ./

COPY tests ./

RUN npm install

CMD [ "node", "./reportToSlack.js" ]