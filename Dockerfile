FROM node:18-alpine as builder

USER root

WORKDIR /app

COPY package.json package-lock.json ./

COPY tsconfig*.json ./

RUN npm install && npm cache clean --force

COPY ./prisma prisma

RUN npx prisma generate

COPY . .

RUN npm run build

WORKDIR /app

FROM node:18-alpine

EXPOSE ${PORT}

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "start:migrate:dev"]