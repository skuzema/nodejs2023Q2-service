FROM node:18-alpine as builder
USER root
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY ./prisma prisma
RUN npx prisma generate
COPY . .
CMD ["npm", "run", "start:migrate"]
RUN npm run build

FROM node:18-alpine

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/dist ./dist

EXPOSE ${PORT}
CMD ["npm", "run", "start:dev"]