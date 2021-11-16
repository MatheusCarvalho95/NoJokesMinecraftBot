FROM node:current-alpine3.11

# Setting working directory
WORKDIR /home/node/app

# Installing node dependencies
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD pnpm start