FROM node:14-alpine

WORKDIR /user/server

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]