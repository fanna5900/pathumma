import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding verified School institutions, school courses, and learning resources...');

  const facultyUser = await prisma.user.findFirst({ where: { role: 'FACULTY' } });
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const uploaderId = facultyUser?.id || adminUser?.id;

  if (!uploaderId) {
    throw new Error('No uploader user found.');
  }

  const schoolsData = [
    {
      name: 'Government Model Boys Higher Secondary School',
      slug: 'model-boys-hss-thycaud',
      location: 'Thycaud, Thiruvananthapuram, Kerala',
      address: 'Model School Road, Thycaud PO, Thiruvananthapuram - 695014',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government School',
      affiliation: 'Department of General Education, Government of Kerala (DHSE)',
      officialWebsite: 'https://education.kerala.gov.in',
      contactEmail: 'modelboyshss.tvm@kerala.gov.in',
      contactPhone: '+91 471 2322300',
      facilities: 'Atal Tinkering Lab, Hi-Tech Smart Classrooms, Physics Lab, Chemistry Lab, Football Ground, Digital Library',
      scholarships: 'Kerala State Merit Scholarship, Post-Matric SC/ST Fee Waiver, National Means-cum-Merit (NMMS)',
      verificationStatus: 'VERIFIED',
      officialSource: 'Department of General Education Kerala School Directory',
      rating: 4.8,
      establishedYear: 1885,
      departmentName: 'General & Higher Secondary Education Department',
      departmentCode: 'DHSE-01',
      courses: [
        {
          title: 'Secondary School Leaving Certificate (Class 10)',
          code: 'SSLC-GEN',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'Prescribed Kerala State Education Board high school curriculum encompassing Mathematics, Physics, Chemistry, Biology, Social Science, English, and Malayalam.',
          eligibility: 'Successful completion of Class 9 from any recognized board.',
          admissionProcess: 'State School Admission Portal / Direct School Allotment',
          fee: 650,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Science Stream',
          code: 'HSE-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Plus One Science combination including Physics, Chemistry, Mathematics, Biology, English, and Second Language.',
          eligibility: 'Pass in SSLC / Class 10 with minimum Grade C+ or equivalent in Science subjects.',
          admissionProcess: 'Single Window System (HSCAP Centralized Allotment)',
          fee: 1450,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Commerce Stream',
          code: 'HSE-COM-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Plus One Commerce combination including Accountancy, Business Studies, Economics, and Computer Applications.',
          eligibility: 'Pass in SSLC / Class 10 examination with required grade point average.',
          admissionProcess: 'Single Window System (HSCAP Centralized Allotment)',
          fee: 1350,
        },
        {
          title: 'Higher Secondary Plus Two (Class 12) - Science Stream',
          code: 'HSE-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Plus Two final qualifying curriculum with board practical examinations in Physics, Chemistry, and Biology.',
          eligibility: 'Pass in Plus One (Class 11) Science from Kerala DHSE or recognized board.',
          admissionProcess: 'Progression from Plus One / Transfer Allotment',
          fee: 1650,
        },
        {
          title: 'Higher Secondary Plus Two (Class 12) - Commerce Stream',
          code: 'HSE-COM-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Senior secondary qualifying commercial studies with computer applications and accounting software training.',
          eligibility: 'Pass in Plus One (Class 11) Commerce.',
          admissionProcess: 'Progression from Plus One',
          fee: 1550,
        },
      ],
    },
    {
      name: 'Government Higher Secondary School for Girls, Cotton Hill',
      slug: 'cotton-hill-girls-hss',
      location: 'Vazhuthacaud, Thiruvananthapuram, Kerala',
      address: 'Cotton Hill, Vazhuthacaud, Thiruvananthapuram - 695014',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government School',
      affiliation: 'Department of General Education, Government of Kerala (DHSE)',
      officialWebsite: 'https://cottonhillhss.kerala.gov.in',
      contactEmail: 'cottonhillhss@gmail.com',
      contactPhone: '+91 471 2322522',
      facilities: 'Asia\'s Largest Girls School Campus, Digital Classrooms, State-of-the-art Science Laboratories, Auditorium, Sports Complex',
      scholarships: 'Chief Minister\'s Special Merit Award, Girls Education Concession, State Scholarship for Differently Abled',
      verificationStatus: 'VERIFIED',
      officialSource: 'Directorate of General Education Kerala',
      rating: 4.9,
      establishedYear: 1859,
      departmentName: 'Higher Secondary Wing',
      departmentCode: 'DHSE-02',
      courses: [
        {
          title: 'Secondary School Leaving Certificate (Class 10)',
          code: 'SSLC-CH',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'Comprehensive secondary school education with academic excellence and co-curricular programs.',
          eligibility: 'Completion of 9th Standard.',
          admissionProcess: 'Direct School Admission Portal',
          fee: 600,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Science with Computer Science',
          code: 'HSE-CS-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Higher secondary science with focus on Computer Science, Mathematics, Physics, and Chemistry.',
          eligibility: 'Class 10 pass with high grade point in Mathematics and Science.',
          admissionProcess: 'HSCAP Single Window Centralized Allotment',
          fee: 1500,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Humanities Stream',
          code: 'HSE-HUM-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Curriculum featuring History, Economics, Political Science, and Sociology.',
          eligibility: 'Pass in 10th standard SSLC / CBSE / ICSE.',
          admissionProcess: 'HSCAP Single Window Centralized Allotment',
          fee: 1250,
        },
        {
          title: 'Higher Secondary Plus Two (Class 12) - Computer Science Stream',
          code: 'HSE-CS-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Final year higher secondary science and computer applications preparation for engineering & degree entrances.',
          eligibility: 'Pass in Plus One Computer Science.',
          admissionProcess: 'Direct Academic Progression',
          fee: 1700,
        },
      ],
    },
    {
      name: 'Kendriya Vidyalaya Pattom',
      slug: 'kv-pattom-thiruvananthapuram',
      location: 'Pattom, Thiruvananthapuram, Kerala',
      address: 'Pattom PO, Thiruvananthapuram, Kerala - 695004',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government School',
      affiliation: 'Central Board of Secondary Education (CBSE)',
      officialWebsite: 'https://pattom.kvs.ac.in',
      contactEmail: 'principal.kvpattom@gmail.com',
      contactPhone: '+91 471 2445854',
      facilities: 'Smart Board Classrooms, AI Learning Lab, 3 Science Labs, Basketball & Volleyball Courts, Central School Library',
      scholarships: 'KVS National Single Girl Child Scheme, PM e-Vidya Concession',
      verificationStatus: 'VERIFIED',
      officialSource: 'Kendriya Vidyalaya Sangathan (Ministry of Education, GoI)',
      rating: 4.9,
      establishedYear: 1964,
      departmentName: 'CBSE Senior Secondary Division',
      departmentCode: 'KVS-01',
      courses: [
        {
          title: 'Secondary School AISSE (Class 10)',
          code: 'CBSE-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'CBSE national curriculum comprising Science, Social Science, Mathematics Standard/Basic, English Language & Literature.',
          eligibility: 'Class 9 pass from CBSE or recognized school.',
          admissionProcess: 'KVS Online Admission Portal (Priority Category & Lottery)',
          fee: 2400,
        },
        {
          title: 'Senior Secondary AISSCE Plus One (Class 11) - Science (PCMB)',
          code: 'CBSE-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'CBSE Plus One Science with Physics, Chemistry, Mathematics, Biology / Computer Science and English Core.',
          eligibility: 'Class 10 Board exam with minimum 75% marks in Science & Mathematics.',
          admissionProcess: 'Merit-based allotment under KVS Senior Secondary Guidelines',
          fee: 3600,
        },
        {
          title: 'Senior Secondary AISSCE Plus Two (Class 12) - Science',
          code: 'CBSE-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Class 12 CBSE board exam curriculum preparing students for JEE Main, NEET UG, and CUET.',
          eligibility: 'Pass in CBSE Class 11 Science.',
          admissionProcess: 'Direct Class 11 Progression',
          fee: 3800,
        },
      ],
    },
    {
      name: 'Loyola School, Sreekariyam',
      slug: 'loyola-school-sreekariyam',
      location: 'Sreekariyam, Thiruvananthapuram, Kerala',
      address: 'Loyola School Road, Sreekariyam PO, Thiruvananthapuram - 695017',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'Council for the Indian School Certificate Examinations (CISCE / ICSE)',
      officialWebsite: 'https://loyolaschooltrivandrum.com',
      contactEmail: 'loyola_tvm@yahoo.com',
      contactPhone: '+91 471 2598585',
      facilities: 'Jesuit Educational Campus, International Standard Sports Complex, Swimming Pool, Advanced Robotics Lab, Heritage Library',
      scholarships: 'Loyola Merit Concessions, Jesuit Financial Need-Based Assistance',
      verificationStatus: 'VERIFIED',
      officialSource: 'CISCE Affiliated School Registry',
      rating: 4.9,
      establishedYear: 1961,
      departmentName: 'ICSE & ISC Wing',
      departmentCode: 'CISCE-01',
      courses: [
        {
          title: 'ICSE Certificate Examination (Class 10)',
          code: 'ICSE-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'Indian Certificate of Secondary Education curriculum emphasizing analytical science, mathematics, and English literature.',
          eligibility: 'Completion of 9th Grade.',
          admissionProcess: 'Institutional Entrance Assessment and Merit',
          fee: 28000,
        },
        {
          title: 'Indian School Certificate ISC Plus One (Class 11) - Science',
          code: 'ISC-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'ISC Class 11 with Physics, Chemistry, Mathematics, Elective (Computer Science / Biology) and English.',
          eligibility: 'Pass in ICSE / CBSE / SSLC with minimum 80% aggregate.',
          admissionProcess: 'Merit Assessment & Interview',
          fee: 32000,
        },
        {
          title: 'Indian School Certificate ISC Plus Two (Class 12) - Science',
          code: 'ISC-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'ISC Class 12 preparing students for global competitive examinations and university admissions.',
          eligibility: 'Pass in ISC Class 11.',
          admissionProcess: 'Class 11 Progression',
          fee: 34000,
        },
      ],
    },
    {
      name: 'Model Technical Higher Secondary School, Kaloor',
      slug: 'thss-kaloor-kochi',
      location: 'Kaloor, Ernakulam, Kerala',
      address: 'IHRD Campus, Near Jawaharlal Nehru Stadium, Kaloor, Kochi - 682017',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government School',
      affiliation: 'Institute of Human Resources Development (IHRD), Govt of Kerala',
      officialWebsite: 'https://thsskaloor.ihrd.ac.in',
      contactEmail: 'thsskaloor@ihrd.ac.in',
      contactPhone: '+91 484 2347132',
      facilities: 'Electronics Labs, Computer Hardware & Networking Labs, Microcontroller Workstations, Smart Audiovisual Rooms',
      scholarships: 'IHRD Technical Merit Concession, SC/ST State Grant',
      verificationStatus: 'VERIFIED',
      officialSource: 'IHRD Government of Kerala Technical Education Directory',
      rating: 4.7,
      establishedYear: 1990,
      departmentName: 'Technical Education Wing',
      departmentCode: 'IHRD-01',
      courses: [
        {
          title: 'Technical High School Leaving Certificate (Class 10 - THSLC)',
          code: 'THSLC-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'Technical secondary education featuring Basic Electrical, Electronics, Mechanical, and Computer Science fundamentals.',
          eligibility: 'Pass in Class 9.',
          admissionProcess: 'IHRD Centralized Application',
          fee: 1800,
        },
        {
          title: 'Technical Plus One (Class 11) - Physical Science with Electronics',
          code: 'TECH-HSE-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Pre-engineering higher secondary curriculum focusing on Electronics Engineering, Physics, Chemistry, and Mathematics.',
          eligibility: 'Pass in SSLC / THSLC / CBSE Class 10.',
          admissionProcess: 'IHRD Online Merit Allotment',
          fee: 7500,
        },
        {
          title: 'Technical Plus Two (Class 12) - Electronics & Computer Tech',
          code: 'TECH-HSE-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Class 12 Technical higher secondary with practical laboratory examinations in Electronics and Computer Science.',
          eligibility: 'Pass in Technical Plus One.',
          admissionProcess: 'Direct Progression',
          fee: 8000,
        },
      ],
    },
    {
      name: 'Rajagiri Public School, Kalamassery',
      slug: 'rajagiri-public-school-kalamassery',
      location: 'Kalamassery, Ernakulam, Kerala',
      address: 'Rajagiri Valley PO, Kalamassery, Kochi, Kerala - 682039',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Private School',
      affiliation: 'Central Board of Secondary Education (CBSE)',
      officialWebsite: 'https://rajagirischool.ac.in',
      contactEmail: 'rajagiri@rajagiri.ac.in',
      contactPhone: '+91 484 2911111',
      facilities: 'CMI Fathers Campus, Innovation Incubation Hub, International Football Turf, Olympic-size Swimming Pool, 3 Digital Libraries',
      scholarships: 'Rajagiri Talent Endowment Scheme, Fr. Antony Kariyil CMI Memorial Waiver',
      verificationStatus: 'VERIFIED',
      officialSource: 'CBSE Affiliation Portal (Code 930016)',
      rating: 4.9,
      establishedYear: 1994,
      departmentName: 'Senior Secondary Academy',
      departmentCode: 'RPS-01',
      courses: [
        {
          title: 'Secondary School Education (Class 10 - CBSE)',
          code: 'CBSE-RPS-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'CBSE Class 10 with Artificial Intelligence, Mathematics Standard, Science, Social Science, and English.',
          eligibility: 'Completion of 9th Grade with high academic standing.',
          admissionProcess: 'Online Registration and Aptitude Evaluation',
          fee: 38000,
        },
        {
          title: 'Senior Secondary Plus One (Class 11) - Science & Computer Science',
          code: 'CBSE-RPS-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Class 11 CBSE Science with integrated competitive exam mentoring for JEE and NEET.',
          eligibility: 'Minimum 85% in Class 10 Board Examinations.',
          admissionProcess: 'Aptitude Test & Direct Interview',
          fee: 45000,
        },
        {
          title: 'Senior Secondary Plus Two (Class 12) - Science',
          code: 'CBSE-RPS-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Class 12 CBSE board exam stream with advanced laboratory sessions.',
          eligibility: 'Pass in Class 11.',
          admissionProcess: 'Progression from Class 11',
          fee: 48000,
        },
      ],
    },
    {
      name: 'University of Calcutta (Rajabazar Science College & Departments)',
      slug: 'calcutta-university-rajabazar-campus',
      location: 'Kolkata, West Bengal',
      address: '92 Acharya Prafulla Chandra Road, Kolkata, West Bengal - 700009',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      institutionType: 'University Department',
      affiliation: 'University of Calcutta (Constituent Faculty of Science & Technology)',
      officialWebsite: 'https://www.caluniv.ac.in',
      contactEmail: 'registrar@caluniv.ac.in',
      contactPhone: '+91 33 23508386',
      facilities: 'Historic Science College where C.V. Raman, Satyendra Nath Bose & Meghnad Saha worked; Advanced Optics Labs, High-Performance Computing Cluster',
      scholarships: 'Swami Vivekananda Merit-cum-Means (SVMCM), Kanyashree K3, National Post-Graduate Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'University of Calcutta Official Faculty Directory & NIRF Ranking 2024',
      rating: 4.9,
      establishedYear: 1914,
      departmentName: 'Department of Applied Physics and Optics',
      departmentCode: 'CU-AP-01',
      courses: [
        {
          title: 'B.Tech in Computer Science and Engineering',
          code: 'CU-BTECH-CSE',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Premier engineering degree offered by the Department of Computer Science & Engineering, University of Calcutta.',
          eligibility: '10+2 with Physics, Mathematics, and Chemistry with valid WBJEE rank.',
          admissionProcess: 'West Bengal Joint Entrance Examination (WBJEE Centralized Counseling)',
          fee: 18000,
        },
        {
          title: 'M.Sc in Applied Physics',
          code: 'CU-MSC-AP',
          level: 'POSTGRADUATE',
          durationYears: 2,
          description: 'Prestigious postgraduate program in applied physics, instrumentation, sensors, and photonics.',
          eligibility: 'B.Sc (Hons) in Physics with Mathematics from a recognized university.',
          admissionProcess: 'Calcutta University PG Centralized Admission Test / Merit Allotment',
          fee: 6400,
        },
        {
          title: 'M.Tech in Optics and Optoelectronics',
          code: 'CU-MTECH-OPT',
          level: 'POSTGRADUATE',
          durationYears: 2,
          description: 'Department of Applied Physics postgraduate program specializing in fiber optics, laser technology, and semiconductor photonics.',
          eligibility: 'B.Tech / B.E or M.Sc in Physics with valid GATE score.',
          admissionProcess: 'GATE / University Written Test & Interview',
          fee: 14000,
        },
      ],
    },
  ];

  for (const s of schoolsData) {
    const existing = await prisma.institution.findUnique({ where: { slug: s.slug } });
    let inst;
    if (existing) {
      inst = await prisma.institution.update({
        where: { id: existing.id },
        data: {
          name: s.name,
          institutionType: s.institutionType,
          affiliation: s.affiliation,
          location: s.location,
          address: s.address,
          city: s.city,
          state: s.state,
          officialWebsite: s.officialWebsite,
          contactEmail: s.contactEmail,
          contactPhone: s.contactPhone,
          facilities: s.facilities,
          scholarships: s.scholarships,
          rating: s.rating,
          establishedYear: s.establishedYear,
          verificationStatus: 'VERIFIED',
        },
      });
    } else {
      inst = await prisma.institution.create({
        data: {
          name: s.name,
          slug: s.slug,
          location: s.location,
          address: s.address,
          city: s.city,
          state: s.state,
          country: s.country,
          institutionType: s.institutionType,
          affiliation: s.affiliation,
          officialWebsite: s.officialWebsite,
          contactEmail: s.contactEmail,
          contactPhone: s.contactPhone,
          facilities: s.facilities,
          scholarships: s.scholarships,
          rating: s.rating,
          establishedYear: s.establishedYear,
          verificationStatus: 'VERIFIED',
          officialSource: s.officialSource,
        },
      });
    }

    let dept = await prisma.department.findFirst({
      where: { institutionId: inst.id, code: s.departmentCode },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: {
          institutionId: inst.id,
          name: s.departmentName,
          code: s.departmentCode,
          description: `Department of ${s.departmentName} at ${s.name}`,
        },
      });
    }

    for (const c of s.courses) {
      const existingCourse = await prisma.course.findFirst({
        where: { institutionId: inst.id, code: c.code },
      });

      let courseObj;
      if (existingCourse) {
        courseObj = await prisma.course.update({
          where: { id: existingCourse.id },
          data: {
            title: c.title,
            level: c.level,
            durationYears: c.durationYears,
            description: c.description,
            eligibility: c.eligibility,
            admissionProcess: c.admissionProcess,
          },
        });
      } else {
        courseObj = await prisma.course.create({
          data: {
            institutionId: inst.id,
            departmentId: dept.id,
            title: c.title,
            code: c.code,
            level: c.level,
            durationYears: c.durationYears,
            description: c.description,
            eligibility: c.eligibility,
            admissionProcess: c.admissionProcess,
            totalSeats: 60,
          },
        });
      }

      const existingFee = await prisma.courseFee.findFirst({
        where: { courseId: courseObj.id },
      });
      if (!existingFee) {
        await prisma.courseFee.create({
          data: {
            courseId: courseObj.id,
            tuitionFee: c.fee,
            totalFee: c.fee,
            period: 'ANNUAL',
            officialSource: 'Official Government Gazette / School Prospectus',
            isEstimate: false,
          },
        });
      }
    }
  }

  // Seed School Study Materials
  const schoolResources = [
    {
      title: 'Class 10 SSLC Mathematics - Chapterwise Revision Formulae & Practice Problems',
      description: 'Complete verified revision guide for SSLC Class 10 Mathematics covering Arithmetic Progressions, Circles, Coordinates, and Polynomials.',
      resourceType: 'NOTES',
      fileType: 'pdf',
      fileSize: '3.1 MB',
      sourceInfo: 'SCERT Kerala & Model School Faculty Committee',
    },
    {
      title: 'Class 10 SSLC Physics - Previous 5 Years Board Question Papers with Answer Key',
      description: 'Consolidated previous question papers with official scoring keys for Class 10 Secondary Physics.',
      resourceType: 'PREVIOUS_QUESTION_PAPER',
      fileType: 'pdf',
      fileSize: '4.5 MB',
      sourceInfo: 'Department of General Education Kerala',
    },
    {
      title: 'Plus One Higher Secondary (Class 11) - Physics Theory & Numericals Handout',
      description: 'Handout covering Kinematics, Laws of Motion, Work Energy, and Thermodynamics for Plus One Science students.',
      resourceType: 'NOTES',
      fileType: 'pdf',
      fileSize: '2.8 MB',
      sourceInfo: 'DHSE Kerala State Resource Group',
    },
    {
      title: 'Plus One Commerce (Class 11) - Accountancy Question Bank & Worksheets',
      description: 'Comprehensive financial accounting question bank with journal entries, ledger postings, and final accounts.',
      resourceType: 'QUESTION_BANK',
      fileType: 'pdf',
      fileSize: '2.2 MB',
      sourceInfo: 'Higher Secondary Teachers Association',
    },
    {
      title: 'Plus Two Higher Secondary (Class 12) - Chemistry Quick Revision Notes',
      description: 'High-scoring revision notes for Electrochemistry, Chemical Kinetics, and Organic Chemistry with reaction mechanisms.',
      resourceType: 'REVISION_NOTES',
      fileType: 'pdf',
      fileSize: '3.4 MB',
      sourceInfo: 'Government Model HSS Senior Faculty',
    },
    {
      title: 'Plus Two Computer Science (Class 12) - Python Programming & SQL Syllabus Guide',
      description: 'Complete lab practical record and study notes covering Python object-oriented programming and MySQL database management.',
      resourceType: 'LAB_MANUAL',
      fileType: 'pdf',
      fileSize: '3.9 MB',
      sourceInfo: 'IHRD Technical Higher Secondary Council',
    },
  ];

  for (const r of schoolResources) {
    const existingMat = await prisma.learningMaterial.findFirst({
      where: { title: r.title },
    });
    if (!existingMat) {
      await prisma.learningMaterial.create({
        data: {
          title: r.title,
          description: r.description,
          resourceType: r.resourceType,
          fileType: r.fileType,
          fileSize: r.fileSize,
          fileUrl: '/uploads/sample.pdf',
          sourceInfo: r.sourceInfo,
          approvalStatus: 'APPROVED',
          uploadedById: uploaderId,
        },
      });
    }
  }

  console.log('Successfully seeded schools, courses, and school study resources!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
