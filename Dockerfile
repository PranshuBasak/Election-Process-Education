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

EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
