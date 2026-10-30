import prisma from '../src/db';

async function main() {
  const users = await prisma.user.count();
  const institutions = await prisma.institution.count();
  const schools = await prisma.institution.count({
    where: {
      institutionType: { in: ['Government School', 'Government Aided School', 'Private School'] }
    }
  });
  const colleges = await prisma.institution.count({
    where: {
      institutionType: { in: ['Government Engineering College', 'Government Aided Engineering College', 'Government Arts and Science College', 'Private Self-Financing College', 'Autonomous College', 'State University Constituent Institution', 'University Department'] }
    }
  });
  const universities = await prisma.institution.count({
    where: {
      institutionType: { in: ['State Public University', 'State Technical University', 'State Science and Technology University', 'Central Institute'] }
    }
  });
  const courses = await prisma.course.count();
  const fees = await prisma.courseFee.count();
  const materials = await prisma.learningMaterial.count();
  const applications = await prisma.admissionApplication.count();

  console.log('--- DATABASE STATUS OVERVIEW ---');
  console.log(JSON.stringify({
    totalUsers: users,
    totalInstitutions: institutions,
    schools,
    colleges,
    universities,
    totalCourses: courses,
    totalCourseFees: fees,
    totalLearningMaterials: materials,
    totalAdmissionApplications: applications
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
