import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EDUNEXA Database Seeding...');

  // Clean existing records if any
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.communityComment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.aIConversationMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.academicEvent.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.studyGroupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.studyPartnerConnection.deleteMany();
  await prisma.studyPartnerRequest.deleteMany();
  await prisma.studyProfile.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.resourceBookmark.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.savedInstitution.deleteMany();
  await prisma.courseFee.deleteMany();
  await prisma.course.deleteMany();
  await prisma.department.deleteMany();
  await prisma.campus.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.universityProfile.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.user.deleteMany();

  const hashedStudentPassword = await bcrypt.hash('Student@12345', 10);
  const hashedFacultyPassword = await bcrypt.hash('Faculty@12345', 10);
  const hashedUnivPassword = await bcrypt.hash('University@12345', 10);
  const hashedAdminPassword = await bcrypt.hash('Admin@12345', 10);

  // 1. Create Administrator (Securely provisioned, no public admin signup)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@edunexa.org',
      username: 'edunexaadmin',
      passwordHash: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // 2. Create Student
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@edunexa.org',
      username: 'aaravsharma',
      passwordHash: hashedStudentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
      studentProfile: {
        create: {
          fullName: 'Aarav Sharma',
          age: 20,
          gender: 'Male',
          phone: '+91 9847123456',
          country: 'India',
          state: 'Kerala',
          district: 'Kozhikode',
          educationLevel: 'Undergraduate',
          preferredCourse: 'Computer Science and Engineering',
          preferredInstitution: 'National Institute of Technology Calicut',
          admissionStatus: 'ALREADY_ADMITTED',
          bio: 'Passionate about algorithms, distributed systems, and AI. Eager to collaborate on open-source projects.',
        },
      },
      studyProfile: {
        create: {
          subjects: 'Data Structures, Operating Systems, Database Management Systems, Machine Learning',
          course: 'B.Tech Computer Science and Engineering',
          semester: 'Semester 4',
          preferredLanguage: 'English',
          studyGoals: 'Master graph algorithms and prepare for GATE / top placement drives',
          availableTimes: 'Weekday Evenings (6:00 PM - 9:00 PM), Saturday mornings',
          learningStyle: 'VISUAL',
          groupPreference: 'BOTH',
          isDiscoverable: true,
        },
      },
    },
  });

  // Additional Peer Student for Study Partner Matching
  const studentPeer1 = await prisma.user.create({
    data: {
      email: 'ananya@edunexa.org',
      username: 'ananyamenon',
      passwordHash: hashedStudentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
      studentProfile: {
        create: {
          fullName: 'Ananya Menon',
          age: 20,
          gender: 'Female',
          phone: '+91 9876543210',
          country: 'India',
          state: 'Kerala',
          district: 'Ernakulam',
          educationLevel: 'Undergraduate',
          preferredCourse: 'Computer Science and Engineering',
          preferredInstitution: 'NIT Calicut',
          admissionStatus: 'ALREADY_ADMITTED',
          bio: 'Interested in Artificial Intelligence, Cloud Computing, and competitive programming.',
        },
      },
      studyProfile: {
        create: {
          subjects: 'Data Structures, Machine Learning, Operating Systems',
          course: 'B.Tech Computer Science and Engineering',
          semester: 'Semester 4',
          preferredLanguage: 'English',
          studyGoals: 'Collaborative problem solving and weekly system design practice',
          availableTimes: 'Weekdays after 7:00 PM, Sunday afternoons',
          learningStyle: 'READING_WRITING',
          groupPreference: 'ONLINE',
          isDiscoverable: true,
        },
      },
    },
  });

  const studentPeer2 = await prisma.user.create({
    data: {
      email: 'rohit@edunexa.org',
      username: 'rohitreddy',
      passwordHash: hashedStudentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
      studentProfile: {
        create: {
          fullName: 'Rohit Reddy',
          age: 19,
          gender: 'Male',
          phone: '+91 9765432109',
          country: 'India',
          state: 'Karnataka',
          district: 'Bengaluru',
          educationLevel: 'Undergraduate',
          preferredCourse: 'Electronics and Communication',
          preferredInstitution: 'IISc Bangalore',
          admissionStatus: 'LOOKING_FOR_ADMISSION',
          bio: 'Electronics enthusiast focused on VLSI design and embedded IoT microcontrollers.',
        },
      },
      studyProfile: {
        create: {
          subjects: 'Digital Electronics, Signal Processing, Microcontrollers',
          course: 'B.Tech Electronics and Communication',
          semester: 'Semester 3',
          preferredLanguage: 'English',
          studyGoals: 'Crack GATE examination with a high percentile',
          availableTimes: 'Weekends full day, Weekdays 8:00 PM - 10:00 PM',
          learningStyle: 'KINESTHETIC',
          groupPreference: 'BOTH',
          isDiscoverable: true,
        },
      },
    },
  });

  // 3. Create Faculty
  const facultyUser = await prisma.user.create({
    data: {
      email: 'faculty@edunexa.org',
      username: 'drradhakrishnan',
      passwordHash: hashedFacultyPassword,
      role: 'FACULTY',
      status: 'ACTIVE',
      emailVerified: true,
      facultyProfile: {
        create: {
          fullName: 'Dr. K. Radhakrishnan',
          phone: '+91 9447123987',
          institutionName: 'National Institute of Technology Calicut',
          departmentName: 'Department of Computer Science and Engineering',
          designation: 'Professor & Head of Department',
          subjectSpecialization: 'Algorithms, Distributed Computing & Cloud Systems',
          professionalInfo: 'PhD from IIT Madras. 18+ years of teaching and research experience in algorithmic design and distributed cloud infrastructure.',
          approvalStatus: 'APPROVED',
        },
      },
    },
  });

  // 4. Create University Official User
  const univUser = await prisma.user.create({
    data: {
      email: 'university@edunexa.org',
      username: 'nitcofficial',
      passwordHash: hashedUnivPassword,
      role: 'UNIVERSITY',
      status: 'ACTIVE',
      emailVerified: true,
      universityProfile: {
        create: {
          institutionName: 'National Institute of Technology Calicut',
          officialEmail: 'registrar@nitc.ac.in',
          phone: '+91 495 2286100',
          address: 'NIT Campus P.O, Chathamangalam',
          country: 'India',
          state: 'Kerala',
          city: 'Kozhikode',
          website: 'https://www.nitc.ac.in',
          institutionType: 'NIT',
          approvalStatus: 'APPROVED',
        },
      },
    },
  });

  // 5. Seed Institutions (Kerala, Karnataka, Tamil Nadu, Maharashtra, Delhi, Gujarat)
  const nitc = await prisma.institution.create({
    data: {
      name: 'National Institute of Technology Calicut (NITC)',
      slug: 'nit-calicut',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
      location: 'Chathamangalam, Kozhikode',
      address: 'NIT Campus P.O, Chathamangalam, Kozhikode, Kerala 673601',
      city: 'Kozhikode',
      state: 'Kerala',
      country: 'India',
      institutionType: 'NIT',
      affiliation: 'Autonomous Institute of National Importance (Ministry of Education)',
      officialWebsite: 'https://www.nitc.ac.in',
      contactEmail: 'admissions@nitc.ac.in',
      contactPhone: '+91 495 2286101',
      facilities: 'Central Computer Center, Technical Incubation Hub, Digital Library, Sports Complex, High-Speed Wi-Fi, 12 Hostels',
      scholarships: 'Merit-cum-Means Scholarship, Central Sector Scholarship Scheme, Fee Waiver for SC/ST/PwD',
      verificationStatus: 'VERIFIED',
      officialSource: 'Ministry of Education Gazette & NIRF 2024 Portal',
      rating: 4.8,
      establishedYear: 1961,
      nirfRank: 25,
      departments: {
        create: [
          {
            name: 'Department of Computer Science and Engineering',
            code: 'CSED',
            description: 'Premier department specializing in AI, Machine Learning, Cryptography, and Software Engineering.',
          },
          {
            name: 'Department of Electronics and Communication Engineering',
            code: 'ECED',
            description: 'Excellence in Microelectronics, Telecommunications, Signal Processing, and Embedded Systems.',
          },
          {
            name: 'Department of Electrical Engineering',
            code: 'EED',
            description: 'Focus on Power Systems, Renewable Energy, and Smart Grid technologies.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  // Add Courses for NIT Calicut
  const csDept = nitc.departments.find(d => d.code === 'CSED')!;
  const ecDept = nitc.departments.find(d => d.code === 'ECED')!;

  const btechCSE = await prisma.course.create({
    data: {
      institutionId: nitc.id,
      departmentId: csDept.id,
      title: 'B.Tech in Computer Science and Engineering',
      code: 'CS101',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Comprehensive 4-year undergraduate curriculum covering algorithm design, artificial intelligence, operating systems, compiler construction, and cyber security.',
      eligibility: '10+2 with Physics, Mathematics, Chemistry with minimum 75% marks and valid JEE Main ranking.',
      totalSeats: 180,
      admissionProcess: 'JoSAA / CSAB Centralized National Counseling based on JEE Main ranks.',
      academicYear: '2026-2027',
      verified: true,
      fees: {
        create: [
          {
            academicYear: '2026-2027',
            period: 'ANNUAL',
            tuitionFee: 125000,
            admissionFee: 5000,
            examFee: 4000,
            labFee: 6000,
            hostelFee: 35000,
            otherFee: 8000,
            totalFee: 178000,
            scholarshipAvailable: true,
            officialSource: 'NIT Calicut Fee Structure Notification No. Acad/2026/Fee-01',
            isEstimate: false,
          },
        ],
      },
      semesters: {
        create: [
          {
            semesterNumber: 1,
            title: 'Semester 1 — Foundation in Computational Sciences',
            subjects: {
              create: [
                {
                  departmentId: csDept.id,
                  title: 'Introduction to Computing & Problem Solving',
                  code: 'CS1001',
                  credits: 4,
                  description: 'Foundations of algorithms, procedural programming in C, pointers, memory models.',
                },
                {
                  departmentId: csDept.id,
                  title: 'Calculus and Linear Algebra',
                  code: 'MA1001',
                  credits: 4,
                  description: 'Multivariable calculus, vector calculus, matrices, eigenvalues and eigenvectors.',
                },
              ],
            },
          },
          {
            semesterNumber: 4,
            title: 'Semester 4 — Core Algorithms & Systems',
            subjects: {
              create: [
                {
                  departmentId: csDept.id,
                  title: 'Data Structures and Algorithms',
                  code: 'CS2004',
                  credits: 4,
                  description: 'Advanced trees, graph algorithms, dynamic programming, greediness, NP-completeness.',
                },
                {
                  departmentId: csDept.id,
                  title: 'Operating Systems Principles',
                  code: 'CS2005',
                  credits: 4,
                  description: 'Process management, concurrency, virtual memory, disk scheduling, distributed kernels.',
                },
                {
                  departmentId: csDept.id,
                  title: 'Database Management Systems',
                  code: 'CS2006',
                  credits: 3,
                  description: 'Relational algebra, SQL, normalization (BCNF, 3NF), transactions, ACID properties, indexing.',
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      semesters: {
        include: { subjects: true },
      },
    },
  });

  const btechECE = await prisma.course.create({
    data: {
      institutionId: nitc.id,
      departmentId: ecDept.id,
      title: 'B.Tech in Electronics and Communication Engineering',
      code: 'EC101',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Program dedicated to semiconductor devices, VLSI systems, wireless communication networks, and embedded hardware architectures.',
      eligibility: '10+2 with Physics, Mathematics, Chemistry with min 75% marks and valid JEE Main ranking.',
      totalSeats: 160,
      admissionProcess: 'JoSAA / CSAB Centralized Counseling.',
      academicYear: '2026-2027',
      verified: true,
      fees: {
        create: [
          {
            academicYear: '2026-2027',
            period: 'ANNUAL',
            tuitionFee: 125000,
            admissionFee: 5000,
            examFee: 4000,
            labFee: 8000,
            hostelFee: 35000,
            otherFee: 8000,
            totalFee: 180000,
            scholarshipAvailable: true,
            officialSource: 'NIT Calicut Fee Structure Notification No. Acad/2026/Fee-01',
            isEstimate: false,
          },
        ],
      },
    },
  });

  // Additional Premier Institutions
  const iisc = await prisma.institution.create({
    data: {
      name: 'Indian Institute of Science (IISc Bangalore)',
      slug: 'iisc-bangalore',
      logoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
      location: 'CV Raman Road, Bengaluru',
      address: 'CV Raman Rd, Bengaluru, Karnataka 560012',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      institutionType: 'Deemed University',
      affiliation: 'Autonomous Institution of National Eminence (MoE, Govt of India)',
      officialWebsite: 'https://iisc.ac.in',
      contactEmail: 'academic.admissions@iisc.ac.in',
      contactPhone: '+91 80 22932210',
      facilities: 'Supercomputing Education and Research Centre, National Nanofabrication Facility, JRD Tata Memorial Library',
      scholarships: 'Inspire Scholarship, KVPY Fellowship, Ministry of Education Research Fellowship',
      verificationStatus: 'VERIFIED',
      officialSource: 'IISc Official Bulletin & NIRF Ranked #1 University in India',
      rating: 4.95,
      establishedYear: 1909,
      nirfRank: 1,
      departments: {
        create: [
          {
            name: 'Division of Electrical, Electronics, and Computer Sciences (EECS)',
            code: 'EECS',
            description: 'Advanced research in Quantum Computing, Artificial Intelligence, Robotics, and Signal Processing.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  const iiscDept = iisc.departments[0];
  await prisma.course.create({
    data: {
      institutionId: iisc.id,
      departmentId: iiscDept.id,
      title: 'B.Tech in Mathematics and Computing',
      code: 'IISCMC101',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Elite program blending rigorous mathematical theory with modern theoretical computer science, machine learning, and quantitative finance.',
      eligibility: 'Top ranks in JEE Advanced with Mathematics stream.',
      totalSeats: 52,
      admissionProcess: 'JoSAA Counseling based on JEE Advanced Rank.',
      academicYear: '2026-2027',
      verified: true,
      fees: {
        create: [
          {
            academicYear: '2026-2027',
            period: 'ANNUAL',
            tuitionFee: 85000,
            admissionFee: 10000,
            examFee: 3000,
            labFee: 5000,
            hostelFee: 40000,
            otherFee: 7000,
            totalFee: 150000,
            scholarshipAvailable: true,
            officialSource: 'IISc Undergraduate Admissions Office Gazetted Fee Matrix 2026',
            isEstimate: false,
          },
        ],
      },
    },
  });

  const iitm = await prisma.institution.create({
    data: {
      name: 'Indian Institute of Technology Madras (IIT Madras)',
      slug: 'iit-madras',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&h=400&fit=crop',
      location: 'Sardar Patel Road, Chennai',
      address: 'IIT P.O., Chennai, Tamil Nadu 600036',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      institutionType: 'IIT',
      affiliation: 'Institute of National Importance (IIT Council / Ministry of Education)',
      officialWebsite: 'https://www.iitm.ac.in',
      contactEmail: 'admissions@iitm.ac.in',
      contactPhone: '+91 44 22578100',
      facilities: 'IITM Research Park, Central Library, High Performance Computing, 20 Hostels, Center for Innovation',
      scholarships: 'Institute Merit-cum-Means, Aditya Birla Scholarship, Free-studentship',
      verificationStatus: 'VERIFIED',
      officialSource: 'IIT Madras Academic Council & NIRF Ranked #1 Overall Engineering Institute',
      rating: 4.9,
      establishedYear: 1959,
      nirfRank: 1,
      departments: {
        create: [
          {
            name: 'Department of Computer Science and Engineering',
            code: 'IITM-CSE',
            description: 'Leading research in algorithms, distributed systems, AI, theory of computation, cryptography.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  const iitmDept = iitm.departments[0];
  await prisma.course.create({
    data: {
      institutionId: iitm.id,
      departmentId: iitmDept.id,
      title: 'B.Tech in Computer Science and Engineering',
      code: 'IITM-CS101',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'World-renowned program producing top software engineers, system architects, and researchers.',
      eligibility: 'Qualified in JEE Advanced with top category rankings.',
      totalSeats: 90,
      admissionProcess: 'JoSAA Centralized Allocation.',
      academicYear: '2026-2027',
      verified: true,
      fees: {
        create: [
          {
            academicYear: '2026-2027',
            period: 'ANNUAL',
            tuitionFee: 200000,
            admissionFee: 15000,
            examFee: 5000,
            labFee: 10000,
            hostelFee: 45000,
            otherFee: 10000,
            totalFee: 285000,
            scholarshipAvailable: true,
            officialSource: 'IIT Council Uniform Fee Schedule 2026',
            isEstimate: false,
          },
        ],
      },
    },
  });

  const cet = await prisma.institution.create({
    data: {
      name: 'College of Engineering Trivandrum (CET)',
      slug: 'cet-trivandrum',
      logoUrl: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop',
      location: 'Sreekaryam, Thiruvananthapuram',
      address: 'Engineering College P.O, Sreekaryam, Thiruvananthapuram, Kerala 695016',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      country: 'India',
      institutionType: 'Government Engineering College',
      affiliation: 'APJ Abdul Kalam Technological University (KTU)',
      officialWebsite: 'https://www.cet.ac.in',
      contactEmail: 'principal@cet.ac.in',
      contactPhone: '+91 471 2515502',
      facilities: 'State of the art FabLab, Diamond Jubilee Library, Advanced Robotics Lab, Sports Complex',
      scholarships: 'Kerala State Merit Scholarship, E-Grantz for Backward Communities, Alumni Endowment Fund',
      verificationStatus: 'VERIFIED',
      officialSource: 'Kerala Commissioner for Entrance Examinations (CEE) Prospectus',
      rating: 4.7,
      establishedYear: 1939,
      nirfRank: 85,
      departments: {
        create: [
          {
            name: 'Department of Computer Science and Engineering',
            code: 'CET-CS',
            description: 'One of the oldest and most prestigious engineering faculties in South India.',
          },
        ],
      },
    },
    include: { departments: true },
  });

  const cetDept = cet.departments[0];
  await prisma.course.create({
    data: {
      institutionId: cet.id,
      departmentId: cetDept.id,
      title: 'B.Tech in Artificial Intelligence and Machine Learning',
      code: 'CET-AIML',
      level: 'UNDERGRADUATE',
      durationYears: 4,
      description: 'Cutting-edge KTU curriculum focused on neural networks, deep learning, NLP, computer vision, and cognitive systems.',
      eligibility: '10+2 with Physics, Chemistry, Math and qualifying rank in Kerala KEAM entrance exam.',
      totalSeats: 60,
      admissionProcess: 'Kerala CEE Centralized Allotment Process (CAP).',
      academicYear: '2026-2027',
      verified: true,
      fees: {
        create: [
          {
            academicYear: '2026-2027',
            period: 'ANNUAL',
            tuitionFee: 8500,
            admissionFee: 1000,
            examFee: 2500,
            labFee: 1500,
            hostelFee: 18000,
            otherFee: 3000,
            totalFee: 34500,
            scholarshipAvailable: true,
            officialSource: 'Govt of Kerala Higher Education Dept Gazette 2026',
            isEstimate: false,
          },
        ],
      },
    },
  });

  // Anna University (Tamil Nadu)
  await prisma.institution.create({
    data: {
      name: 'Anna University (CEG Campus, Guindy)',
      slug: 'anna-university-chennai',
      logoUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=1200&h=400&fit=crop',
      location: 'Guindy, Chennai',
      address: 'Sardar Patel Road, Guindy, Chennai, Tamil Nadu 600025',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      institutionType: 'State University',
      affiliation: 'State University of Tamil Nadu (UGC Recognized, NAAC A++)',
      officialWebsite: 'https://www.annauniv.edu',
      contactEmail: 'tnea@annauniv.edu',
      contactPhone: '+91 44 22357004',
      facilities: 'Ramanujan Computing Centre, Central Library, University Sports Board, Entrepreneurship Cell',
      scholarships: 'First Graduate Concession, TN Post Matric Scholarship, BC/MBC Welfare Scholarships',
      verificationStatus: 'VERIFIED',
      officialSource: 'Tamil Nadu Engineering Admissions (TNEA) Official Prospectus',
      rating: 4.75,
      establishedYear: 1978,
      nirfRank: 13,
    },
  });

  // Delhi University
  await prisma.institution.create({
    data: {
      name: 'University of Delhi (Faculty of Technology / St. Stephens)',
      slug: 'delhi-university',
      logoUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=400&fit=crop',
      location: 'Benito Juarez Road, South Campus / North Campus',
      address: 'University of Delhi, Delhi 110007',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      institutionType: 'Central University',
      affiliation: 'Ministry of Education, Government of India (UGC / NAAC A+)',
      officialWebsite: 'https://www.du.ac.in',
      contactEmail: 'admissions@du.ac.in',
      contactPhone: '+91 11 27006900',
      facilities: 'Central Science Library, WUS Health Centre, Sports Stadium, Campus Wi-Fi',
      scholarships: 'Vice Chancellor Student Fund, National Merit Scholarship',
      verificationStatus: 'VERIFIED',
      officialSource: 'DU Academic Council Gazette & CUET Admission Bulletin 2026',
      rating: 4.8,
      establishedYear: 1922,
      nirfRank: 11,
    },
  });

  // 6. Seed Learning Materials (Syllabus, Notes, Question Papers)
  const dsaSem4 = btechCSE.semesters.find(s => s.semesterNumber === 4)!;
  const dsaSubject = dsaSem4.subjects.find(s => s.code === 'CS2004')!;
  const osSubject = dsaSem4.subjects.find(s => s.code === 'CS2005')!;
  const dbSubject = dsaSem4.subjects.find(s => s.code === 'CS2006')!;

  await prisma.learningMaterial.createMany({
    data: [
      {
        title: 'Complete DSA Module 1-5 Lecture Notes & Complexity Proofs',
        description: 'Comprehensive handwritten & typed lecture notes covering asymptotic notations, balanced trees (AVL, Red-Black), graph shortest paths (Dijkstra, Bellman-Ford), and dynamic programming paradigms.',
        resourceType: 'NOTES',
        fileUrl: '/uploads/materials/dsa-comprehensive-notes.pdf',
        fileType: 'pdf',
        fileSize: '4.8 MB',
        institutionId: nitc.id,
        departmentId: csDept.id,
        courseId: btechCSE.id,
        semesterId: dsaSem4.id,
        subjectId: dsaSubject.id,
        uploadedById: facultyUser.id,
        approvalStatus: 'APPROVED',
        sourceInfo: 'Department of CSE, NIT Calicut — Verified Faculty Upload',
        downloadCount: 342,
      },
      {
        title: 'Operating Systems End-Semester Previous Question Paper 2025',
        description: 'Official end-semester examination paper with answer key covering virtual memory paging algorithms, deadlock bank algorithms, and multithreading synchronization primitives.',
        resourceType: 'PREVIOUS_QUESTION_PAPER',
        fileUrl: '/uploads/materials/os-endsem-2025.pdf',
        fileType: 'pdf',
        fileSize: '1.2 MB',
        institutionId: nitc.id,
        departmentId: csDept.id,
        courseId: btechCSE.id,
        semesterId: dsaSem4.id,
        subjectId: osSubject.id,
        uploadedById: facultyUser.id,
        approvalStatus: 'APPROVED',
        sourceInfo: 'Examination Cell, NIT Calicut',
        downloadCount: 512,
      },
      {
        title: 'Database Management Systems Official Syllabus & Course Plan',
        description: 'Authorized semester syllabus, prescribed textbooks (Korth, Silberschatz), laboratory weekly schedule, and internal evaluation scheme.',
        resourceType: 'SYLLABUS',
        fileUrl: '/uploads/materials/dbms-curriculum-syllabus.pdf',
        fileType: 'pdf',
        fileSize: '780 KB',
        institutionId: nitc.id,
        departmentId: csDept.id,
        courseId: btechCSE.id,
        semesterId: dsaSem4.id,
        subjectId: dbSubject.id,
        uploadedById: facultyUser.id,
        approvalStatus: 'APPROVED',
        sourceInfo: 'Academic Board of Studies, NIT Calicut',
        downloadCount: 189,
      },
      {
        title: 'Advanced Graph Theory & Network Flow Question Bank',
        description: 'Over 120 curated algorithmic problems with analytical solutions covering topological sort, Kruskal/Prim MST, and Ford-Fulkerson max flow.',
        resourceType: 'QUESTION_BANK',
        fileUrl: '/uploads/materials/graph-algorithms-qb.pdf',
        fileType: 'pdf',
        fileSize: '3.1 MB',
        institutionId: nitc.id,
        departmentId: csDept.id,
        courseId: btechCSE.id,
        semesterId: dsaSem4.id,
        subjectId: dsaSubject.id,
        uploadedById: facultyUser.id,
        approvalStatus: 'APPROVED',
        sourceInfo: 'Faculty Research Group in Algorithms',
        downloadCount: 278,
      },
    ],
  });

  // 7. Seed Assignment created by Faculty
  const assignment1 = await prisma.assignment.create({
    data: {
      facultyId: facultyUser.id,
      courseId: btechCSE.id,
      subjectId: dsaSubject.id,
      title: 'Assignment 2: Graph Shortest Path & Minimum Spanning Tree Implementation',
      description: 'Implement Dijkstra and Kruskal algorithms in C++ or Python with benchmark comparison on sparse vs dense graphs. Submit code and analysis report.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalMarks: 50,
      attachmentUrl: '/uploads/assignments/dsa-assignment-2-spec.pdf',
    },
  });

  // Student submits the assignment
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentUser.id,
      content: 'Completed graph benchmarks with Adjacency List representation. Benchmarks verify O((V+E)log V) with Fibonacci heap.',
      submissionUrl: '/uploads/submissions/aarav-dsa-assignment2.zip',
      status: 'SUBMITTED',
      marksObtained: 48,
      feedback: 'Excellent complexity analysis and neat code structure. Keep up the good work.',
    },
  });

  // 8. Seed Admission Application Tracker
  await prisma.admissionApplication.create({
    data: {
      studentId: studentUser.id,
      institutionId: nitc.id,
      courseId: btechCSE.id,
      applicationNumber: 'EDUNEXA-2026-NITC-8841',
      status: 'ACCEPTED',
      notes: 'Verified via JoSAA round 1 allotment. Official document verification completed.',
      isOfficial: true,
      submissionDate: new Date(),
    },
  });

  await prisma.admissionApplication.create({
    data: {
      studentId: studentPeer2.id,
      institutionId: iisc.id,
      courseId: iisc.courses?.[0]?.id || btechCSE.id,
      applicationNumber: 'EDUNEXA-2026-IISC-1092',
      status: 'UNDER_REVIEW',
      notes: 'Documents submitted. Awaiting interview schedule notification.',
      isOfficial: true,
      submissionDate: new Date(),
    },
  });

  // 9. Seed Saved Institution
  await prisma.savedInstitution.create({
    data: {
      studentId: studentUser.id,
      institutionId: nitc.id,
    },
  });

  await prisma.savedInstitution.create({
    data: {
      studentId: studentUser.id,
      institutionId: iitm.id,
    },
  });

  // 10. Seed Study Groups & Sessions
  const group1 = await prisma.studyGroup.create({
    data: {
      name: 'Algorithms & Competitive Programming Circle',
      description: 'Weekly collaborative problem-solving group tackling LeetCode Hard, Codeforces, and GATE algorithms.',
      subject: 'Data Structures and Algorithms',
      course: 'B.Tech CSE',
      creatorId: studentUser.id,
      maxMembers: 12,
      isPrivate: false,
      meetingLink: 'https://meet.jit.si/edunexa-algo-circle',
      members: {
        create: [
          { userId: studentUser.id, role: 'ADMIN' },
          { userId: studentPeer1.id, role: 'MEMBER' },
        ],
      },
    },
  });

  await prisma.studySession.create({
    data: {
      title: 'Deep Dive: Dynamic Programming on Trees',
      description: 'Interactive session exploring rerooting techniques and DAG longest paths.',
      subject: 'Data Structures and Algorithms',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
      hostId: studentUser.id,
      groupId: group1.id,
      meetingLink: 'https://meet.jit.si/edunexa-algo-circle',
      status: 'SCHEDULED',
    },
  });

  // 11. Seed Study Partner Connection
  await prisma.studyPartnerConnection.create({
    data: {
      user1Id: studentUser.id,
      user2Id: studentPeer1.id,
    },
  });

  // 12. Seed Academic Calendar Events
  await prisma.academicEvent.createMany({
    data: [
      {
        title: 'Mid-Semester Examinations: Operating Systems',
        description: 'Covers Units 1 through 3 in Hall B, Department of CSE.',
        eventType: 'EXAM',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        userId: studentUser.id,
        institutionId: nitc.id,
      },
      {
        title: 'Assignment 2 Submission Deadline',
        description: 'DSA Graph algorithms report submission on portal.',
        eventType: 'DEADLINE',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: studentUser.id,
        institutionId: nitc.id,
      },
      {
        title: 'National Technology Day Symposium & Hackathon',
        description: 'Annual inter-departmental technical showcase.',
        eventType: 'WORKSHOP',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        institutionId: nitc.id,
      },
    ],
  });

  // 13. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: 'New Study Material Published',
        message: 'Dr. K. Radhakrishnan uploaded: Complete DSA Module 1-5 Lecture Notes & Complexity Proofs',
        type: 'MATERIAL',
        link: '/study-resources',
      },
      {
        userId: studentUser.id,
        title: 'Assignment Graded',
        message: 'Your submission for Assignment 2 was graded: 48/50. View faculty feedback.',
        type: 'ASSIGNMENT',
        link: '/student/assignments',
      },
      {
        userId: facultyUser.id,
        title: 'Student Submission Received',
        message: 'Aarav Sharma submitted Assignment 2: Graph Shortest Path & MST.',
        type: 'ASSIGNMENT',
        link: '/faculty/assignments',
      },
      {
        userId: adminUser.id,
        title: 'Platform System Alert',
        message: 'All 6 institutional records are verified. System metrics updated.',
        type: 'SYSTEM',
        link: '/admin',
      },
    ],
  });

  // 14. Seed Community Posts
  const post1 = await prisma.communityPost.create({
    data: {
      authorId: studentUser.id,
      title: 'How do you approach solving dynamic programming problems with state compressions?',
      content: 'I frequently get confused when transitioning from recursive memoization to bitmask state compression in subset-sum variants. Are there standard problem patterns you recommend practicing first?',
      subject: 'Data Structures and Algorithms',
      tags: 'Algorithms, DP, Bitmasking, GATE',
      likesCount: 14,
      comments: {
        create: [
          {
            authorId: facultyUser.id,
            content: 'Great question, Aarav. Start with the Traveling Salesperson Problem (TSP) on n <= 16 vertices. Represent the visited subset of vertices as integer bits (1 << v). Once you grasp the transition formula dp[mask][u], knapsack state compression becomes intuitive.',
          },
        ],
      },
    },
  });

  // 15. Seed Platform Settings & Initial Audit Log
  await prisma.platformSetting.createMany({
    data: [
      {
        key: 'PLATFORM_NAME',
        value: 'EDUNEXA',
        description: 'Global brand name displayed across student and institutional portals',
      },
      {
        key: 'TAGLINE_PRIMARY',
        value: 'Your Education. Your Future. One Platform.',
        description: 'Primary platform slogan',
      },
      {
        key: 'ALLOW_PUBLIC_REGISTRATION',
        value: 'true',
        description: 'Allow students, faculty, and universities to register publicly',
      },
      {
        key: 'REQUIRE_INSTITUTION_VERIFICATION',
        value: 'true',
        description: 'Universities require administrator audit before full verified listing status',
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      targetType: 'PLATFORM',
      targetId: 'GLOBAL',
      details: 'Initial database seed completed with verified Indian institutions, academic resources, and core roles.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ EDUNEXA Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Credentials provisioned:');
  console.log('👑 Admin:      admin@edunexa.org      / Admin@12345');
  console.log('🎓 Student:    student@edunexa.org    / Student@12345 (username: aaravsharma)');
  console.log('👨‍🏫 Faculty:    faculty@edunexa.org    / Faculty@12345 (username: drradhakrishnan)');
  console.log('🏛️ University: university@edunexa.org / University@12345 (username: nitcofficial)');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
