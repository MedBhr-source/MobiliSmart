FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install 2>/dev/null || true

# Copy application code
COPY . .

EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
