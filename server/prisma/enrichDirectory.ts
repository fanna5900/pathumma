import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Comprehensive Directory Enrichment (Colleges, Schools, Courses, Itemized Fees) ---');

  // Helper to ensure a department exists
  async function getOrCreateDept(institutionId: string, name: string, code: string) {
    let dept = await prisma.department.findFirst({
      where: { institutionId, code },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: {
          institutionId,
          name,
          code,
          description: `${name} Department`,
        },
      });
    }
    return dept;
  }

  // Helper to create or update a course with fee and semesters
  async function upsertCourse(data: {
    institutionId: string;
    departmentId: string;
    title: string;
    code: string;
    level: string;
    durationYears: number;
    description: string;
    eligibility: string;
    admissionProcess: string;
    totalSeats?: number;
    tuitionFee: number;
    admissionFee?: number;
    labFee?: number;
    examFee?: number;
    hostelFee?: number;
    officialSource: string;
  }) {
    const existing = await prisma.course.findFirst({
      where: { institutionId: data.institutionId, code: data.code },
    });

    let course;
    if (existing) {
      course = await prisma.course.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          level: data.level,
          durationYears: data.durationYears,
          description: data.description,
          eligibility: data.eligibility,
          admissionProcess: data.admissionProcess,
          totalSeats: data.totalSeats || 60,
        },
      });
    } else {
      course = await prisma.course.create({
        data: {
          institutionId: data.institutionId,
          departmentId: data.departmentId,
          title: data.title,
          code: data.code,
          level: data.level,
          durationYears: data.durationYears,
          description: data.description,
          eligibility: data.eligibility,
          admissionProcess: data.admissionProcess,
          totalSeats: data.totalSeats || 60,
        },
      });
    }

    // Upsert Fee
    const totalFee =
      data.tuitionFee +
      (data.admissionFee || 0) +
      (data.labFee || 0) +
      (data.examFee || 0);

    const existingFee = await prisma.courseFee.findFirst({
      where: { courseId: course.id },
    });

    if (existingFee) {
      await prisma.courseFee.update({
        where: { id: existingFee.id },
        data: {
          tuitionFee: data.tuitionFee,
          admissionFee: data.admissionFee || 500,
          labFee: data.labFee || 1500,
          examFee: data.examFee || 1000,
          hostelFee: data.hostelFee || 35000,
          totalFee,
          officialSource: data.officialSource,
        },
      });
    } else {
      await prisma.courseFee.create({
        data: {
          courseId: course.id,
          tuitionFee: data.tuitionFee,
          admissionFee: data.admissionFee || 500,
          labFee: data.labFee || 1500,
          examFee: data.examFee || 1000,
          hostelFee: data.hostelFee || 35000,
          totalFee,
          officialSource: data.officialSource,
        },
      });
    }

    // Create Semesters for colleges/universities (2 semesters per year)
    if (['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'].includes(data.level)) {
      const numSemesters = data.durationYears * 2;
      for (let s = 1; s <= numSemesters; s++) {
        const semExists = await prisma.semester.findFirst({
          where: { courseId: course.id, semesterNumber: s },
        });
        if (!semExists) {
          await prisma.semester.create({
            data: {
              courseId: course.id,
              semesterNumber: s,
              title: `Semester ${s}`,
            },
          });
        }
      }
    }

    return course;
  }

  // ==========================================
  // 1. ENRICH EXISTING PREMIER COLLEGES & UNIVERSITIES
  // ==========================================

  // CET - College of Engineering Trivandrum
  const cet = await prisma.institution.findFirst({
    where: { name: { contains: 'College of Engineering Trivandrum' } },
  });
  if (cet) {
    console.log('Enriching College of Engineering Trivandrum (CET)...');
    const cseDept = await getOrCreateDept(cet.id, 'Computer Science & Engineering', 'CSE-CET');
    const eceDept = await getOrCreateDept(cet.id, 'Electronics & Communication', 'ECE-CET');
    const mechDept = await getOrCreateDept(cet.id, 'Mechanical Engineering', 'ME-CET');
    const civilDept = await getOrCreateDept(cet.id, 'Civil Engineering', 'CE-CET');

    await upsertCourse({
      institutionId: cet.id,
      departmentId: cseDept.id,
      title: 'B.Tech in Computer Science and Engineering',
      code: 'CET-CS-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Premier B.Tech CSE program offering advanced AI, algorithms, distributed computing, and machine learning.',
      eligibility: 'Pass in 10+2 with 50% marks in Mathematics, Physics, and Chemistry. Valid KEAM rank.',
      admissionProcess: 'KEAM Centralized Allotment Process (Commissioner for Entrance Examinations Kerala)',
      totalSeats: 120,
      tuitionFee: 8650,
      admissionFee: 1000,
      labFee: 1500,
      examFee: 1200,
      hostelFee: 32000,
      officialSource: 'Directorate of Technical Education Kerala Fee Gazette',
    });

    await upsertCourse({
      institutionId: cet.id,
      departmentId: eceDept.id,
      title: 'B.Tech in Electronics & Communication Engineering',
      code: 'CET-EC-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Covers VLSI design, signal processing, embedded systems, telecommunications, and RF engineering.',
      eligibility: '10+2 with minimum 50% in Maths, Physics, Chemistry. Valid KEAM rank.',
      admissionProcess: 'KEAM Centralized Allotment Process',
      totalSeats: 120,
      tuitionFee: 8650,
      admissionFee: 1000,
      labFee: 1500,
      examFee: 1200,
      hostelFee: 32000,
      officialSource: 'Directorate of Technical Education Kerala Fee Gazette',
    });

    await upsertCourse({
      institutionId: cet.id,
      departmentId: mechDept.id,
      title: 'B.Tech in Mechanical Engineering',
      code: 'CET-ME-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Thermodynamics, robotics, CAD/CAM, fluid mechanics, and aerospace propulsion.',
      eligibility: '10+2 with Maths, Physics, Chemistry. Valid KEAM rank.',
      admissionProcess: 'KEAM CAP Allotment',
      totalSeats: 120,
      tuitionFee: 8650,
      admissionFee: 1000,
      labFee: 1500,
      examFee: 1200,
      hostelFee: 32000,
      officialSource: 'Directorate of Technical Education Kerala Fee Gazette',
    });

    await upsertCourse({
      institutionId: cet.id,
      departmentId: cseDept.id,
      title: 'M.Tech in Computer Science and Engineering',
      code: 'CET-MTECH-CS',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Advanced postgraduate research in cybersecurity, computer vision, data mining, and high-performance computing.',
      eligibility: 'B.Tech / B.E in CSE/IT with minimum 60% aggregate and valid GATE score.',
      admissionProcess: 'DTE Kerala PG Centralized Allotment based on GATE score',
      totalSeats: 36,
      tuitionFee: 12500,
      admissionFee: 1500,
      labFee: 2500,
      examFee: 1800,
      hostelFee: 35000,
      officialSource: 'KTU PG Fee Regulations',
    });
  }

  // TKM College of Engineering, Kollam
  const tkm = await prisma.institution.findFirst({
    where: { name: { contains: 'TKM College of Engineering' } },
  });
  if (tkm) {
    console.log('Enriching TKM College of Engineering, Kollam...');
    const cseDept = await getOrCreateDept(tkm.id, 'Computer Science & Engineering', 'CSE-TKM');
    const eceDept = await getOrCreateDept(tkm.id, 'Electronics & Communication', 'ECE-TKM');
    const chemDept = await getOrCreateDept(tkm.id, 'Chemical Engineering', 'CHEM-TKM');

    await upsertCourse({
      institutionId: tkm.id,
      departmentId: cseDept.id,
      title: 'B.Tech in Computer Science and Engineering',
      code: 'TKM-CS-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'NBA accredited computer science program with cloud computing and software architecture focus.',
      eligibility: 'Pass in 10+2 with 50% in Maths, Physics, Chemistry. Valid KEAM rank.',
      admissionProcess: 'KEAM Centralized Allotment Process (Govt Aided Quota)',
      totalSeats: 120,
      tuitionFee: 8650,
      admissionFee: 1200,
      labFee: 1800,
      examFee: 1200,
      hostelFee: 36000,
      officialSource: 'Govt Aided Engineering Fee Gazette Kerala',
    });

    await upsertCourse({
      institutionId: tkm.id,
      departmentId: chemDept.id,
      title: 'B.Tech in Chemical Engineering',
      code: 'TKM-CHEM-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Pioneering chemical engineering program focusing on petrochemicals, polymers, process safety, and renewable energy.',
      eligibility: '10+2 with 50% marks in PCM. Valid KEAM rank.',
      admissionProcess: 'KEAM Centralized Allotment',
      totalSeats: 60,
      tuitionFee: 8650,
      admissionFee: 1200,
      labFee: 2000,
      examFee: 1200,
      hostelFee: 36000,
      officialSource: 'Govt Aided Engineering Fee Gazette Kerala',
    });

    await upsertCourse({
      institutionId: tkm.id,
      departmentId: eceDept.id,
      title: 'M.Tech in Communication Systems',
      code: 'TKM-MTECH-COMM',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Covers modern 5G/6G wireless networks, satellite communications, and microwave engineering.',
      eligibility: 'B.Tech in ECE with minimum 60% and valid GATE score.',
      admissionProcess: 'DTE PG Allotment',
      totalSeats: 18,
      tuitionFee: 14000,
      admissionFee: 1500,
      labFee: 2500,
      examFee: 1500,
      hostelFee: 36000,
      officialSource: 'APJ Abdul Kalam Technological University PG Norms',
    });
  }

  // GECT - Government Engineering College Thrissur
  const gect = await prisma.institution.findFirst({
    where: { name: { contains: 'Government Engineering College Thrissur' } },
  });
  if (gect) {
    console.log('Enriching Government Engineering College Thrissur (GECT)...');
    const cseDept = await getOrCreateDept(gect.id, 'Computer Science & Engineering', 'CSE-GECT');
    const eeeDept = await getOrCreateDept(gect.id, 'Electrical & Electronics', 'EEE-GECT');
    const civilDept = await getOrCreateDept(gect.id, 'Civil Engineering', 'CE-GECT');

    await upsertCourse({
      institutionId: gect.id,
      departmentId: cseDept.id,
      title: 'B.Tech in Computer Science and Engineering',
      code: 'GECT-CS-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Top-tier engineering education with extensive hardware and machine learning laboratory infrastructure.',
      eligibility: 'Pass in 10+2 with 50% in PCM. Valid KEAM rank.',
      admissionProcess: 'KEAM Centralized Allotment Process',
      totalSeats: 90,
      tuitionFee: 8650,
      admissionFee: 1000,
      labFee: 1500,
      examFee: 1200,
      hostelFee: 28000,
      officialSource: 'DTE Kerala Government Fee Schedule',
    });

    await upsertCourse({
      institutionId: gect.id,
      departmentId: eeeDept.id,
      title: 'B.Tech in Electrical & Electronics Engineering',
      code: 'GECT-EEE-01',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Power systems, electric vehicles, industrial automation, and microgrid renewable technology.',
      eligibility: 'Pass in 10+2 with 50% in PCM. Valid KEAM rank.',
      admissionProcess: 'KEAM CAP Allotment',
      totalSeats: 90,
      tuitionFee: 8650,
      admissionFee: 1000,
      labFee: 1500,
      examFee: 1200,
      hostelFee: 28000,
      officialSource: 'DTE Kerala Government Fee Schedule',
    });
  }

  // University of Kerala - Kariavattom Campus Departments
  const uok = await prisma.institution.findFirst({
    where: { name: { contains: 'University of Kerala' } },
  });
  if (uok) {
    console.log('Enriching University of Kerala Departments...');
    const csDept = await getOrCreateDept(uok.id, 'Department of Computer Science', 'CS-UOK');
    const physicsDept = await getOrCreateDept(uok.id, 'Department of Physics', 'PHY-UOK');
    const econDept = await getOrCreateDept(uok.id, 'Department of Economics', 'ECON-UOK');

    await upsertCourse({
      institutionId: uok.id,
      departmentId: csDept.id,
      title: 'M.Sc in Computer Science (Artificial Intelligence)',
      code: 'UOK-MSC-AI',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Cutting-edge program covering deep learning, natural language processing, computer vision, and cognitive systems.',
      eligibility: 'B.Sc Computer Science / BCA / B.Tech CSE with minimum 55% marks.',
      admissionProcess: 'Kerala University PG Common Admission Test (KU-CAT)',
      totalSeats: 30,
      tuitionFee: 7800,
      admissionFee: 1200,
      labFee: 2000,
      examFee: 1500,
      hostelFee: 22000,
      officialSource: 'University of Kerala Gazette',
    });

    await upsertCourse({
      institutionId: uok.id,
      departmentId: physicsDept.id,
      title: 'M.Sc in Physics (Specialization in Nanoscience)',
      code: 'UOK-MSC-PHY',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Experimental and theoretical condensed matter physics, quantum mechanics, and nanomaterials synthesis.',
      eligibility: 'B.Sc in Physics with Mathematics subsidiary with minimum 55% marks.',
      admissionProcess: 'KU-CAT Entrance Exam',
      totalSeats: 25,
      tuitionFee: 6500,
      admissionFee: 1000,
      labFee: 2500,
      examFee: 1400,
      hostelFee: 22000,
      officialSource: 'University of Kerala Gazette',
    });

    await upsertCourse({
      institutionId: uok.id,
      departmentId: econDept.id,
      title: 'M.A. in Applied Economics',
      code: 'UOK-MA-ECON',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Econometrics, macroeconomic policy, public finance, development economics, and quantitative data analysis.',
      eligibility: 'Bachelor degree in Economics, Mathematics, Statistics, or Commerce with 50% marks.',
      admissionProcess: 'KU-CAT Entrance Exam',
      totalSeats: 35,
      tuitionFee: 4200,
      admissionFee: 800,
      labFee: 500,
      examFee: 1200,
      hostelFee: 22000,
      officialSource: 'University of Kerala Gazette',
    });
  }

  // University of Calicut - Tenhipalam Main Campus
  const uoc = await prisma.institution.findFirst({
    where: { name: { contains: 'University of Calicut' } },
  });
  if (uoc) {
    console.log('Enriching University of Calicut Departments...');
    const csDept = await getOrCreateDept(uoc.id, 'Department of Computer Science', 'CS-UOC');
    const biotechDept = await getOrCreateDept(uoc.id, 'Department of Biotechnology', 'BIO-UOC');
    const commerceDept = await getOrCreateDept(uoc.id, 'Department of Commerce & Management', 'COM-UOC');

    await upsertCourse({
      institutionId: uoc.id,
      departmentId: csDept.id,
      title: 'M.Sc in Computer Science (Data Analytics)',
      code: 'UOC-MSC-CS',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Advanced data science, statistical modeling, machine learning, and big data technologies using Hadoop and Spark.',
      eligibility: 'B.Sc Computer Science, BCA, or B.Sc Mathematics/Statistics with 50% aggregate.',
      admissionProcess: 'Calicut University Common Admission Test (CUCAT)',
      totalSeats: 30,
      tuitionFee: 8200,
      admissionFee: 1100,
      labFee: 2200,
      examFee: 1400,
      hostelFee: 24000,
      officialSource: 'University of Calicut Official Fee Notification',
    });

    await upsertCourse({
      institutionId: uoc.id,
      departmentId: biotechDept.id,
      title: 'M.Sc in Biotechnology (DBT Supported)',
      code: 'UOC-MSC-BT',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'National DBT-sponsored postgraduate program in recombinant DNA technology, immunology, and bioinformatics.',
      eligibility: 'Bachelor degree in Biological Sciences with minimum 55% marks.',
      admissionProcess: 'GAT-B (Graduate Aptitude Test - Biotechnology) / CUCAT',
      totalSeats: 20,
      tuitionFee: 9500,
      admissionFee: 1500,
      labFee: 3000,
      examFee: 1600,
      hostelFee: 24000,
      officialSource: 'Department of Biotechnology, GoI & University of Calicut',
    });

    await upsertCourse({
      institutionId: uoc.id,
      departmentId: commerceDept.id,
      title: 'Master of Commerce (M.Com in Financial Management)',
      code: 'UOC-MCOM',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'Corporate financial reporting, security analysis, international finance, and direct taxation.',
      eligibility: 'B.Com / BBA with minimum 45% aggregate.',
      admissionProcess: 'CUCAT Merit Allotment',
      totalSeats: 40,
      tuitionFee: 5600,
      admissionFee: 900,
      labFee: 600,
      examFee: 1200,
      hostelFee: 24000,
      officialSource: 'University of Calicut Official Fee Notification',
    });
  }

  // Mahatma Gandhi University (MGU), Kottayam
  const mgu = await prisma.institution.findFirst({
    where: { name: { contains: 'Mahatma Gandhi University' } },
  });
  if (mgu) {
    console.log('Enriching Mahatma Gandhi University (MGU)...');
    const compDept = await getOrCreateDept(mgu.id, 'School of Computer Sciences', 'SCS-MGU');
    const bioscienceDept = await getOrCreateDept(mgu.id, 'School of Biosciences', 'SBS-MGU');
    const polymerDept = await getOrCreateDept(mgu.id, 'School of Chemical Sciences', 'SCS-CHEM-MGU');

    await upsertCourse({
      institutionId: mgu.id,
      departmentId: compDept.id,
      title: 'Master of Computer Applications (MCA)',
      code: 'MGU-MCA-01',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'AICTE approved 2-year MCA program emphasizing cloud native applications, microservices, and mobile app development.',
      eligibility: 'Passed BCA / B.Sc Computer Science / B.Sc IT or Bachelor degree with Mathematics at 10+2 or Degree level with 50% marks.',
      admissionProcess: 'Kerala State LBS MCA Entrance Examination Allotment',
      totalSeats: 60,
      tuitionFee: 18500,
      admissionFee: 1500,
      labFee: 3500,
      examFee: 2000,
      hostelFee: 26000,
      officialSource: 'Mahatma Gandhi University Fee Gazette',
    });

    await upsertCourse({
      institutionId: mgu.id,
      departmentId: polymerDept.id,
      title: 'M.Sc in Polymer Chemistry (Chancellor\'s Award Program)',
      code: 'MGU-MSC-POLY',
      level: 'POSTGRADUATE',
      durationYears: 2,
      description: 'World-renowned center of excellence led by top polymer scientists, covering nanocomposites, polymers, and green chemistry.',
      eligibility: 'B.Sc in Chemistry with 55% marks.',
      admissionProcess: 'MGU CAT (Common Admission Test)',
      totalSeats: 25,
      tuitionFee: 7200,
      admissionFee: 1200,
      labFee: 2800,
      examFee: 1500,
      hostelFee: 26000,
      officialSource: 'Mahatma Gandhi University Fee Gazette',
    });
  }

  // ==========================================
  // 2. ADD NEW VERIFIED PREMIER COLLEGES
  // ==========================================

  const newColleges = [
    {
      name: 'Government Engineering College Barton Hill (GECBH)',
      slug: 'gecbh-trivandrum',
      location: 'Barton Hill, Vanchiyoor, Thiruvananthapuram, Kerala',
      address: 'Barton Hill, Vanchiyoor PO, Thiruvananthapuram - 695035',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://www.gecbh.ac.in',
      contactEmail: 'principal@gecbh.ac.in',
      contactPhone: '+91 471 2300484',
      facilities: 'T-Hub Innovation Centre, Mercedes-Benz ADAM Automotive Lab, FabLab, High-Speed Campus Network, Central Library',
      scholarships: 'DTE Post-Matric Concession, Central Sector Scheme, Alumni Endowment Scholarships',
      verificationStatus: 'VERIFIED',
      officialSource: 'DTE Kerala & KTU Official Affiliated College Directory',
      rating: 4.8,
      establishedYear: 1999,
      nirfRank: 120,
      departments: [
        { name: 'Information Technology', code: 'IT-GECBH' },
        { name: 'Mechanical Engineering', code: 'ME-GECBH' },
        { name: 'Electrical & Electronics', code: 'EEE-GECBH' },
      ],
      courses: [
        {
          title: 'B.Tech in Information Technology',
          code: 'GECBH-IT-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Specialization in software engineering, cybersecurity, cloud platforms, and web architecture.',
          eligibility: 'Pass in 10+2 with 50% in Maths, Physics, Chemistry. Valid KEAM rank.',
          admissionProcess: 'KEAM Centralized Allotment Process',
          totalSeats: 60,
          fee: 8650,
        },
        {
          title: 'B.Tech in Mechanical Engineering (Electric Vehicles)',
          code: 'GECBH-ME-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Modern mechanical engineering curriculum with industry-backed electric vehicle technologies.',
          eligibility: '10+2 with 50% in PCM. Valid KEAM rank.',
          admissionProcess: 'KEAM CAP Allotment',
          totalSeats: 60,
          fee: 8650,
        },
      ],
    },
    {
      name: 'Mar Athanasius College of Engineering (MACE), Kothamangalam',
      slug: 'mace-kothamangalam',
      location: 'Kothamangalam, Ernakulam, Kerala',
      address: 'MACE Campus, Kothamangalam, Ernakulam District - 686666',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://www.mace.ac.in',
      contactEmail: 'principal@mace.ac.in',
      contactPhone: '+91 485 2822363',
      facilities: '62-Acre Hilltop Campus, Advanced Research Laboratories, IEEE Student Branch, Hostel Facilities for 1,200 Students',
      scholarships: 'Government Merit Scholarships, Mar Athanasius Trust Concessions',
      verificationStatus: 'VERIFIED',
      officialSource: 'Govt-Aided Engineering College Registry Kerala',
      rating: 4.8,
      establishedYear: 1961,
      nirfRank: 110,
      departments: [
        { name: 'Computer Science and Engineering', code: 'CSE-MACE' },
        { name: 'Civil Engineering', code: 'CE-MACE' },
      ],
      courses: [
        {
          title: 'B.Tech in Computer Science and Engineering',
          code: 'MACE-CS-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'NBA Tier-1 accredited program producing leaders in software development, AI, and systems engineering.',
          eligibility: 'Pass in 10+2 with 50% in PCM. Valid KEAM rank.',
          admissionProcess: 'KEAM Centralized Allotment (Govt Aided Quota)',
          totalSeats: 120,
          fee: 8650,
        },
        {
          title: 'B.Tech in Civil Engineering',
          code: 'MACE-CE-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Structural design, environmental engineering, geotechnical analysis, and smart city infrastructure.',
          eligibility: '10+2 with 50% in PCM. Valid KEAM rank.',
          admissionProcess: 'KEAM Centralized Allotment',
          totalSeats: 120,
          fee: 8650,
        },
      ],
    },
    {
      name: 'Maharaja\'s College (Autonomous), Ernakulam',
      slug: 'maharajas-college-ernakulam',
      location: 'Park Avenue, Kochi, Ernakulam, Kerala',
      address: 'Park Avenue Road, Marine Drive, Kochi - 682011',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government',
      affiliation: 'Mahatma Gandhi University (Special Heritage Autonomous College)',
      officialWebsite: 'https://maharajas.ac.in',
      contactEmail: 'principal@maharajas.ac.in',
      contactPhone: '+91 484 2352838',
      facilities: 'Centenary Heritage Campus on Vembanad Lake, Historic Central Library with 150,000 volumes, Herbarium, Aquatic Lab',
      scholarships: 'State Post-Matric Scholarships, Suvarna Jubilee Merit Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'Department of Collegiate Education Kerala',
      rating: 4.9,
      establishedYear: 1875,
      departments: [
        { name: 'Department of English', code: 'ENG-MC' },
        { name: 'Department of Economics', code: 'ECON-MC' },
        { name: 'Department of Chemistry', code: 'CHEM-MC' },
      ],
      courses: [
        {
          title: 'B.A. in English Language and Literature',
          code: 'MC-BA-ENG',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Classic liberal arts curriculum exploring world literature, linguistics, post-colonial studies, and creative writing.',
          eligibility: 'Pass in Plus Two / 12th standard with qualifying marks in English.',
          admissionProcess: 'Maharaja\'s Autonomous Online Centralized Admission Portal',
          totalSeats: 40,
          fee: 2850,
        },
        {
          title: 'B.Sc in Chemistry',
          code: 'MC-BSC-CHEM',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Rigorous laboratory-based training in organic, inorganic, analytical, and physical chemistry.',
          eligibility: 'Pass in Plus Two Science with Chemistry and Mathematics.',
          admissionProcess: 'Autonomous College Merit Allotment',
          totalSeats: 45,
          fee: 3450,
        },
      ],
    },
    {
      name: 'NSS College of Engineering, Palakkad',
      slug: 'nss-college-of-engineering-palakkad',
      location: 'Akathethara, Palakkad, Kerala',
      address: 'NSS Engineering College PO, Akathethara, Palakkad - 678008',
      city: 'Palakkad',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://www.nssce.ac.in',
      contactEmail: 'nssce@nssce.ac.in',
      contactPhone: '+91 491 2555255',
      facilities: '125-Acre Sprawling Green Campus, High Voltage Testing Lab, Automated Central Library, Computing Centre',
      scholarships: 'NSS Educational Trust Grants, State Merit Concessions',
      verificationStatus: 'VERIFIED',
      officialSource: 'Govt-Aided Engineering College Registry Kerala',
      rating: 4.7,
      establishedYear: 1960,
      departments: [
        { name: 'Computer Science and Engineering', code: 'CSE-NSS' },
        { name: 'Instrumentation and Control', code: 'IC-NSS' },
      ],
      courses: [
        {
          title: 'B.Tech in Computer Science and Engineering',
          code: 'NSS-CS-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Premier engineering program emphasizing algorithmic problem solving, software systems, and data analytics.',
          eligibility: 'Pass in 10+2 with 50% in PCM. Valid KEAM rank.',
          admissionProcess: 'KEAM Centralized Allotment',
          totalSeats: 120,
          fee: 8650,
        },
        {
          title: 'B.Tech in Instrumentation and Control Engineering',
          code: 'NSS-IC-01',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          description: 'Automation, industrial sensor technologies, robotics, PLC/SCADA systems, and biomedical instrumentation.',
          eligibility: '10+2 with 50% in PCM. Valid KEAM rank.',
          admissionProcess: 'KEAM Centralized Allotment',
          totalSeats: 60,
          fee: 8650,
        },
      ],
    },
    {
      name: 'Loyola College (Autonomous), Chennai',
      slug: 'loyola-college-chennai',
      location: 'Sterling Road, Nungambakkam, Chennai, Tamil Nadu',
      address: 'Sterling Road, Nungambakkam, Chennai - 600034',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      institutionType: 'Autonomous',
      affiliation: 'University of Madras (College with Potential for Excellence)',
      officialWebsite: 'https://www.loyolacollege.edu',
      contactEmail: 'admission@loyolacollege.edu',
      contactPhone: '+91 44 28178200',
      facilities: 'NIRF Top 5 Arts & Science College in India, World-class Sports Facilities, Entomology Research Institute, Digital Media Studio',
      scholarships: 'Loyola Jesuit Merit Scholarships, Government of Tamil Nadu Free Education Scheme',
      verificationStatus: 'VERIFIED',
      officialSource: 'NIRF Ranking 2024 (Rank 8) & University of Madras',
      rating: 4.9,
      establishedYear: 1925,
      nirfRank: 8,
      departments: [
        { name: 'School of Commerce', code: 'COM-LOYOLA' },
        { name: 'School of Computational Sciences', code: 'CS-LOYOLA' },
      ],
      courses: [
        {
          title: 'Bachelor of Commerce (B.Com General)',
          code: 'LOYOLA-BCOM',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Consistently ranked among the top B.Com programs in India with extensive Big-4 accounting internships.',
          eligibility: 'Pass in 10+2 with Commerce, Accountancy, and Mathematics.',
          admissionProcess: 'Loyola Autonomous Online Merit Assessment',
          totalSeats: 140,
          fee: 38000,
        },
        {
          title: 'B.Sc in Computer Science (Data Science)',
          code: 'LOYOLA-BSC-CS',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Comprehensive computational science training covering Python, R, Machine Learning, and Cloud Architecture.',
          eligibility: 'Pass in 10+2 with Mathematics and Computer Science / Physics.',
          admissionProcess: 'Online Merit Allotment',
          totalSeats: 50,
          fee: 42000,
        },
      ],
    },
    {
      name: 'St. Joseph\'s University, Bangalore',
      slug: 'st-josephs-university-bangalore',
      location: 'Langford Road, Shanti Nagar, Bengaluru, Karnataka',
      address: '36 Lalbagh Road, Shanti Nagar, Bengaluru - 560027',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'UGC Recognized State Unitary Jesuit University',
      officialWebsite: 'https://www.sju.edu.in',
      contactEmail: 'desk@sju.edu.in',
      contactPhone: '+91 80 22274079',
      facilities: 'Historic Victorian Campus, Astronomy Observatory, Bio-nanotechnology Labs, High-tech Media Studios',
      scholarships: 'Arrupe Need-cum-Merit Scholarships, Post-Matric State Concession',
      verificationStatus: 'VERIFIED',
      officialSource: 'University Grants Commission (UGC) Gazette & NAAC A++',
      rating: 4.8,
      establishedYear: 1882,
      departments: [
        { name: 'Department of Computer Applications', code: 'CA-SJU' },
        { name: 'Department of Business Administration', code: 'BBA-SJU' },
      ],
      courses: [
        {
          title: 'Bachelor of Computer Applications (BCA)',
          code: 'SJU-BCA-01',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Industry-integrated program featuring full-stack web development, cloud computing, and DevOps.',
          eligibility: 'Pass in 10+2 in any stream with minimum 50% marks.',
          admissionProcess: 'University Online Entrance Test (SJU-ET) & Interview',
          totalSeats: 120,
          fee: 85000,
        },
        {
          title: 'Bachelor of Business Administration (BBA Finance)',
          code: 'SJU-BBA-01',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          description: 'Global business management curriculum with corporate internships in Bengaluru\'s IT and financial hubs.',
          eligibility: '10+2 with 55% marks.',
          admissionProcess: 'SJU-ET & Group Discussion',
          totalSeats: 120,
          fee: 92000,
        },
      ],
    },
  ];

  for (const col of newColleges) {
    const existing = await prisma.institution.findUnique({ where: { slug: col.slug } });
    let inst;
    if (existing) {
      inst = await prisma.institution.update({
        where: { id: existing.id },
        data: {
          name: col.name,
          institutionType: col.institutionType,
          affiliation: col.affiliation,
          location: col.location,
          address: col.address,
          city: col.city,
          state: col.state,
          officialWebsite: col.officialWebsite,
          contactEmail: col.contactEmail,
          contactPhone: col.contactPhone,
          facilities: col.facilities,
          scholarships: col.scholarships,
          rating: col.rating,
          establishedYear: col.establishedYear,
          nirfRank: col.nirfRank,
        },
      });
    } else {
      inst = await prisma.institution.create({
        data: {
          name: col.name,
          slug: col.slug,
          location: col.location,
          address: col.address,
          city: col.city,
          state: col.state,
          country: col.country,
          institutionType: col.institutionType,
          affiliation: col.affiliation,
          officialWebsite: col.officialWebsite,
          contactEmail: col.contactEmail,
          contactPhone: col.contactPhone,
          facilities: col.facilities,
          scholarships: col.scholarships,
          rating: col.rating,
          establishedYear: col.establishedYear,
          nirfRank: col.nirfRank,
          officialSource: col.officialSource,
        },
      });
    }

    for (const d of col.departments) {
      const dept = await getOrCreateDept(inst.id, d.name, d.code);
      const matchingCourses = col.courses.filter((c) =>
        c.code.includes(d.code.split('-')[0]) || col.courses.length <= 2
      );
      for (const crs of matchingCourses) {
        await upsertCourse({
          institutionId: inst.id,
          departmentId: dept.id,
          title: crs.title,
          code: crs.code,
          level: crs.level,
          durationYears: crs.durationYears,
          description: crs.description,
          eligibility: crs.eligibility,
          admissionProcess: crs.admissionProcess,
          totalSeats: crs.totalSeats,
          tuitionFee: crs.fee,
          officialSource: col.officialSource,
        });
      }
    }
  }

  // ==========================================
  // 3. ADD NEW VERIFIED SCHOOLS WITH CLASSES & FEES
  // ==========================================

  const newSchools = [
    {
      name: 'St. Joseph\'s Boys Higher Secondary School, Kozhikode',
      slug: 'st-josephs-boys-hss-calicut',
      location: 'Beach Road, Kozhikode, Kerala',
      address: 'Near Calicut Beach, Mananchira, Kozhikode - 673032',
      city: 'Kozhikode',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'Department of General Education, Government of Kerala (DHSE)',
      officialWebsite: 'https://stjosephshsscalicut.org',
      contactEmail: 'stjosephshsscalicut@gmail.com',
      contactPhone: '+91 495 2766324',
      facilities: 'Historic 230-Year-Old Jesuit Heritage School, Beachfront Football Stadium, Science Laboratories, Digital Smart Classrooms',
      scholarships: 'Jesuit Educational Trust Assistance, Post-Matric State Concessions',
      verificationStatus: 'VERIFIED',
      officialSource: 'Directorate of General Education Kerala School Registry',
      rating: 4.8,
      establishedYear: 1793,
      departmentName: 'Higher Secondary Section',
      departmentCode: 'DHSE-CLT-01',
      courses: [
        {
          title: 'Secondary School Leaving Certificate (Class 10 - SSLC)',
          code: 'SSLC-STJ',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'Complete high school state curriculum with intensive science and mathematical coaching.',
          eligibility: 'Pass in 9th Standard.',
          admissionProcess: 'Direct School Merit Allotment',
          fee: 800,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Science (Biology, Physics, Chemistry, Maths)',
          code: 'STJ-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Plus One Biology Science stream preparing students for NEET and AIIMS medical entrances.',
          eligibility: 'Pass in SSLC / Class 10 with minimum Grade B+ in Science and Maths.',
          admissionProcess: 'HSCAP Single Window Centralized Allotment',
          fee: 1450,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Commerce with Computer Applications',
          code: 'STJ-COM-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Plus One Commerce combination with Accounting software, Business studies, and Economics.',
          eligibility: 'Pass in Class 10.',
          admissionProcess: 'HSCAP Centralized Allotment',
          fee: 1350,
        },
        {
          title: 'Higher Secondary Plus Two (Class 12) - Science',
          code: 'STJ-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Final year senior secondary science with state board practicals in Physics, Chemistry, and Biology.',
          eligibility: 'Pass in Plus One Science.',
          admissionProcess: 'Direct Progression',
          fee: 1650,
        },
      ],
    },
    {
      name: 'Chinmaya Vidyalaya, Vaduthala, Kochi',
      slug: 'chinmaya-vidyalaya-vaduthala',
      location: 'Vaduthala, Kochi, Ernakulam, Kerala',
      address: 'Chinmaya Gardens, Vaduthala PO, Kochi - 682023',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Private School',
      affiliation: 'Central Board of Secondary Education (CBSE)',
      officialWebsite: 'https://chinmayavaduthala.edu.in',
      contactEmail: 'principal@chinmayavaduthala.edu.in',
      contactPhone: '+91 484 2430335',
      facilities: 'Value-based Chinmaya Education, Atal Tinkering Lab, Artificial Intelligence Centre, Synthetic Basketball Court, Heritage Auditorium',
      scholarships: 'Chinmaya Mission Merit-cum-Need Scholarships',
      verificationStatus: 'VERIFIED',
      officialSource: 'CBSE Affiliation Portal (Code 930031)',
      rating: 4.9,
      establishedYear: 1978,
      departmentName: 'Senior Secondary CBSE Wing',
      departmentCode: 'CBSE-CV-01',
      courses: [
        {
          title: 'Secondary School Examination (Class 10 - CBSE AISSE)',
          code: 'CV-CBSE-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'CBSE Class 10 national curriculum with AI, Mathematics Standard, Science, Social Science, and English.',
          eligibility: 'Class 9 pass from CBSE or recognized board.',
          admissionProcess: 'Online Application & Aptitude Evaluation',
          fee: 34000,
        },
        {
          title: 'Senior Secondary Plus One (Class 11) - Science (Computer Science Focus)',
          code: 'CV-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'CBSE Class 11 Science with Python programming, Physics, Chemistry, and Mathematics for JEE aspirants.',
          eligibility: 'Minimum 80% in Class 10 Board Examinations.',
          admissionProcess: 'Merit Assessment & Aptitude Test',
          fee: 42000,
        },
        {
          title: 'Senior Secondary Plus One (Class 11) - Commerce with Applied Mathematics',
          code: 'CV-COM-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'CBSE Class 11 Commerce covering Accountancy, Economics, Business Studies, and Applied Mathematics.',
          eligibility: 'Minimum 75% in Class 10.',
          admissionProcess: 'Aptitude Test',
          fee: 40000,
        },
        {
          title: 'Senior Secondary Plus Two (Class 12) - Science',
          code: 'CV-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Class 12 CBSE board exam year with integrated mock tests for competitive entrance examinations.',
          eligibility: 'Pass in CBSE Class 11.',
          admissionProcess: 'Progression from Class 11',
          fee: 44000,
        },
      ],
    },
    {
      name: 'Kendriya Vidyalaya No. 1, Naval Base, Kochi',
      slug: 'kv-naval-base-kochi',
      location: 'Naval Base, Willingdon Island, Kochi, Kerala',
      address: 'Naval Base PO, Willingdon Island, Kochi - 682004',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government School',
      affiliation: 'Central Board of Secondary Education (CBSE)',
      officialWebsite: 'https://no1kochi.kvs.ac.in',
      contactEmail: 'kv1kochi@gmail.com',
      contactPhone: '+91 484 2666611',
      facilities: 'Defence Sector Kendriya Vidyalaya, State-of-the-art Robotics and STEM Labs, Olympic Swimming Access, Armed Forces Mentorship',
      scholarships: 'KVS Defence Ward Concession, Single Girl Child Scheme',
      verificationStatus: 'VERIFIED',
      officialSource: 'Kendriya Vidyalaya Sangathan (Ministry of Education, GoI)',
      rating: 4.9,
      establishedYear: 1963,
      departmentName: 'KVS Senior Secondary Division',
      departmentCode: 'KVS-KOCHI-01',
      courses: [
        {
          title: 'Secondary School Examination (Class 10 - CBSE AISSE)',
          code: 'KV-NB-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'National curriculum secondary education emphasizing scientific inquiry, mathematics, and environmental education.',
          eligibility: 'Class 9 pass.',
          admissionProcess: 'KVS Online Central Portal Allotment',
          fee: 2400,
        },
        {
          title: 'Senior Secondary Plus One (Class 11) - Science (PCMB)',
          code: 'KV-NB-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Class 11 Science with Physics, Chemistry, Mathematics, Biology, and English Core.',
          eligibility: 'Class 10 Board exam with minimum 75% marks in Science and Maths.',
          admissionProcess: 'KVS Senior Secondary Admission Guidelines',
          fee: 3600,
        },
        {
          title: 'Senior Secondary Plus Two (Class 12) - Science',
          code: 'KV-NB-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Class 12 CBSE board exam preparation with physics and chemistry laboratories.',
          eligibility: 'Pass in Class 11 Science.',
          admissionProcess: 'Class 11 Progression',
          fee: 3800,
        },
      ],
    },
    {
      name: 'St. Xavier\'s Higher Secondary School, Thumba',
      slug: 'st-xaviers-hss-thumba',
      location: 'Thumba, Kazhakkoottam, Thiruvananthapuram, Kerala',
      address: 'Thumba PO, Near VSSC / ISRO, Thiruvananthapuram - 695586',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'Department of General Education, Government of Kerala (DHSE)',
      officialWebsite: 'https://stxaviershss.org',
      contactEmail: 'stxaviershss.thumba@gmail.com',
      contactPhone: '+91 471 2704250',
      facilities: 'Historic Coastal School adjacent to Vikram Sarabhai Space Centre (ISRO), Modern Astronomy and Science Club, Marine Biology Project Work',
      scholarships: 'ISRO Space Heritage Scholarship, Kerala Fisherfolk Education Grant',
      verificationStatus: 'VERIFIED',
      officialSource: 'Directorate of General Education Kerala',
      rating: 4.8,
      establishedYear: 1964,
      departmentName: 'General & Higher Secondary Wing',
      departmentCode: 'DHSE-THUMBA-01',
      courses: [
        {
          title: 'Secondary School Leaving Certificate (Class 10 - SSLC)',
          code: 'THUMBA-10',
          level: 'CLASS_10',
          durationYears: 1,
          description: 'High school program focusing on science, maths, and language communication skills.',
          eligibility: 'Completion of 9th Standard.',
          admissionProcess: 'Direct School Application',
          fee: 650,
        },
        {
          title: 'Higher Secondary Plus One (Class 11) - Science Stream',
          code: 'THUMBA-SCI-11',
          level: 'PLUS_ONE',
          durationYears: 1,
          description: 'Physics, Chemistry, Mathematics, and Computer Science higher secondary combination.',
          eligibility: 'Pass in SSLC / Class 10.',
          admissionProcess: 'HSCAP Single Window Centralized Allotment',
          fee: 1450,
        },
        {
          title: 'Higher Secondary Plus Two (Class 12) - Science',
          code: 'THUMBA-SCI-12',
          level: 'PLUS_TWO',
          durationYears: 1,
          description: 'Final year qualifying higher secondary examination with laboratory evaluations.',
          eligibility: 'Pass in Plus One Science.',
          admissionProcess: 'Direct Progression',
          fee: 1650,
        },
      ],
    },
  ];

  for (const sch of newSchools) {
    const existing = await prisma.institution.findUnique({ where: { slug: sch.slug } });
    let inst;
    if (existing) {
      inst = await prisma.institution.update({
        where: { id: existing.id },
        data: {
          name: sch.name,
          institutionType: sch.institutionType,
          affiliation: sch.affiliation,
          location: sch.location,
          address: sch.address,
          city: sch.city,
          state: sch.state,
          officialWebsite: sch.officialWebsite,
          contactEmail: sch.contactEmail,
          contactPhone: sch.contactPhone,
          facilities: sch.facilities,
          scholarships: sch.scholarships,
          rating: sch.rating,
          establishedYear: sch.establishedYear,
        },
      });
    } else {
      inst = await prisma.institution.create({
        data: {
          name: sch.name,
          slug: sch.slug,
          location: sch.location,
          address: sch.address,
          city: sch.city,
          state: sch.state,
          country: sch.country,
          institutionType: sch.institutionType,
          affiliation: sch.affiliation,
          officialWebsite: sch.officialWebsite,
          contactEmail: sch.contactEmail,
          contactPhone: sch.contactPhone,
          facilities: sch.facilities,
          scholarships: sch.scholarships,
          rating: sch.rating,
          establishedYear: sch.establishedYear,
          officialSource: sch.officialSource,
        },
      });
    }

    const dept = await getOrCreateDept(inst.id, sch.departmentName, sch.departmentCode);
    for (const c of sch.courses) {
      await upsertCourse({
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
        tuitionFee: c.fee,
        admissionFee: 200,
        labFee: 300,
        examFee: 300,
        officialSource: sch.officialSource,
      });
    }
  }

  console.log('--- Successfully completed comprehensive directory enrichment! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
