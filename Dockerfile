# ---- Stage 1: Build the React frontend ----
FROM node:20-alpine AS frontend-builder
 
WORKDIR /app
 
# Copy root package.json (frontend deps)
COPY package.json package-lock.json* ./
RUN npm install
 
# Copy frontend source and build
COPY vite.config.js ./
COPY index.jsx ./
COPY src/ ./src/
COPY index.html ./
RUN npm run build
# Output is in /app/dist
 
 
# ---- Stage 2: Run the backend ----
FROM node:20-alpine
 
WORKDIR /app
 
# Copy backend deps and install
COPY service/package.json service/package-lock.json* ./
RUN npm install --omit=dev
 
# Copy backend source files
COPY service/index.js ./
COPY service/database.js ./
COPY service/realtime.js ./
 
# Copy built frontend into public/ (where Express serves static files from)
COPY --from=frontend-builder /app/dist ./public
 
EXPOSE 4000
 
CMD ["node", "index.js", "4000"]