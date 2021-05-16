FROM node:16
WORKDIR /covidframework-server
COPY package.json .
RUN npm config set strict-ssl false
RUN npm install -g npm@7.13.0
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]
