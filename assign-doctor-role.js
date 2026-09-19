const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  const userId = '8998ae9f-620f-4dc3-840e-049349e373dc';

  const role = await prisma.role.upsert({
    where: { code: 'DOCTOR' },
    update: {
      name: 'Doctor',
      description: 'Doctor role',
    },
    create: {
      code: 'DOCTOR',
      name: 'Doctor',
      description: 'Doctor role',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: role.id,
    },
  });

  console.log('DOCTOR role assigned to user:', userId);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
