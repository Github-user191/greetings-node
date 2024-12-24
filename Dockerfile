FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# npm ci allows for consistent and reproducable builds since it deletes the ecisting 
# node_modules folder and reinstalls the dependencies
RUN npm ci --only=production
COPY . .
EXPOSE 8080
USER node
CMD [ "node", "server.js" ]
