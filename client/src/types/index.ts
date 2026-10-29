export type UserRole = 'STUDENT' | 'FACULTY' | 'UNIVERSITY' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  profile?: any;
  studentProfile?: StudentProfile;
  facultyProfile?: FacultyProfile;
  universityProfile?: UniversityProfile;
  studyProfile?: StudyProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  age?: number;
  gender?: string;
  phone?: string;
  country: string;
  state?: string;
  district?: string;
  educationLevel?: string;
  preferredCourse?: string;
  preferredInstitution?: string;
  admissionStatus: 'ALREADY_ADMITTED' | 'LOOKING_FOR_ADMISSION';
  bio?: string;
  avatarUrl?: string;
}

export interface FacultyProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  institutionName: string;
  departmentName: string;
  designation: string;
  subjectSpecialization: string;
  professionalInfo?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface UniversityProfile {
  id: string;
  userId: string;
  institutionName: string;
  officialEmail: string;
  phone?: string;
  address?: string;
  country: string;
  state: string;
  city: string;
  website?: string;
  institutionType: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  institutionType: string;
  affiliation?: string;
  officialWebsite: string;
  contactEmail: string;
  contactPhone: string;
  facilities: string;
  scholarships?: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  officialSource: string;
  lastVerificationDate: string;
  rating: number;
  establishedYear?: number;
  nirfRank?: number;
  courses?: Course[];
  departments?: Department[];
  campuses?: Campus[];
  learningMaterials?: LearningMaterial[];
  _count?: {
    courses: number;
    departments: number;
    learningMaterials: number;
  };
}

export interface Campus {
  id: string;
  name: string;
  location: string;
  address: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  institutionId: string;
  departmentId: string;
  title: string;
  code: string;
  level: string;
  durationYears: number;
  description: string;
  eligibility: string;
  totalSeats: number;
  admissionProcess: string;
  academicYear: string;
  verified: boolean;
  institution?: Institution;
  department?: Department;
  fees?: CourseFee[];
  semesters?: Semester[];
}

export interface CourseFee {
  id: string;
  courseId: string;
  academicYear: string;
  period: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  labFee: number;
  hostelFee: number;
  otherFee: number;
  totalFee: number;
  scholarshipAvailable: boolean;
  officialSource: string;
  lastVerifiedDate: string;
  isEstimate: boolean;
}

export interface Semester {
  id: string;
  semesterNumber: number;
  title: string;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  title: string;
  code: string;
  credits: number;
  description?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  fileUrl?: string;
  externalUrl?: string;
  fileType: string;
  fileSize?: string;
  institutionId?: string;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  uploadedById: string;
  approvalStatus: string;
  sourceInfo: string;
  downloadCount: number;
  createdAt: string;
  institution?: Institution;
  department?: Department;
  course?: Course;
  semester?: Semester;
  subject?: Subject;
  uploadedBy?: {
    id: string;
    username: string;
    role: string;
    facultyProfile?: { fullName: string; designation: string };
  };
}

export interface Assignment {
  id: string;
  facultyId: string;
  courseId: string;
  subjectId: string;
  title: string;
  description: string;
  deadline: string;
  totalMarks: number;
  attachmentUrl?: string;
  course?: Course;
  subject?: Subject;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionUrl?: string;
  content?: string;
  submittedAt: string;
  marksObtained?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  student?: {
    username: string;
    studentProfile?: { fullName: string };
  };
}

export interface AdmissionApplication {
  id: string;
  studentId: string;
  institutionId: string;
  courseId: string;
  applicationNumber: string;
  status: string;
  notes?: string;
  isOfficial: boolean;
  submissionDate?: string;
  updatedAt: string;
  institution: Institution;
  course: Course;
}

export interface StudyProfile {
  id: string;
  studentId: string;
  subjects: string;
  course: string;
  semester: string;
  preferredLanguage: string;
  studyGoals: string;
  availableTimes: string;
  learningStyle: 'VISUAL' | 'AUDITORY' | 'READING_WRITING' | 'KINESTHETIC';
  groupPreference: 'ONLINE' | 'OFFLINE' | 'BOTH';
  isDiscoverable: boolean;
}

export interface StudyPartnerMatch {
  id: string;
  studentId: string;
  fullName: string;
  username: string;
  course: string;
  semester: string;
  subjects: string;
  learningStyle: string;
  preferredLanguage: string;
  groupPreference: string;
  availableTimes: string;
  studyGoals: string;
  state?: string;
  institution?: string;
  bio?: string;
  matchScore: number;
  matchReasons: string[];
  isConnected: boolean;
  isPending: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  course: string;
  creatorId: string;
  maxMembers: number;
  isPrivate: boolean;
  meetingLink?: string;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      username: string;
      studentProfile?: { fullName: string };
    };
  }>;
}

export interface AcademicEvent {
  id: string;
  title: string;
  description?: string;
  eventType: 'EXAM' | 'DEADLINE' | 'LECTURE' | 'HOLIDAY' | 'WORKSHOP' | 'STUDY_SESSION';
  startDate: string;
  endDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  subject: string;
  tags?: string;
  likesCount: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    role: string;
    studentProfile?: { fullName: string };
    facultyProfile?: { fullName: string };
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      username: string;
      role: string;
      studentProfile?: { fullName: string };
      facultyProfile?: { fullName: string };
    };
  }>;
}
