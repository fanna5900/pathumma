import { Router, Request, Response } from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all community posts
router.get('/posts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, tag, search } = req.query;

    const where: any = {};
    if (subject && typeof subject === 'string' && subject !== 'All') {
      where.subject = subject;
    }
    if (tag && typeof tag === 'string') {
      where.tags = { contains: tag };
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            role: true,
            studentProfile: { select: { fullName: true } },
            facultyProfile: { select: { fullName: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                role: true,
                studentProfile: { select: { fullName: true } },
                facultyProfile: { select: { fullName: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: posts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve community discussions.' });
  }
});

// Create community discussion post
router.post('/posts', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, subject = 'General Academics', tags } = req.body;

    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Post title and content are required.' });
      return;
    }

    const post = await prisma.communityPost.create({
      data: {
        authorId: req.user!.id,
        title,
        content,
        subject,
        tags: tags || 'Discussion',
      },
      include: {
        author: {
          select: { id: true, username: true, role: true },
        },
      },
    });

    res.status(201).json({ success: true, data: post, message: 'Post shared with community!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to publish post.' });
  }
});

// Comment on post
router.post('/posts/:id/comment', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
      return;
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId: id,
        authorId: req.user!.id,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            role: true,
            studentProfile: { select: { fullName: true } },
            facultyProfile: { select: { fullName: true } },
          },
        },
      },
    });

    res.status(201).json({ success: true, data: comment, message: 'Comment added!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to post comment.' });
  }
});

// Upvote / Like post
router.post('/posts/:id/like', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.communityPost.update({
      where: { id },
      data: {
        likesCount: { increment: 1 },
      },
    });

    res.json({ success: true, likesCount: post.likesCount });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update upvote.' });
  }
});

export default router;
