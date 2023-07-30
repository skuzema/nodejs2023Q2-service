FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json .
RUN npm install --force && npm cache clean --force
COPY . .
EXPOSE ${PORT}
CMD [ "npm", "run", "start:nodemon" ]