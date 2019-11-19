FROM node:13-alpine

# Create app directory
WORKDIR /app

# Copying the .env.example as .env inside docker
COPY .env.example  .env

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Trigger to send report to slack
CMD [ "npm", "start" ]