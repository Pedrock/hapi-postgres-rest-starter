FROM node:8-alpine

RUN apk add --no-cache make gcc g++ python

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

RUN npm run build; npm prune --production; apk del make gcc g++ python

EXPOSE 8000
CMD ["npm", "start"]