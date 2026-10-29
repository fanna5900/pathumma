import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';

const router = Router();

// GET resources with hierarchical filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      university,
      institutionId,
      departmentId,
      courseId,
      semesterId,
      subjectId,
      category,
      search,
    } = req.query;

    const where: any = {
      approvalStatus: 'APPROVED',
    };

    if (university && typeof university === 'string' && university !== 'All') {
      where.institution = {
        affiliation: { contains: university },
      };
    }
    if (institutionId && typeof institutionId === 'string' && institutionId !== 'All') {
      where.institutionId = institutionId;
    }
    if (departmentId && typeof departmentId === 'string' && departmentId !== 'All') {
      where.departmentId = departmentId;
    }
    if (courseId && typeof courseId === 'string' && courseId !== 'All') {
      where.courseId = courseId;
    }
    if (semesterId && typeof semesterId === 'string' && semesterId !== 'All') {
      where.semesterId = semesterId;
    }
    if (subjectId && typeof subjectId === 'string' && subjectId !== 'All') {
      where.subjectId = subjectId;
    }
    if (category && typeof category === 'string' && category !== 'All') {
      where.resourceType = category;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { sourceInfo: { contains: search } },
      ];
    }

    const resources = await prisma.learningMaterial.findMany({
      where,
      include: {
        institution: { select: { id: true, name: true, slug: true } },
        department: { select: { id: true, name: true, code: true } },
        course: { select: { id: true, title: true, code: true } },
        semester: { select: { id: true, semesterNumber: true, title: true } },
        subject: { select: { id: true, title: true, code: true } },
        uploadedBy: {
          select: {
            id: true,
            username: true,
            role: true,
            facultyProfile: { select: { fullName: true, designation: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: resources });
  } catch (err: any) {
    console.error('Fetch resources error:', err);
    res.status(500).json({ success: false, message: 'Failed to load study resources.' });
  }
});

// GET single resource details and increment download count
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await prisma.learningMaterial.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
      include: {
        institution: true,
        department: true,
        course: true,
        semester: true,
        subject: true,
        uploadedBy: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    res.json({ success: true, data: resource });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Resource not found or inaccessible.' });
  }
});

// Download original academic material file
router.get('/:id/download', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await prisma.learningMaterial.findUnique({
      where: { id },
    });

    if (!resource) {
      res.status(404).json({ success: false, message: 'Study resource not found.' });
      return;
    }

    // Increment download count
    await prisma.learningMaterial.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    // Resolve file path
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    let relPath = resource.fileUrl || '/uploads/sample.pdf';
    if (relPath.startsWith('/uploads/')) {
      relPath = relPath.replace('/uploads/', '');
    }
    let filePath = path.join(uploadsDir, relPath);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, 'sample.pdf');
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, message: 'Resource file is currently unavailable.' });
      return;
    }

    const safeTitle = (resource.title || 'study-resource').replace(/[^a-zA-Z0-9_\-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.sendFile(filePath);
  } catch (err: any) {
    console.error('Download error:', err);
    res.status(500).json({ success: false, message: 'Failed to process download.' });
  }
});

// Inline Preview for PDF materials
router.get('/:id/preview', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await prisma.learningMaterial.findUnique({
      where: { id },
    });

    if (!resource) {
      res.status(404).json({ success: false, message: 'Study resource not found.' });
      return;
    }

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    let relPath = resource.fileUrl || '/uploads/sample.pdf';
    if (relPath.startsWith('/uploads/')) {
      relPath = relPath.replace('/uploads/', '');
    }
    let filePath = path.join(uploadsDir, relPath);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, 'sample.pdf');
    }

    const safeTitle = (resource.title || 'study-resource').replace(/[^a-zA-Z0-9_\-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeTitle}.pdf"`);
    res.sendFile(filePath);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to render preview.' });
  }
});

// Upload academic material (Faculty, University, Admin)
router.post('/upload', requireAuth, requireRole(['FACULTY', 'UNIVERSITY', 'ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      resourceType,
      fileUrl,
      externalUrl,
      fileType = 'pdf',
      fileSize = '2.5 MB',
      institutionId,
      departmentId,
      courseId,
      semesterId,
      subjectId,
      sourceInfo,
    } = req.body;

    if (!title || !description || !resourceType) {
      res.status(400).json({ success: false, message: 'Title, description, and resource category are required.' });
      return;
    }

    const material = await prisma.learningMaterial.create({
      data: {
        title,
        description,
        resourceType,
        fileUrl: fileUrl || '/uploads/materials/sample-academic-doc.pdf',
        externalUrl,
        fileType,
        fileSize,
        institutionId: institutionId || null,
        departmentId: departmentId || null,
        courseId: courseId || null,
        semesterId: semesterId || null,
        subjectId: subjectId || null,
        uploadedById: req.user!.id,
        approvalStatus: req.user!.role === 'ADMIN' || req.user!.role === 'FACULTY' ? 'APPROVED' : 'PENDING',
        sourceInfo: sourceInfo || 'Institutional Verified Upload',
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: 'RESOURCE_UPLOADED',
      targetType: 'LEARNING_MATERIAL',
      targetId: material.id,
      details: `Material uploaded: ${title} (${resourceType})`,
    });

    res.status(201).json({
      success: true,
      data: material,
      message: 'Learning resource uploaded successfully!',
    });
  } catch (err: any) {
    console.error('Resource upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload study resource.' });
  }
});

// Bookmark / Unbookmark resource
router.post('/:id/bookmark', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.resourceBookmark.findUnique({
      where: {
        userId_resourceId: {
          userId: req.user!.id,
          resourceId: id,
        },
      },
    });

    if (existing) {
      await prisma.resourceBookmark.delete({ where: { id: existing.id } });
      res.json({ success: true, bookmarked: false, message: 'Bookmark removed.' });
      return;
    }

    await prisma.resourceBookmark.create({
      data: {
        userId: req.user!.id,
        resourceId: id,
      },
    });

    res.json({ success: true, bookmarked: true, message: 'Resource saved to your bookmarks!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update bookmark.' });
  }
});

// GET user bookmarks
router.get('/user/bookmarks', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookmarks = await prisma.resourceBookmark.findMany({
      where: { userId: req.user!.id },
      include: {
        resource: {
          include: {
            institution: true,
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: bookmarks.map((b) => b.resource) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookmarks.' });
  }
});

export default router;
