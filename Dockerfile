FROM node:18-alpine as builder
USER root
WORKDIR /usr/app
COPY package.json package-lock.json ./
COPY tsconfig*.json ./
RUN npm install && npm cache clean --force
COPY ./prisma prisma
RUN npx prisma generate
COPY . .

RUN npm run build

WORKDIR /usr/app

FROM node:18-alpine

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/tsconfig*.json ./

EXPOSE ${PORT}
CMD ["npm", "run", "start:migrate:dev"]