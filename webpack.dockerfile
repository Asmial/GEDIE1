FROM node:lts-slim

WORKDIR /app

RUN npm install -g webpack webpack-cli && \
    chmod 777 /app && \
    chown -R 1000:1000 /app

USER 1000:1000

EXPOSE 80

CMD ["node", "--max-old-space-size=756", "/usr/local/lib/node_modules/webpack/bin/webpack.js" ]