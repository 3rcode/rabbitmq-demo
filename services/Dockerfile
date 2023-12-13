FROM node:20.10-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]

EXPOSE 3000
