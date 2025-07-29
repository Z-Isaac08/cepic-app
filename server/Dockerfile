FROM node:18-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://postgres:WJ%3Arootisaac@postgres:5432/projectmoney"

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "sleep 10 && npx prisma db push && npm run seed && npm run dev"]
