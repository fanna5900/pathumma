import { Router, Request, Response } from 'express';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';

const router = Router();

// GET all institutions with filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      state,
      city,
      district,
      type,
      affiliation,
      category,
      course,
      level,
      search,
      page = '1',
      limit = '100',
    } = req.query;

    const whereClause: any = {};

    if (state && typeof state === 'string' && state !== 'All') {
      whereClause.state = { contains: state };
    }

    if (city && typeof city === 'string' && city !== 'All') {
      whereClause.city = { contains: city };
    }

    if (district && typeof district === 'string' && district !== 'All') {
      whereClause.OR = [
        { city: { contains: district } },
        { location: { contains: district } },
        { address: { contains: district } },
      ];
    }

    if (type && typeof type === 'string' && type !== 'All') {
      whereClause.institutionType = { contains: type };
    }

    if (affiliation && typeof affiliation === 'string' && affiliation !== 'All') {
      whereClause.affiliation = { contains: affiliation };
    }

    if (category && typeof category === 'string' && category !== 'All') {
      if (category.toUpperCase() === 'SCHOOL') {
        whereClause.institutionType = { contains: 'School' };
      } else if (category.toUpperCase() === 'UNIVERSITY') {
        whereClause.OR = [
          { institutionType: { contains: 'University' } },
          { institutionType: 'NIT' },
          { institutionType: 'IIT' },
        ];
      } else if (category.toUpperCase() === 'COLLEGE') {
        whereClause.AND = [
          { institutionType: { not: { contains: 'School' } } },
          { institutionType: { not: { contains: 'State University' } } },
          { institutionType: { not: { contains: 'Central University' } } },
        ];
      }
    }

    if (course && typeof course === 'string' && course !== 'All') {
      whereClause.courses = {
        some: {
          title: { contains: course },
        },
      };
    }

    if (level && typeof level === 'string' && level !== 'All') {
      whereClause.courses = {
        some: {
          level: { equals: level },
        },
      };
    }

    if (search && typeof search === 'string') {
      const searchOR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { state: { contains: search } },
        { city: { contains: search } },
        { affiliation: { contains: search } },
      ];
      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: searchOR }];
        delete whereClause.OR;
      } else {
        whereClause.OR = searchOR;
      }
    }

    const take = parseInt(limit as string) || 20;
    const skip = (Math.max(1, parseInt(page as string)) - 1) * take;

    const [institutions, total] = await Promise.all([
      prisma.institution.findMany({
        where: whereClause,
        include: {
          courses: {
            include: {
              fees: true,
            },
          },
          departments: true,
          _count: {
            select: {
              courses: true,
              departments: true,
              learningMaterials: true,
            },
          },
        },
        orderBy: [{ rating: 'desc' }, { name: 'asc' }],
        take,
        skip,
      }),
      prisma.institution.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: institutions,
      pagination: {
        total,
        page: parseInt(page as string) || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err: any) {
    console.error('Fetch institutions error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve institution directory.' });
  }
});

// GET single institution by ID or slug
router.get('/:idOrSlug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;

    const institution = await prisma.institution.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        campuses: true,
        departments: {
          include: {
            courses: {
              include: {
                fees: true,
                semesters: {
                  include: {
                    subjects: true,
                  },
                },
              },
            },
          },
        },
        courses: {
          include: {
            fees: true,
            department: true,
          },
        },
        learningMaterials: {
          where: { approvalStatus: 'APPROVED' },
          take: 10,
        },
      },
    });

    if (!institution) {
      res.status(404).json({ success: false, message: 'Institution record not found.' });
      return;
    }

    res.json({ success: true, data: institution });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error loading institution profile.' });
  }
});

// GET student saved institutions
router.get('/user/saved', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saved = await prisma.savedInstitution.findMany({
      where: { studentId: req.user!.id },
      include: {
        institution: {
          include: {
            courses: {
              include: { fees: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: saved.map((s) => s.institution) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch saved institutions.' });
  }
});

// Bookmark / Save institution
router.post('/:id/save', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.savedInstitution.findUnique({
      where: {
        studentId_institutionId: {
          studentId: req.user!.id,
          institutionId: id,
        },
      },
    });

    if (existing) {
      // Toggle off / delete
      await prisma.savedInstitution.delete({
        where: { id: existing.id },
      });
      res.json({ success: true, saved: false, message: 'Institution removed from saved list.' });
      return;
    }

    await prisma.savedInstitution.create({
      data: {
        studentId: req.user!.id,
        institutionId: id,
      },
    });

    res.json({ success: true, saved: true, message: 'Institution saved to your bookmarks!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update saved institution status.' });
  }
});

// Admin / University create institution
router.post('/', requireAuth, requireRole(['ADMIN', 'UNIVERSITY']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      location,
      address,
      city,
      state,
      country = 'India',
      institutionType,
      affiliation,
      officialWebsite,
      contactEmail,
      contactPhone,
      facilities = 'Library, Labs, Sports, Hostels',
      scholarships,
      nirfRank,
      establishedYear,
      officialSource,
    } = req.body;

    if (!name || !city || !state || !officialWebsite || !contactEmail) {
      res.status(400).json({ success: false, message: 'Institution name, city, state, website, and email are required.' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const institution = await prisma.institution.create({
      data: {
        name,
        slug,
        location: location || `${city}, ${state}`,
        address: address || `${city}, ${state}`,
        city,
        state,
        country,
        institutionType: institutionType || 'State University',
        affiliation,
        officialWebsite,
        contactEmail,
        contactPhone: contactPhone || '+91 000 0000000',
        facilities,
        scholarships,
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        nirfRank: nirfRank ? parseInt(nirfRank) : null,
        verificationStatus: req.user!.role === 'ADMIN' ? 'VERIFIED' : 'PENDING',
        officialSource: officialSource || 'Official Institutional Submission',
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: 'INSTITUTION_CREATED',
      targetType: 'INSTITUTION',
      targetId: institution.id,
      details: `Institution added: ${name}`,
    });

    res.status(201).json({ success: true, data: institution, message: 'Institution record registered successfully.' });
  } catch (err: any) {
    console.error('Create institution error:', err);
    res.status(500).json({ success: false, message: 'Failed to create institution record.' });
  }
});

// Update institution
router.put('/:id', requireAuth, requireRole(['ADMIN', 'UNIVERSITY']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await prisma.institution.update({
      where: { id },
      data: {
        ...updateData,
        lastVerificationDate: new Date(),
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      action: 'INSTITUTION_UPDATED',
      targetType: 'INSTITUTION',
      targetId: id,
      details: `Institution updated: ${updated.name}`,
    });

    res.json({ success: true, data: updated, message: 'Institution details updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update institution.' });
  }
});

export default router;
