FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm init -y
RUN npm install
RUN npm install express
RUN npm install cors
RUN npm install util
RUN npm install multer
RUN npm install fs
RUN npm install path
RUN npm install dotenv
RUN npm install find-config
RUN npm install openai
#RUN npm install express-fileupload

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]