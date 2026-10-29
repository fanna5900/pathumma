import { Router, Response } from 'express';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';

const router = Router();

// Enforce admin role on all admin routes
router.use(requireAuth, requireRole(['ADMIN']));

// GET real database metrics and analytics
router.get('/metrics', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalUniversities,
      totalInstitutions,
      totalSchools,
      totalColleges,
      totalCourses,
      totalResources,
      pendingInstitutions,
      pendingResources,
      totalApplications,
      totalAuditLogs,
      recentAuditLogs,
      roleDistribution,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.user.count({ where: { role: 'UNIVERSITY' } }),
      prisma.institution.count(),
      prisma.institution.count({ where: { institutionType: { contains: 'School' } } }),
      prisma.institution.count({
        where: {
          AND: [
            { institutionType: { not: { contains: 'School' } } },
            { institutionType: { not: { contains: 'University' } } },
            { institutionType: { not: 'NIT' } },
            { institutionType: { not: 'IIT' } },
          ],
        },
      }),
      prisma.course.count(),
      prisma.learningMaterial.count(),
      prisma.institution.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.learningMaterial.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.admissionApplication.count(),
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: { id: true, username: true, role: true },
          },
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalUniversities,
        totalInstitutions,
        totalSchools,
        totalColleges,
        totalCourses,
        totalResources,
        pendingInstitutions,
        pendingResources,
        totalApplications,
        totalAuditLogs,
        recentAuditLogs,
        roleDistribution: roleDistribution.map((r) => ({
          role: r.role,
          count: r._count.id,
        })),
        systemHealth: {
          databaseStatus: 'ONLINE',
          aiProviderStatus: process.env.GEMINI_API_KEY ? 'CONFIGURED (GEMINI API)' : 'ACADEMIC KNOWLEDGE ENGINE ACTIVE',
          lastBackupDate: new Date(),
        },
      },
    });
  } catch (err: any) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin metrics.' });
  }
});

// GET users list with filtering
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, status, search, page = '1', limit = '50' } = req.query;

    const where: any = {};
    if (role && typeof role === 'string' && role !== 'All') {
      where.role = role;
    }
    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { email: { contains: search } },
        { username: { contains: search } },
      ];
    }

    const take = parseInt(limit as string) || 50;
    const skip = (Math.max(1, parseInt(page as string)) - 1) * take;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          studentProfile: { select: { fullName: true, state: true, educationLevel: true } },
          facultyProfile: { select: { fullName: true, institutionName: true, designation: true } },
          universityProfile: { select: { institutionName: true, state: true, city: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page as string) || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
});

// Suspend or Restore user account
router.put('/users/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; // ACTIVE or SUSPENDED

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status. Must be ACTIVE or SUSPENDED.' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Protect super admin from self-suspension
    if (targetUser.id === req.user!.id) {
      res.status(400).json({ success: false, message: 'You cannot suspend your own administrative account.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: status === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_RESTORED',
      targetType: 'USER',
      targetId: id,
      details: `User ${targetUser.username} (${targetUser.role}) set to ${status}. Reason: ${reason || 'Administrative action'}`,
    });

    res.json({
      success: true,
      message: `User ${targetUser.username} status updated to ${status}.`,
      user: { id: updated.id, status: updated.status },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
});

// Review Institution Verifications
router.get('/verifications', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        courses: { include: { fees: true } },
      },
    });

    res.json({ success: true, data: institutions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch verifications.' });
  }
});

// Update Institution Verification Status
router.put('/verifications/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, officialSource } = req.body; // VERIFIED or UNVERIFIED or PENDING

    const updated = await prisma.institution.update({
      where: { id },
      data: {
        verificationStatus: status,
        officialSource: officialSource || undefined,
        lastVerificationDate: new Date(),
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: 'INSTITUTION_VERIFICATION_UPDATED',
      targetType: 'INSTITUTION',
      targetId: id,
      details: `Institution ${updated.name} verification status set to: ${status}`,
    });

    res.json({ success: true, data: updated, message: `Institution verification status set to ${status}!` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update institution verification.' });
  }
});

// Audit Logs
router.get('/audit-logs', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        actor: {
          select: { id: true, username: true, role: true, email: true },
        },
      },
    });

    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve audit trail.' });
  }
});

// Platform Settings
router.get('/settings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.platformSetting.findMany();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load settings.' });
  }
});

// Update Platform Setting
router.put('/settings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;

    const setting = await prisma.platformSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: 'PLATFORM_SETTING_UPDATED',
      targetType: 'SETTING',
      targetId: key,
      details: `Setting ${key} modified to: ${value}`,
    });

    res.json({ success: true, data: setting, message: `Setting "${key}" updated.` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update setting.' });
  }
});

export default router;
