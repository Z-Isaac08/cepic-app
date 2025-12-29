// Configuration for Prisma Migrate
// See https://pris.ly/d/prisma7-client-config

// Ensure environment variables are loaded
require('dotenv').config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
