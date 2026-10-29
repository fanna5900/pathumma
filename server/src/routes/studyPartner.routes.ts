import { Router, Request, Response } from 'express';
import prisma from '../db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET my study profile
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await prisma.studyProfile.findUnique({
      where: { studentId: req.user!.id },
    });
    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve study profile.' });
  }
});

// Update or Create my study profile
router.post('/profile', requireAuth, requireRole(['STUDENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      subjects,
      course,
      semester,
      preferredLanguage = 'English',
      studyGoals,
      availableTimes,
      learningStyle = 'VISUAL',
      groupPreference = 'BOTH',
      isDiscoverable = true,
    } = req.body;

    if (!subjects || !course || !semester || !studyGoals) {
      res.status(400).json({ success: false, message: 'Subjects, course, semester, and study goals are required.' });
      return;
    }

    const profile = await prisma.studyProfile.upsert({
      where: { studentId: req.user!.id },
      update: {
        subjects,
        course,
        semester,
        preferredLanguage,
        studyGoals,
        availableTimes: availableTimes || 'Flexible',
        learningStyle,
        groupPreference,
        isDiscoverable: Boolean(isDiscoverable),
      },
      create: {
        studentId: req.user!.id,
        subjects,
        course,
        semester,
        preferredLanguage,
        studyGoals,
        availableTimes: availableTimes || 'Flexible',
        learningStyle,
        groupPreference,
        isDiscoverable: Boolean(isDiscoverable),
      },
    });

    res.json({ success: true, data: profile, message: 'Study profile saved successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to save study profile.' });
  }
});

// Algorithm-driven Study Partner Matching
router.get('/matches', requireAuth, requireRole(['STUDENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myProfile = await prisma.studyProfile.findUnique({
      where: { studentId: req.user!.id },
    });

    if (!myProfile) {
      res.status(200).json({
        success: true,
        data: [],
        message: 'Please complete your study profile first to receive compatible study partner matches.',
      });
      return;
    }

    // Fetch existing connections and pending requests to show appropriate state
    const [existingConnections, sentRequests] = await Promise.all([
      prisma.studyPartnerConnection.findMany({
        where: {
          OR: [{ user1Id: req.user!.id }, { user2Id: req.user!.id }],
        },
      }),
      prisma.studyPartnerRequest.findMany({
        where: { senderId: req.user!.id },
      }),
    ]);

    const connectedUserIds = new Set(
      existingConnections.flatMap((c) => [c.user1Id, c.user2Id]).filter((id) => id !== req.user!.id)
    );
    const sentRequestUserIds = new Set(
      sentRequests.filter((r) => r.status === 'PENDING').map((r) => r.receiverId)
    );

    // Find discoverable peers
    const peers = await prisma.studyProfile.findMany({
      where: {
        isDiscoverable: true,
        studentId: { not: req.user!.id },
      },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            studentProfile: {
              select: {
                fullName: true,
                state: true,
                educationLevel: true,
                preferredCourse: true,
                preferredInstitution: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    const mySubjectsList = myProfile.subjects.toLowerCase().split(',').map((s) => s.trim());

    // Calculate dynamic compatibility score
    const scoredPeers = peers.map((peer) => {
      let score = 30; // base score
      const matchReasons: string[] = [];

      // 1. Shared subjects
      const peerSubjects = peer.subjects.toLowerCase().split(',').map((s) => s.trim());
      const commonSubjects = mySubjectsList.filter((s) => peerSubjects.some((ps) => ps.includes(s) || s.includes(ps)));
      if (commonSubjects.length > 0) {
        score += Math.min(35, commonSubjects.length * 15);
        matchReasons.push(`Shared focus in: ${commonSubjects.join(', ')}`);
      }

      // 2. Course / Semester match
      if (peer.course.toLowerCase() === myProfile.course.toLowerCase()) {
        score += 15;
        matchReasons.push(`Same academic program: ${peer.course}`);
      }
      if (peer.semester.toLowerCase() === myProfile.semester.toLowerCase()) {
        score += 10;
        matchReasons.push(`Matching semester level (${peer.semester})`);
      }

      // 3. Language
      if (peer.preferredLanguage.toLowerCase() === myProfile.preferredLanguage.toLowerCase()) {
        score += 5;
        matchReasons.push(`Common preferred language: ${peer.preferredLanguage}`);
      }

      // 4. Learning style compatibility
      if (peer.learningStyle === myProfile.learningStyle) {
        score += 5;
        matchReasons.push(`Complementary learning style (${peer.learningStyle})`);
      }

      const isConnected = connectedUserIds.has(peer.studentId);
      const isPending = sentRequestUserIds.has(peer.studentId);

      return {
        id: peer.id,
        studentId: peer.studentId,
        fullName: peer.student.studentProfile?.fullName || peer.student.username,
        username: peer.student.username,
        course: peer.course,
        semester: peer.semester,
        subjects: peer.subjects,
        learningStyle: peer.learningStyle,
        preferredLanguage: peer.preferredLanguage,
        groupPreference: peer.groupPreference,
        availableTimes: peer.availableTimes,
        studyGoals: peer.studyGoals,
        state: peer.student.studentProfile?.state,
        institution: peer.student.studentProfile?.preferredInstitution,
        bio: peer.student.studentProfile?.bio,
        matchScore: Math.min(99, score),
        matchReasons,
        isConnected,
        isPending,
      };
    });

    // Sort by match score descending
    scoredPeers.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: scoredPeers });
  } catch (err: any) {
    console.error('Match error:', err);
    res.status(500).json({ success: false, message: 'Failed to compute study partner matches.' });
  }
});

// Send connection request
router.post('/request', requireAuth, requireRole(['STUDENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      res.status(400).json({ success: false, message: 'Receiver ID is required.' });
      return;
    }

    if (receiverId === req.user!.id) {
      res.status(400).json({ success: false, message: 'You cannot send a connection request to yourself.' });
      return;
    }

    const existing = await prisma.studyPartnerRequest.findFirst({
      where: {
        senderId: req.user!.id,
        receiverId,
        status: 'PENDING',
      },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'A pending request has already been sent to this peer.' });
      return;
    }

    const request = await prisma.studyPartnerRequest.create({
      data: {
        senderId: req.user!.id,
        receiverId,
        message: message || 'Hi! I saw your study profile on EDUNEXA and would love to collaborate on our coursework.',
        status: 'PENDING',
      },
    });

    // Notify peer
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Study Partner Request',
        message: `${req.user!.username} sent you a study collaboration request.`,
        type: 'STUDY_PARTNER',
        link: '/student/study-partners',
      },
    });

    res.status(201).json({ success: true, data: request, message: 'Study partner request sent successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to send request.' });
  }
});

// Accept or reject request
router.put('/request/:id', requireAuth, requireRole(['STUDENT']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; // ACCEPT or REJECT

    const request = await prisma.studyPartnerRequest.findUnique({ where: { id } });
    if (!request || request.receiverId !== req.user!.id) {
      res.status(404).json({ success: false, message: 'Partner request not found or unauthorized.' });
      return;
    }

    if (action === 'ACCEPT') {
      await prisma.$transaction([
        prisma.studyPartnerRequest.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        }),
        prisma.studyPartnerConnection.create({
          data: {
            user1Id: request.senderId,
            user2Id: req.user!.id,
          },
        }),
        prisma.notification.create({
          data: {
            userId: request.senderId,
            title: 'Study Request Accepted!',
            message: `${req.user!.username} accepted your study partner request. You can now schedule sessions together.`,
            type: 'STUDY_PARTNER',
            link: '/student/study-partners',
          },
        }),
      ]);

      res.json({ success: true, message: 'Study partner request accepted!' });
      return;
    }

    await prisma.studyPartnerRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    res.json({ success: true, message: 'Request declined.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
});

// GET connections and incoming requests
router.get('/connections', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [connections, incomingRequests] = await Promise.all([
      prisma.studyPartnerConnection.findMany({
        where: {
          OR: [{ user1Id: req.user!.id }, { user2Id: req.user!.id }],
        },
        include: {
          user1: {
            select: {
              id: true,
              username: true,
              studentProfile: true,
              studyProfile: true,
            },
          },
          user2: {
            select: {
              id: true,
              username: true,
              studentProfile: true,
              studyProfile: true,
            },
          },
        },
      }),
      prisma.studyPartnerRequest.findMany({
        where: {
          receiverId: req.user!.id,
          status: 'PENDING',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              studentProfile: true,
              studyProfile: true,
            },
          },
        },
      }),
    ]);

    const formattedConnections = connections.map((c) => {
      const partner = c.user1Id === req.user!.id ? c.user2 : c.user1;
      return {
        connectionId: c.id,
        connectedSince: c.createdAt,
        partner,
      };
    });

    res.json({
      success: true,
      connections: formattedConnections,
      incomingRequests,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch connections.' });
  }
});

// Study Groups
router.get('/groups', async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await prisma.studyGroup.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                studentProfile: { select: { fullName: true } },
              },
            },
          },
        },
        sessions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: groups });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch study groups.' });
  }
});

// Create Study Group
router.post('/groups', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, subject, course, maxMembers = 10, meetingLink } = req.body;

    if (!name || !subject || !course) {
      res.status(400).json({ success: false, message: 'Group name, subject, and course are required.' });
      return;
    }

    const group = await prisma.studyGroup.create({
      data: {
        name,
        description: description || 'Peer academic discussion group',
        subject,
        course,
        creatorId: req.user!.id,
        maxMembers: parseInt(maxMembers),
        meetingLink: meetingLink || `https://meet.jit.si/edunexa-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        members: {
          create: [{ userId: req.user!.id, role: 'ADMIN' }],
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({ success: true, data: group, message: 'Study group created!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create group.' });
  }
});

// Schedule Study Session
router.post('/sessions', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, subject, startTime, endTime, groupId, meetingLink } = req.body;

    if (!title || !subject || !startTime || !endTime) {
      res.status(400).json({ success: false, message: 'Title, subject, and time range are required.' });
      return;
    }

    const session = await prisma.studySession.create({
      data: {
        title,
        description,
        subject,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hostId: req.user!.id,
        groupId: groupId || null,
        meetingLink: meetingLink || 'https://meet.jit.si/edunexa-study-session',
        status: 'SCHEDULED',
      },
    });

    res.status(201).json({ success: true, data: session, message: 'Study session scheduled!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to schedule session.' });
  }
});

export default router;
