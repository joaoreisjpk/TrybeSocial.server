FROM node:16.12-alpine

WORKDIR /user/server

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]