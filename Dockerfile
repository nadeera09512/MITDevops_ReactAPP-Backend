FROM node:16
WORKDIR /app
COPY ./* /app
RUN npm install
EXPOSE 4000
CMD ["nodemon","server.js"]
