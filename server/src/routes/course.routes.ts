import { Router, Request, Response } from 'express';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET courses with search and filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { level, department, search, institutionId } = req.query;

    const where: any = {};
    if (level && typeof level === 'string' && level !== 'All') {
      where.level = level;
    }
    if (institutionId && typeof institutionId === 'string') {
      where.institutionId = institutionId;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { code: { contains: search } },
        { eligibility: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            state: true,
            city: true,
            rating: true,
            institutionType: true,
          },
        },
        department: true,
        fees: true,
      },
      orderBy: { title: 'asc' },
    });

    res.json({ success: true, data: courses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch course directory.' });
  }
});

// GET course by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        institution: true,
        department: true,
        fees: true,
        semesters: {
          include: {
            subjects: true,
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    res.json({ success: true, data: course });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve course.' });
  }
});

// Compare multiple courses
router.get('/action/compare', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query; // e.g. "id1,id2,id3"
    if (!ids || typeof ids !== 'string') {
      res.status(400).json({ success: false, message: 'Course IDs parameter "ids" is required for comparison.' });
      return;
    }

    const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);

    const courses = await prisma.course.findMany({
      where: { id: { in: idList } },
      include: {
        institution: true,
        department: true,
        fees: true,
      },
    });

    res.json({ success: true, data: courses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to compare courses.' });
  }
});

// Add course (University or Admin)
router.post('/', requireAuth, requireRole(['UNIVERSITY', 'ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      institutionId,
      departmentId,
      title,
      code,
      level = 'UNDERGRADUATE',
      durationYears = 4,
      description,
      eligibility,
      totalSeats = 60,
      admissionProcess,
      fees, // { tuitionFee, admissionFee, examFee, labFee, hostelFee, otherFee, totalFee }
    } = req.body;

    if (!institutionId || !departmentId || !title || !code || !description || !eligibility) {
      res.status(400).json({ success: false, message: 'Required course parameters are missing.' });
      return;
    }

    const course = await prisma.course.create({
      data: {
        institutionId,
        departmentId,
        title,
        code,
        level,
        durationYears: parseInt(durationYears),
        description,
        eligibility,
        totalSeats: parseInt(totalSeats),
        admissionProcess: admissionProcess || 'Merit / Entrance counseling',
        verified: true,
        fees: fees
          ? {
              create: {
                academicYear: '2026-2027',
                period: 'ANNUAL',
                tuitionFee: parseFloat(fees.tuitionFee || 0),
                admissionFee: parseFloat(fees.admissionFee || 0),
                examFee: parseFloat(fees.examFee || 0),
                labFee: parseFloat(fees.labFee || 0),
                hostelFee: parseFloat(fees.hostelFee || 0),
                otherFee: parseFloat(fees.otherFee || 0),
                totalFee: parseFloat(fees.totalFee || fees.tuitionFee || 0),
                officialSource: 'Institutional Submission',
              },
            }
          : undefined,
      },
      include: {
        fees: true,
        institution: true,
      },
    });

    res.status(201).json({ success: true, data: course, message: 'Course created successfully!' });
  } catch (err: any) {
    console.error('Create course error:', err);
    res.status(500).json({ success: false, message: 'Failed to create course.' });
  }
});

export default router;
