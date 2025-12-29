const { PrismaClient } = require('@prisma/client');

// Ensure env vars are loaded if this file is used standalone
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
