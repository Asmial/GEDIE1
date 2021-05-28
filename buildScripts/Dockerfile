FROM node:lts-slim

WORKDIR /app

RUN npm install -g webpack webpack-cli

RUN chmod 777 /app
RUN chown -R 1000:1000 /app

USER 1000:1000

# COPY ./package*.json ./

# RUN npm install -g
# RUN npm install -D webpack-cli

EXPOSE 80

CMD ["node", "--max-old-space-size=756", "/usr/local/lib/node_modules/webpack/bin/webpack.js" ]