import prisma from '../src/db';

async function main() {
  const missing = await prisma.institution.findMany({
    where: { bannerUrl: null },
    select: { id: true, name: true, institutionType: true, city: true }
  });
  console.log('Institutions missing banner:', JSON.stringify(missing, null, 2));
}

main().finally(() => prisma.$disconnect());
