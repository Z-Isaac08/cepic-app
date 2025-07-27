const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('secret123', 12);

  // Create test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true
    }
  });

  // Create test regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isVerified: true,
      isActive: true
    }
  });

  // Create test unverified user
  const unverifiedUser = await prisma.user.upsert({
    where: { email: 'unverified@test.com' },
    update: {},
    create: {
      email: 'unverified@test.com',
      password: hashedPassword,
      firstName: 'Unverified',
      lastName: 'User',
      role: 'USER',
      isVerified: false,
      isActive: true
    }
  });

  console.log('✅ Seed data created:');
  console.log('📧 Admin User:', adminUser.email);
  console.log('📧 Regular User:', regularUser.email);
  console.log('📧 Unverified User:', unverifiedUser.email);
  console.log('🔑 Password for all test users: secret123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });