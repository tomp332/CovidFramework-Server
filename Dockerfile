FROM node:16-alpine
WORKDIR /covidframework-server
COPY package.json .
RUN npm config set strict-ssl false
RUN npm install --silent
COPY . .
EXPOSE 3000
USER 1001
ENTRYPOINT ["npm","start"]
