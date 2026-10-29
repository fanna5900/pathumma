import prisma from '../src/db';

async function main() {
  const count = await prisma.learningMaterial.count();
  console.log('Total learning materials in DB:', count);
  const sample = await prisma.learningMaterial.findMany({
    take: 10,
    select: {
      id: true,
      title: true,
      resourceType: true,
      fileUrl: true,
      fileType: true,
      fileSize: true,
      institution: { select: { name: true } },
      course: { select: { title: true } },
    }
  });
  console.log(JSON.stringify(sample, null, 2));
}

main().finally(() => prisma.$disconnect());
