FROM node:16.0.2-alpine
WORKDIR /covidframework-server
COPY package.json .
RUN npm config set strict-ssl false
RUN npm install --silent
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]
