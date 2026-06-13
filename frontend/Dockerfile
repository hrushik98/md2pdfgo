FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Run the Vite dev server so the /api proxy forwards requests to the backend.
# --host binds to 0.0.0.0 so the server is reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
