import { PrismaClient, RoleCode } from '@prisma/client';

const prisma = new PrismaClient();

const roles: Array<{
    code: RoleCode;
    name: string;
    description: string;
}> = [
        {
            code: RoleCode.PATIENT,
            name: 'Patient',
            description: 'Default role for end users seeking consultations',
        },
        {
            code: RoleCode.DOCTOR,
            name: 'Doctor',
            description: 'Medical practitioner who can manage availability and consultations',
        },
        {
            code: RoleCode.ADMIN,
            name: 'Admin',
            description: 'Platform administrator with elevated access',
        },
        {
            code: RoleCode.SUPPORT,
            name: 'Support',
            description: 'Support operator with limited operational access',
        },
    ];

async function main(): Promise<void> {
    for (const role of roles) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {
                name: role.name,
                description: role.description,
            },
            create: {
                code: role.code,
                name: role.name,
                description: role.description,
            },
        });
    }

    console.log('✅ Roles seeded successfully');
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });