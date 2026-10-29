import { Router, Request, Response } from 'express';
import prisma from '../db';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AIService, AIChatMessage } from '../services/ai.service';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'edunexa_super_secure_jwt_secret_key_2026_academic_portal';

// Helper for optional auth
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
    // ignore invalid token
  }
  return null;
};

// Send message to AI assistant (Supports both authenticated users & guest inquiries)
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, conversationId, roleContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
      return;
    }

    const user = await getOptionalUser(req);
    const effectiveRole = (roleContext || user?.role || 'STUDENT') as any;
    const effectiveUsername = user?.username || 'Student';

    let conversation: any = null;

    if (user && conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: { id: conversationId, userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    if (user && !conversation) {
      // Create new conversation for authenticated user
      conversation = await prisma.aIConversation.create({
        data: {
          userId: user.id,
          title: message.slice(0, 45) + (message.length > 45 ? '...' : ''),
          roleContext: effectiveRole,
        },
        include: { messages: true },
      });
    }

    if (user && conversation) {
      // Save user message to database
      await prisma.aIConversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: message.trim(),
        },
      });
    }

    // Prepare message history
    const history: AIChatMessage[] = (conversation?.messages || []).map((m: any) => ({
      role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: m.content,
    }));
    history.push({ role: 'user', content: message.trim() });

    // Generate AI response
    const aiAnswer = await AIService.generateResponse(history, {
      role: effectiveRole,
      username: effectiveUsername,
    });

    let assistantMessage: any = null;
    if (user && conversation) {
      // Save AI response to database
      assistantMessage = await prisma.aIConversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: aiAnswer,
        },
      });
    }

    res.json({
      success: true,
      conversationId: conversation?.id || null,
      response: aiAnswer,
      messageRecord: assistantMessage,
    });
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    res.status(500).json({ success: false, message: 'Failed to process AI request: ' + err.message });
  }
});

// GET all conversations for current user
router.get('/conversations', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: conversations });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load conversation history.' });
  }
});

export default router;
