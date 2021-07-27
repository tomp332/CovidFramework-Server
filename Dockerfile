FROM node:16.2.0
RUN apt-get update || : && apt-get install python3 python3-pip -y
RUN pip3 install pycryptodomex
WORKDIR /covidframework-server
COPY package.json .
COPY .cert/covidframework.com/privkey.pem /usr/share/ca-certificate/privkey.pem
COPY .cert/covidframework.com/cert.pem /usr/share/ca-certificate/cert.pem
RUN npm install -g npm@latest
RUN npm config set strict-ssl false
RUN npm install --silent ignore-warnings
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]
