FROM node:18-alpine

#ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=f9c27e3e9a9f6b33b4f1a31fc764c385
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
