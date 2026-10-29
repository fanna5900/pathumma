import { Router, Response } from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET academic events
router.get('/events', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await prisma.academicEvent.findMany({
      where: {
        OR: [
          { userId: req.user!.id },
          { userId: null }, // Global/institutional events
        ],
      },
      orderBy: { startDate: 'asc' },
    });

    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events.' });
  }
});

// Create academic event
router.post('/events', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, eventType = 'STUDY_SESSION', startDate, endDate } = req.body;

    if (!title || !startDate) {
      res.status(400).json({ success: false, message: 'Title and Start Date are required.' });
      return;
    }

    const event = await prisma.academicEvent.create({
      data: {
        title,
        description,
        eventType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: event, message: 'Event added to calendar!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create calendar event.' });
  }
});

// Delete academic event
router.delete('/events/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.academicEvent.deleteMany({
      where: { id, userId: req.user!.id },
    });

    res.json({ success: true, message: 'Event removed from calendar.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
});

export default router;
