import { Router, Request, Response } from 'express';
import prisma from '../db';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'edunexa_super_secure_jwt_secret_key_2026_academic_portal';

// Helper to extract optional auth user
const getOptionalUser = async (req: Request) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      return user;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

// GET my admission applications (Student) or received applications (University/Admin)
router.get('/my-applications', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    if (userRole === 'STUDENT') {
      const applications = await prisma.admissionApplication.findMany({
        where: { studentId: req.user!.id },
        include: {
          institution: true,
          course: {
            include: { fees: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      res.json({ success: true, data: applications });
      return;
    }

    if (userRole === 'UNIVERSITY' || userRole === 'ADMIN') {
      const applications = await prisma.admissionApplication.findMany({
        include: {
          student: {
            include: {
              studentProfile: true,
            },
          },
          institution: true,
          course: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: applications });
      return;
    }

    res.json({ success: true, data: [] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admission applications.' });
  }
});

// PUBLIC Application Tracking by Reference Number
router.get('/track/:referenceNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceNumber } = req.params;
    const application = await prisma.admissionApplication.findUnique({
      where: { applicationNumber: referenceNumber.trim().toUpperCase() },
      include: {
        institution: true,
        course: true,
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'No admission application found with this reference number.' });
      return;
    }

    res.json({
      success: true,
      data: {
        applicationNumber: application.applicationNumber,
        applicantName: application.applicantName,
        status: application.status,
        submissionDate: application.submissionDate || application.createdAt,
        institutionName: application.institution?.name,
        courseTitle: application.course?.title,
        academicYear: application.academicYear,
        admissionType: application.admissionType,
        notes: application.notes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to track application.' });
  }
});

// SUBMIT Full 7-Step Multi-Step Admission Application
router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      // Step 1: Personal
      fullName,
      dob,
      gender,
      nationality = 'Indian',
      // Step 2: Contact
      email,
      phone,
      address,
      place,
      district,
      state,
      pincode,
      // Step 3: Parents
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      guardianName,
      guardianPhone,
      // Step 4: Academic
      sslcSchool,
      sslcBoard,
      sslcYear,
      sslcPercentage,
      plusTwoSchool,
      plusTwoBoard,
      plusTwoStream,
      plusTwoYear,
      plusTwoPercentage,
      previousQualification,
      // Step 5: Preferences
      institutionId,
      courseId,
      academicYear = '2026-2027',
      admissionType = 'Merit',
      additionalPreference,
      // Step 6: Documents
      documents,
      // Step 7: Review & Declaration
      declarationAgreed,
      notes,
    } = req.body;

    // Validation
    const trimmedName = (fullName || '').trim();
    if (!trimmedName || !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmedName)) {
      res.status(400).json({ success: false, message: 'Please enter a valid full name using letters only.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    // Contact Number 10 digit validation
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      res.status(400).json({ success: false, message: 'Contact number must contain exactly 10 digits.' });
      return;
    }

    if (!declarationAgreed) {
      res.status(400).json({ success: false, message: 'You must accept the truthfulness declaration before submitting.' });
      return;
    }

    // PIN code 6 digit validation if provided
    if (pincode && pincode.trim().length > 0) {
      const cleanPin = pincode.replace(/\D/g, '');
      if (cleanPin.length !== 6) {
        res.status(400).json({ success: false, message: 'Postal PIN code must contain exactly 6 digits.' });
        return;
      }
    }

    // Find or pick institution and course
    let targetInstitutionId = institutionId;
    let targetCourseId = courseId;

    if (!targetInstitutionId) {
      const firstInst = await prisma.institution.findFirst();
      if (!firstInst) {
        res.status(400).json({ success: false, message: 'No institutions available in platform.' });
        return;
      }
      targetInstitutionId = firstInst.id;
    }

    if (!targetCourseId) {
      const firstCourse = await prisma.course.findFirst({ where: { institutionId: targetInstitutionId } })
        || await prisma.course.findFirst();
      if (!firstCourse) {
        res.status(400).json({ success: false, message: 'No courses available for selected institution.' });
        return;
      }
      targetCourseId = firstCourse.id;
    }

    // Determine student user ID
    let studentId: string;
    const optionalUser = await getOptionalUser(req);

    if (optionalUser) {
      studentId = optionalUser.id;
    } else {
      // Find existing student by email or use default student
      const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        studentId = existingUser.id;
      } else {
        const studentUser = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
        if (studentUser) {
          studentId = studentUser.id;
        } else {
          // Fallback to any user
          const anyUser = await prisma.user.findFirst();
          studentId = anyUser!.id;
        }
      }
    }

    // Unique reference number: NEXORA-2026-XXXXXX
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const applicationNumber = `NEXORA-2026-${randomSixDigits}`;

    const application = await prisma.admissionApplication.create({
      data: {
        studentId,
        institutionId: targetInstitutionId,
        courseId: targetCourseId,
        applicationNumber,
        status: 'SUBMITTED',
        isOfficial: true,
        submissionDate: new Date(),
        applicantName: fullName.trim(),
        dob: dob || null,
        gender: gender || 'Not Specified',
        nationality: nationality || 'Indian',
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        address: address?.trim() || null,
        place: place?.trim() || null,
        district: district?.trim() || null,
        state: state?.trim() || 'Kerala',
        pincode: pincode?.trim() || null,
        fatherName: fatherName?.trim() || null,
        fatherPhone: fatherPhone?.trim() || null,
        motherName: motherName?.trim() || null,
        motherPhone: motherPhone?.trim() || null,
        guardianName: guardianName?.trim() || null,
        guardianPhone: guardianPhone?.trim() || null,
        sslcSchool: sslcSchool?.trim() || null,
        sslcBoard: sslcBoard?.trim() || null,
        sslcYear: sslcYear?.trim() || null,
        sslcPercentage: sslcPercentage?.trim() || null,
        plusTwoSchool: plusTwoSchool?.trim() || null,
        plusTwoBoard: plusTwoBoard?.trim() || null,
        plusTwoStream: plusTwoStream?.trim() || null,
        plusTwoYear: plusTwoYear?.trim() || null,
        plusTwoPercentage: plusTwoPercentage?.trim() || null,
        previousQualification: previousQualification?.trim() || null,
        academicYear,
        admissionType,
        additionalPreference: additionalPreference?.trim() || null,
        documents: documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null,
        declarationAgreed: Boolean(declarationAgreed),
        notes: notes?.trim() || 'Direct Online Application via NEXORA Portal',
      },
      include: {
        institution: true,
        course: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully to NEXORA registry.',
      data: {
        applicationId: application.id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        applicantName: application.applicantName,
        institutionName: application.institution?.name,
        courseTitle: application.course?.title,
        submissionDate: application.submissionDate,
      },
    });
  } catch (err: any) {
    console.error('Admission submit error:', err);
    res.status(500).json({ success: false, message: 'Failed to record admission application. Please try again.' });
  }
});

// Create quick admission tracker entry / bookmark
router.post('/apply', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { institutionId, courseId, status = 'INTERESTED', notes, isOfficial = false } = req.body;

    if (!institutionId || !courseId) {
      res.status(400).json({ success: false, message: 'Institution and Course are required.' });
      return;
    }

    const applicationNumber = `NEXORA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const application = await prisma.admissionApplication.create({
      data: {
        studentId: req.user!.id,
        institutionId,
        courseId,
        applicationNumber,
        status,
        notes,
        isOfficial: Boolean(isOfficial),
        submissionDate: status === 'SUBMITTED' ? new Date() : null,
      },
      include: {
        institution: true,
        course: true,
      },
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Admission tracking entry added successfully!',
    });
  } catch (err: any) {
    console.error('Admission apply error:', err);
    res.status(500).json({ success: false, message: 'Failed to record admission tracker item.' });
  }
});

// Update admission application status (Admin or Student note)
router.put('/:id/status', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await prisma.admissionApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Application record not found.' });
      return;
    }

    // Check permissions
    if (req.user!.role === 'STUDENT' && existing.studentId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this application.' });
      return;
    }

    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : existing.notes,
        submissionDate: status === 'SUBMITTED' && !existing.submissionDate ? new Date() : existing.submissionDate,
      },
      include: {
        institution: true,
        course: true,
      },
    });

    res.json({ success: true, data: updated, message: 'Application status updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
});

export default router;
