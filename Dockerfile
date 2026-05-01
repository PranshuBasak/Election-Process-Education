# Stage 1: Build Vite/React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm ci --ignore-scripts
COPY web/ ./
RUN npm run build

# Stage 2: Build FastAPI backend
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies via pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built React SPA
COPY --from=frontend-builder /web/dist ./web/dist

# Cloud Run listens on $PORT, default to 8080
ENV PORT 8080

CMD exec gunicorn --bind :$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker --threads 8 backend.main:app
