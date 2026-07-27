
# ETAPA 1: BACKEND (Node.js)

FROM node:20-alpine AS backend

WORKDIR /app/backend

COPY server/package*.json ./
RUN npm install --legacy-peer-deps

COPY server/ .
EXPOSE 3001
CMD ["node", "index.js"]

# ETAPA 2: FRONTEND (React + Vite)

FROM node:20-alpine AS frontend

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ============================================
# ETAPA 3: SERVIDOR ESTÁTICO (nginx)
# ============================================
FROM nginx:alpine AS frontend-server

COPY --from=frontend /app/frontend/dist /usr/share/nginx/html

EXPOSE 80