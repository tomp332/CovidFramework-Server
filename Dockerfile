FROM node:16
WORKDIR /covidframework-server
COPY package.json .
RUN npm config set strict-ssl false
RUN npm install --silent
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]
