import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedKeralaInstitutions() {
  console.log('🏛️ Checking & Seeding Kerala 6 Premier Universities & Affiliated Colleges...');

  // 1. APJ Abdul Kalam Technological University (KTU)
  const ktu = await prisma.institution.upsert({
    where: { slug: 'apj-abdul-kalam-technological-university' },
    update: {
      affiliation: 'UGC Recognized State Technological University',
      officialWebsite: 'https://ktu.edu.in',
    },
    create: {
      name: 'APJ Abdul Kalam Technological University (KTU)',
      slug: 'apj-abdul-kalam-technological-university',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
      location: 'Thiruvananthapuram',
      address: 'CET Campus, Alathara Rd, Ambady Nagar, Thiruvananthapuram, Kerala 695016',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'Apex Technological University for All Engineering Colleges in Kerala',
      officialWebsite: 'https://ktu.edu.in',
      contactEmail: 'registrar@ktu.edu.in',
      contactPhone: '+91 471 2598122',
      facilities: 'Central Digital Examination System, e-Gov University Portal, Centralized Research Labs, Digital Library Network',
      scholarships: 'E-Grantz Kerala State Scholarship, KTU Merit Scholarship, AICTE Pragati Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'Government of Kerala Gazette & UGC Directorate',
      rating: 4.7,
      establishedYear: 2014,
      nirfRank: 101,
      departments: {
        create: [
          {
            name: 'Faculty of Engineering & Technology',
            code: 'KTU-FET',
            description: 'Coordinates curriculum, examinations, and advanced technical programs across engineering disciplines.',
          },
          {
            name: 'Faculty of Computer Applications & IT',
            code: 'KTU-FCA',
            description: 'Advanced curriculum in MCA, Data Science, Cyber Security, and Cloud Computing.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // 2. University of Calicut
  const calicut = await prisma.institution.upsert({
    where: { slug: 'university-of-calicut' },
    update: {
      affiliation: 'UGC Recognized State University, NAAC Grade A+',
      officialWebsite: 'https://uoc.ac.in',
    },
    create: {
      name: 'University of Calicut',
      slug: 'university-of-calicut',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
      location: 'Thenhipalam, Malappuram',
      address: 'University of Calicut, Malappuram District, Thenhipalam, Kerala 673635',
      city: 'Malappuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'NAAC Accredited Grade A+, UGC Approved',
      officialWebsite: 'https://uoc.ac.in',
      contactEmail: 'registrar@uoc.ac.in',
      contactPhone: '+91 494 2407227',
      facilities: 'CHMK Library, Botanical Garden, Central Instrumentation Facility, Stadium, Sports Hostel, Wi-Fi Campus',
      scholarships: 'Post Matric Scholarship, Suvarna Jubilee Merit Scholarship, University Merit Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'University of Calicut Official Portal & UGC 2024 Records',
      rating: 4.6,
      establishedYear: 1968,
      nirfRank: 73,
      departments: {
        create: [
          {
            name: 'Department of Computer Science',
            code: 'UOC-CS',
            description: 'Pioneering research in Malayalam Natural Language Processing, Machine Learning, and Computer Vision.',
          },
          {
            name: 'Department of Commerce & Management Studies',
            code: 'UOC-DCMS',
            description: 'Specializations in Finance, International Business, Human Resource Management, and Analytics.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // 3. Mahatma Gandhi University (MGU)
  const mgu = await prisma.institution.upsert({
    where: { slug: 'mahatma-gandhi-university-kerala' },
    update: {
      affiliation: 'UGC Recognized State University, NAAC Grade A++',
      officialWebsite: 'https://mgu.ac.in',
    },
    create: {
      name: 'Mahatma Gandhi University',
      slug: 'mahatma-gandhi-university-kerala',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=400&fit=crop',
      location: 'Priyadarsini Hills, Kottayam',
      address: 'Priyadarsini Hills P.O, Athirampuzha, Kottayam, Kerala 686560',
      city: 'Kottayam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'NAAC Accredited Grade A++, Chancellor\'s Award Winner',
      officialWebsite: 'https://mgu.ac.in',
      contactEmail: 'registrar@mgu.ac.in',
      contactPhone: '+91 481 2731007',
      facilities: 'Advanced Centre for Nanotechnology, International Inter-University Centre, Central Library, High-performance Computing',
      scholarships: 'Aspire Scholarship, University Merit Scholarship, Kerala State Higher Education Council Grant',
      verificationStatus: 'VERIFIED',
      officialSource: 'NIRF 2024 Rankings & MGU Official Gazette',
      rating: 4.8,
      establishedYear: 1983,
      nirfRank: 31,
      departments: {
        create: [
          {
            name: 'School of Computer Sciences',
            code: 'MGU-SCS',
            description: 'Research programs in Artificial Intelligence, Cyber Security, and Bio-computing.',
          },
          {
            name: 'School of Pure and Applied Physics',
            code: 'MGU-SPAP',
            description: 'Nanomaterials, Photonics, and Theoretical High Energy Physics research.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // 4. University of Kerala
  const keralaUniv = await prisma.institution.upsert({
    where: { slug: 'university-of-kerala' },
    update: {
      affiliation: 'UGC Recognized State University, NAAC Grade A++',
      officialWebsite: 'https://keralauniversity.ac.in',
    },
    create: {
      name: 'University of Kerala',
      slug: 'university-of-kerala',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
      location: 'Palayam, Thiruvananthapuram',
      address: 'Senate House Campus, Palayam, Thiruvananthapuram, Kerala 695034',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'NAAC Accredited Grade A++ (Score 3.67), Oldest University in Kerala',
      officialWebsite: 'https://keralauniversity.ac.in',
      contactEmail: 'ku.registrar@keralauniversity.ac.in',
      contactPhone: '+91 471 2305738',
      facilities: 'Kerala University Central Library, Kariavattom Green Campus, Observatory, Heritage Museum, Research Centers',
      scholarships: 'Kerala State Merit Scholarship, INSPIRE Fellowship, University Research Fellowships',
      verificationStatus: 'VERIFIED',
      officialSource: 'NAAC Peer Review Report & Kerala University Senate Gazette',
      rating: 4.7,
      establishedYear: 1937,
      nirfRank: 24,
      departments: {
        create: [
          {
            name: 'Department of Computational Biology and Bioinformatics',
            code: 'KU-DCB',
            description: 'Pioneering multidisciplinary genomic data science and machine learning research.',
          },
          {
            name: 'Department of Computer Science',
            code: 'KU-DCS',
            description: 'High-performance cloud architectures, NLP, and Artificial Neural Networks.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // 5. Cochin University of Science and Technology (CUSAT)
  const cusat = await prisma.institution.upsert({
    where: { slug: 'cochin-university-of-science-and-technology' },
    update: {
      affiliation: 'UGC Recognized State Science & Technology University, NAAC Grade A+',
      officialWebsite: 'https://cusat.ac.in',
    },
    create: {
      name: 'Cochin University of Science and Technology (CUSAT)',
      slug: 'cochin-university-of-science-and-technology',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
      location: 'Kalamassery, Kochi',
      address: 'South Kalamassery, Kalamassery, Kochi, Kerala 682022',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'NAAC Accredited Grade A+, Premier Science and Technology University',
      officialWebsite: 'https://cusat.ac.in',
      contactEmail: 'admissions@cusat.ac.in',
      contactPhone: '+91 484 2577159',
      facilities: 'Centre for Science in Society, Marine Technology Centre, Supercomputing Hub, CUSAT Technology Business Incubator',
      scholarships: 'CUSAT CAT Merit Scholarships, Government of India Fellowships, Corporate Endowments',
      verificationStatus: 'VERIFIED',
      officialSource: 'CUSAT Admissions Council & NIRF 2024 University Category',
      rating: 4.8,
      establishedYear: 1971,
      nirfRank: 37,
      departments: {
        create: [
          {
            name: 'School of Engineering (SOE)',
            code: 'CUSAT-SOE',
            description: 'Comprehensive engineering degree programs with rigorous industrial internships.',
          },
          {
            name: 'Department of Computer Applications',
            code: 'CUSAT-DCA',
            description: 'Advanced software design, database security, and cloud systems engineering.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // 6. Kannur University
  const kannur = await prisma.institution.upsert({
    where: { slug: 'kannur-university' },
    update: {
      affiliation: 'UGC Recognized State University, NAAC Accredited',
      officialWebsite: 'https://kannuruniversity.ac.in',
    },
    create: {
      name: 'Kannur University',
      slug: 'kannur-university',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop',
      location: 'Thavakkara, Kannur',
      address: 'Kannur University Campus P.O, Thavakkara, Kannur, Kerala 670002',
      city: 'Kannur',
      state: 'Kerala',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'UGC Recognized Multi-Campus University serving Malabar Region',
      officialWebsite: 'https://kannuruniversity.ac.in',
      contactEmail: 'registrar@kannuruniversity.ac.in',
      contactPhone: '+91 497 2715185',
      facilities: 'Multi-campus Central Library, Information Technology Centre, Botanical Research Garden, Indoor Sports Stadium',
      scholarships: 'Post Matric Scholarship for Minorities, Kannur University Endowment Scholarships',
      verificationStatus: 'VERIFIED',
      officialSource: 'Kannur University Official Administration Records & UGC Report',
      rating: 4.4,
      establishedYear: 1996,
      nirfRank: 120,
      departments: {
        create: [
          {
            name: 'Department of Information Technology',
            code: 'KU-IT',
            description: 'Specialization in Software Architecture, Distributed Networks, and Applied AI.',
          },
          {
            name: 'School of Management Studies',
            code: 'KU-SMS',
            description: 'MBA in Marketing, Finance, HR, and Rural Enterprise Management.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // Update CET affiliation to KTU
  await prisma.institution.updateMany({
    where: { slug: 'college-of-engineering-trivandrum' },
    data: {
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      institutionType: 'Government',
    },
  });

  // 7. Seed Affiliated Colleges across categories:
  // A. Government Engineering College, Thrissur (GEC Thrissur) - Government
  const gect = await prisma.institution.upsert({
    where: { slug: 'government-engineering-college-thrissur' },
    update: {},
    create: {
      name: 'Government Engineering College Thrissur (GECT)',
      slug: 'government-engineering-college-thrissur',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
      location: 'Ramavarmapuram, Thrissur',
      address: 'GEC Thrissur, Ramavarmapuram P.O, Thrissur, Kerala 680009',
      city: 'Thrissur',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://gectcr.ac.in',
      contactEmail: 'principal@gectcr.ac.in',
      contactPhone: '+91 487 2334144',
      facilities: 'Center of Excellence in AI, CAD/CAM Labs, Central Library, Mens & Ladies Hostels, Innovation & Incubation Center',
      scholarships: 'KEAM Merit Scholarship, E-Grantz Fee Concession, National Merit Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'Directorate of Technical Education (DTE) Kerala & KTU Affiliation Gazette',
      rating: 4.7,
      establishedYear: 1957,
      nirfRank: 110,
      departments: {
        create: [
          {
            name: 'Department of Computer Science and Engineering',
            code: 'GECT-CS',
            description: 'NBA Accredited program in Computer Systems and Software.',
          },
          {
            name: 'Department of Mechanical Engineering',
            code: 'GECT-ME',
            description: 'Advanced Thermal and Manufacturing Engineering Laboratories.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // B. TKM College of Engineering, Kollam - Government Aided
  const tkm = await prisma.institution.upsert({
    where: { slug: 'tkm-college-of-engineering-kollam' },
    update: {},
    create: {
      name: 'TKM College of Engineering, Kollam',
      slug: 'tkm-college-of-engineering-kollam',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
      location: 'Karicode, Kollam',
      address: 'Karicode, Periypurath P.O, Kollam, Kerala 691005',
      city: 'Kollam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Aided',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://tkmce.ac.in',
      contactEmail: 'principal@tkmce.ac.in',
      contactPhone: '+91 474 2712022',
      facilities: 'First Government-Aided Engineering College in Kerala, FAB Lab, High Performance Computing, Hostels',
      scholarships: 'TKM Trust Merit Endowment, Kerala State Concession, AICTE Pragati',
      verificationStatus: 'VERIFIED',
      officialSource: 'NBA Accreditation Records & KTU Official Registry',
      rating: 4.6,
      establishedYear: 1958,
      nirfRank: 140,
      departments: {
        create: [
          {
            name: 'Department of Civil Engineering',
            code: 'TKM-CE',
            description: 'Premier infrastructure and structural engineering department in South Kerala.',
          },
          {
            name: 'Department of Computer Science and Engineering',
            code: 'TKM-CS',
            description: 'AI, Blockchain, and Full Stack application engineering tracks.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // C. Farook College (Autonomous), Kozhikode - Autonomous / Aided
  const farook = await prisma.institution.upsert({
    where: { slug: 'farook-college-autonomous-calicut' },
    update: {},
    create: {
      name: 'Farook College (Autonomous), Kozhikode',
      slug: 'farook-college-autonomous-calicut',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
      location: 'Farook College P.O, Kozhikode',
      address: 'Feroke, Kozhikode, Kerala 673632',
      city: 'Kozhikode',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Autonomous',
      affiliation: 'University of Calicut',
      officialWebsite: 'https://farookcollege.ac.in',
      contactEmail: 'mail@farookcollege.ac.in',
      contactPhone: '+91 495 2440660',
      facilities: 'Abussabah Central Library, Audio Visual Studio, Sports Complex, Hostels, Language Labs',
      scholarships: 'Farook College Educational Trust Scholarships, Government Merit Scholarships',
      verificationStatus: 'VERIFIED',
      officialSource: 'UGC Autonomous College Registry & NAAC Grade A+ Certification',
      rating: 4.7,
      establishedYear: 1948,
      nirfRank: 65,
      departments: {
        create: [
          {
            name: 'Postgraduate & Research Department of Computer Science',
            code: 'FC-CS',
            description: 'Undergraduate and Master programs in Applied Computer Science and Data Analytics.',
          },
          {
            name: 'Department of Economics',
            code: 'FC-ECON',
            description: 'Econometrics, Development Economics, and Financial Policy Research.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // D. Muthoot Institute of Technology and Science (MITS), Kochi - Private Self-Financing
  const mits = await prisma.institution.upsert({
    where: { slug: 'muthoot-institute-of-technology-and-science' },
    update: {},
    create: {
      name: 'Muthoot Institute of Technology and Science (MITS)',
      slug: 'muthoot-institute-of-technology-and-science',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
      location: 'Varikoli, Puthencruz, Ernakulam',
      address: 'Varikoli P.O, Puthencruz, Ernakulam, Kerala 682308',
      city: 'Ernakulam',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Private Self-Financing',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://mgmits.ac.in',
      contactEmail: 'principal@mgmits.ac.in',
      contactPhone: '+91 484 2732111',
      facilities: 'Smart Classrooms, Robotics Lab, Apple Authorized Training Lab, Modern Cafeteria, Campus Hostels',
      scholarships: 'Muthoot Foundation Merit Scholarship (up to 100% Tuition Waiver for KEAM Rank Holders)',
      verificationStatus: 'VERIFIED',
      officialSource: 'NBA Accredited Programs & AICTE Approval Order 2024',
      rating: 4.5,
      establishedYear: 2013,
      nirfRank: 165,
      departments: {
        create: [
          {
            name: 'Department of Computer Science and Engineering (Artificial Intelligence)',
            code: 'MITS-CS-AI',
            description: 'Focused curriculum on Deep Learning, Machine Learning, and Cloud AI Architectures.',
          },
          {
            name: 'Department of Electronics and Communication Engineering',
            code: 'MITS-ECE',
            description: 'VLSI Design, Embedded IoT, and Communication Systems.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // Add B.Tech / Degree Courses for GECT if needed
  const gectCsDept = gect.departments.find(d => d.code === 'GECT-CS');
  if (gectCsDept) {
    const existingCourse = await prisma.course.findFirst({
      where: { code: 'GECT-BTECH-CSE' },
    });
    if (!existingCourse) {
      await prisma.course.create({
        data: {
          institutionId: gect.id,
          departmentId: gectCsDept.id,
          title: 'B.Tech in Computer Science and Engineering',
          code: 'GECT-BTECH-CSE',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          totalSeats: 120,
          description: 'A four-year professional degree recognized worldwide for top-tier academic rigor and placement records.',
          eligibility: 'Passed 10+2 with Minimum 45% in Physics, Chemistry, and Mathematics. Valid KEAM entrance rank.',
          admissionProcess: 'Centralized Allotment Process (CAP) conducted by CEE Kerala through KEAM Counseling.',
          academicYear: '2026-2027',
          verified: true,
          fees: {
            create: [
              {
                academicYear: '2026-2027',
                period: 'ANNUAL',
                tuitionFee: 8500,
                admissionFee: 1000,
                examFee: 1500,
                labFee: 1200,
                hostelFee: 12000,
                otherFee: 2000,
                totalFee: 26200,
                scholarshipAvailable: true,
                officialSource: 'Directorate of Technical Education Kerala Fee Structure 2024-25',
              },
            ],
          },
        },
      });
    }
  }

  // Add Course for Farook College
  const fcCsDept = farook.departments.find(d => d.code === 'FC-CS');
  if (fcCsDept) {
    const existingCourse = await prisma.course.findFirst({
      where: { code: 'FC-BSC-CS' },
    });
    if (!existingCourse) {
      await prisma.course.create({
        data: {
          institutionId: farook.id,
          departmentId: fcCsDept.id,
          title: 'B.Sc Computer Science (Autonomous Honors)',
          code: 'FC-BSC-CS',
          level: 'UNDERGRADUATE',
          durationYears: 3,
          totalSeats: 48,
          description: 'Autonomous curriculum structured with specialization in Cloud Software, Cyber Security, and Web Computing.',
          eligibility: 'Passed Higher Secondary (10+2) examination with Mathematics/Computer Science as a subject.',
          admissionProcess: 'Calicut University Centralized CAP Allotment & Farook College Autonomous Merit List.',
          academicYear: '2026-2027',
          verified: true,
          fees: {
            create: [
              {
                academicYear: '2026-2027',
                period: 'ANNUAL',
                tuitionFee: 3200,
                admissionFee: 500,
                examFee: 900,
                labFee: 800,
                hostelFee: 14000,
                otherFee: 1500,
                totalFee: 20900,
                scholarshipAvailable: true,
                officialSource: 'University of Calicut Aided College Gazette',
              },
            ],
          },
        },
      });
    }
  }

  // Add Course for MITS
  const mitsDept = mits.departments.find(d => d.code === 'MITS-CS-AI');
  if (mitsDept) {
    const existingCourse = await prisma.course.findFirst({
      where: { code: 'MITS-BTECH-CSAI' },
    });
    if (!existingCourse) {
      await prisma.course.create({
        data: {
          institutionId: mits.id,
          departmentId: mitsDept.id,
          title: 'B.Tech in Artificial Intelligence & Data Science',
          code: 'MITS-BTECH-CSAI',
          level: 'UNDERGRADUATE',
          durationYears: 4,
          totalSeats: 60,
          description: 'High-demand industry degree program featuring hands-on AI model deployment, Neural Networks, and NLP.',
          eligibility: 'Higher Secondary with minimum 45% marks in PCM. KEAM Rank or Management Merit criteria.',
          admissionProcess: '50% Merit seats via KEAM CAP; 50% Management Merit seats via College Counseling.',
          academicYear: '2026-2027',
          verified: true,
          fees: {
            create: [
              {
                academicYear: '2026-2027',
                period: 'ANNUAL',
                tuitionFee: 75000,
                admissionFee: 1500,
                examFee: 2000,
                labFee: 3000,
                hostelFee: 32000,
                otherFee: 5000,
                totalFee: 118500,
                scholarshipAvailable: true,
                officialSource: 'Fee Regulatory Committee for Professional Colleges Kerala',
              },
            ],
          },
        },
      });
    }
  }

  console.log('✅ Successfully seeded 6 Kerala Universities and Category-verified Affiliated Colleges!');
}

seedKeralaInstitutions()
  .catch((e) => {
    console.error('Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
