FROM node:lts-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install --production && \
    npm install -g nodemon

EXPOSE 80

CMD [ "nodemon", "src/index.js" ]