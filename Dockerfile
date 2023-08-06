FROM node:18-alpine
USER root
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./prisma prisma
RUN npx prisma generate
COPY . .
EXPOSE ${PORT}
CMD ["npm", "run", "start:migrate:dev"]