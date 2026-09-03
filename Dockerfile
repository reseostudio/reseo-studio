FROM node:26-alpine

WORKDIR /app

# better-sqlite3 (módulo nativo). El package-lock marca hasInstallScript,
# así que npm intenta node-gyp rebuild; le damos las herramientas para que
# compile correctamente sobre Node 26 (ABI correcto, sin el SIGSEGV de Node 20).
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
