FROM node:lts-slim

WORKDIR /app

RUN chmod 777 /app && \
    chown -R 1000:1000 /app && \
    npm i -g nodemon

USER 1000:1000

EXPOSE 80

CMD [ "nodemon", "src/index.js" ]