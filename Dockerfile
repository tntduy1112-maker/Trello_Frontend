FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.spa.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80
USER nginx
CMD ["nginx", "-g", "daemon off;"]
