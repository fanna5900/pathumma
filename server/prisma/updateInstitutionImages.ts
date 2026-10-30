import prisma from '../src/db';

const institutionImages: Record<string, { bannerUrl: string; logoUrl: string }> = {
  // GEC Barton Hill
  'Government Engineering College Barton Hill (GECBH)': {
    bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // MACE Kothamangalam
  'Mar Athanasius College of Engineering (MACE), Kothamangalam': {
    bannerUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Maharaja's College
  "Maharaja's College (Autonomous), Ernakulam": {
    bannerUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // NSS Palakkad
  'NSS College of Engineering, Palakkad': {
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Loyola College Chennai
  'Loyola College (Autonomous), Chennai': {
    bannerUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // St. Joseph's University Bangalore
  "St. Joseph's University, Bangalore": {
    bannerUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Calcutta University
  'University of Calcutta (Rajabazar Science College & Departments)': {
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Govt Model Boys HSS Chalai
  'Government Model Boys Higher Secondary School': {
    bannerUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Cotton Hill Girls
  'Government Higher Secondary School for Girls, Cotton Hill': {
    bannerUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // KV Pattom
  'Kendriya Vidyalaya Pattom': {
    bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Loyola Sreekariyam
  'Loyola School, Sreekariyam': {
    bannerUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Model Technical HSS Kaloor
  'Model Technical Higher Secondary School, Kaloor': {
    bannerUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Rajagiri Public School
  'Rajagiri Public School, Kalamassery': {
    bannerUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // St. Joseph's Kozhikode
  "St. Joseph's Boys Higher Secondary School, Kozhikode": {
    bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // Chinmaya Vaduthala
  'Chinmaya Vidyalaya, Vaduthala, Kochi': {
    bannerUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // KV Naval Base
  'Kendriya Vidyalaya No. 1, Naval Base, Kochi': {
    bannerUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
  // St. Xavier's Thumba
  "St. Xavier's Higher Secondary School, Thumba": {
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
  },
};

async function main() {
  console.log('--- Updating Missing Institution Images in Database ---');
  for (const [name, imgData] of Object.entries(institutionImages)) {
    const inst = await prisma.institution.findFirst({
      where: { name: { contains: name.slice(0, 25) } },
    });
    if (inst) {
      await prisma.institution.update({
        where: { id: inst.id },
        data: {
          bannerUrl: imgData.bannerUrl,
          logoUrl: imgData.logoUrl,
        },
      });
      console.log(`Updated images for: ${inst.name}`);
    }
  }
  console.log('--- Done updating images! ---');
}

main().finally(() => prisma.$disconnect());
