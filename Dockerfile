FROM node:18.17.1

WORKDIR /app

RUN apt-get update -y && apt-get upgrade -y

COPY . /app
RUN npm install

RUN npm run build && npm start
