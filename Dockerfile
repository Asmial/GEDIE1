FROM node:lts-slim

WORKDIR /app

RUN chmod 777 /app
RUN chown -R 1000:1000 /app
RUN npm i -g nodemon

USER 1000:1000

# COPY ./package*.json ./

# RUN npm install -g
# RUN npm install -D webpack-cli

EXPOSE 80

CMD [ "nodemon", "src/index.js" ]