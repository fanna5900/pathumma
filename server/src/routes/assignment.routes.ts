import { Router, Response } from 'express';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET assignments (Role-aware: faculty gets created assignments, student gets course assignments)
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, id } = req.user!;

    if (role === 'FACULTY') {
      const assignments = await prisma.assignment.findMany({
        where: { facultyId: id },
        include: {
          course: true,
          subject: true,
          submissions: {
            include: {
              student: {
                include: { studentProfile: true },
              },
            },
          },
        },
        orderBy: { deadline: 'asc' },
      });
      res.json({ success: true, data: assignments });
      return;
    }

    // Student or other roles: fetch assignments
    const assignments = await prisma.assignment.findMany({
      include: {
        course: true,
        subject: true,
        faculty: {
          include: { facultyProfile: true },
        },
        submissions: {
          where: { studentId: id },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    res.json({ success: true, data: assignments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve assignments.' });
  }
});

// Create assignment (Faculty only)
router.post('/', requireAuth, requireRole(['FACULTY']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, subjectId, title, description, deadline, totalMarks = 100, attachmentUrl } = req.body;

    if (!courseId || !subjectId || !title || !description || !deadline) {
      res.status(400).json({ success: false, message: 'Missing required assignment fields.' });
      return;
    }

    const assignment = await prisma.assignment.create({
      data: {
        facultyId: req.user!.id,
        courseId,
        subjectId,
        title,
        description,
        deadline: new Date(deadline),
        totalMarks: parseInt(totalMarks),
        attachmentUrl,
      },
      include: {
        course: true,
        subject: true,
      },
    });

    res.status(201).json({ success: true, data: assignment, message: 'Assignment created successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create assignment.' });
  }
});

// Student submit assignment
router.post('/:id/submit', requireAuth, requireRole(['STUDENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // assignmentId
    const { content, submissionUrl } = req.body;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }

    const isLate = new Date() > new Date(assignment.deadline);

    // Upsert submission
    const existing = await prisma.assignmentSubmission.findFirst({
      where: { assignmentId: id, studentId: req.user!.id },
    });

    if (existing) {
      const updated = await prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          content,
          submissionUrl,
          submittedAt: new Date(),
          status: isLate ? 'LATE' : 'SUBMITTED',
        },
      });
      res.json({ success: true, data: updated, message: 'Submission updated successfully!' });
      return;
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId: id,
        studentId: req.user!.id,
        content,
        submissionUrl: submissionUrl || '/uploads/submissions/student_submission.pdf',
        status: isLate ? 'LATE' : 'SUBMITTED',
      },
    });

    res.status(201).json({ success: true, data: submission, message: 'Assignment submitted successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit assignment.' });
  }
});

// Grade submission (Faculty only)
router.put('/submissions/:subId/grade', requireAuth, requireRole(['FACULTY']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subId } = req.params;
    const { marksObtained, feedback } = req.body;

    const updated = await prisma.assignmentSubmission.update({
      where: { id: subId },
      data: {
        marksObtained: parseInt(marksObtained),
        feedback,
        status: 'GRADED',
      },
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: updated.studentId,
        title: 'Assignment Graded',
        message: `Your assignment submission was evaluated: ${marksObtained} marks. Feedback: ${feedback || 'Good work.'}`,
        type: 'ASSIGNMENT',
        link: '/student/assignments',
      },
    });

    res.json({ success: true, data: updated, message: 'Submission graded successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update grade.' });
  }
});

export default router;
