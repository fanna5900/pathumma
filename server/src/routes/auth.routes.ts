import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { generateToken, requireAuth, isValidUsername, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';

const router = Router();

// Student Registration
router.post('/register/student', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      age,
      gender,
      phone,
      country = 'India',
      state,
      district,
      educationLevel,
      preferredCourse,
      preferredInstitution,
      admissionStatus = 'LOOKING_FOR_ADMISSION',
    } = req.body;

    if (!fullName || !username || !email || !password) {
      res.status(400).json({ success: false, message: 'Full name, username, email, and password are required.' });
      return;
    }

    // Specification: Full Name must contain letters and spaces only (supports Unicode & Malayalam)
    const trimmedName = fullName.trim();
    if (!trimmedName || !/^[\p{L}\p{M}]+(?:[ .'-][\p{L}\p{M}.]+)*$/u.test(trimmedName)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid full name using letters only.',
      });
      return;
    }

    // Specification: Username must contain English letters only (reject numbers, spaces, special chars)
    if (!isValidUsername(username)) {
      res.status(400).json({
        success: false,
        message: 'Username must contain English letters only. Numbers, spaces, and symbols are not allowed.',
      });
      return;
    }

    // Specification: Valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address, such as name@gmail.com.',
      });
      return;
    }

    // Specification: Exactly 10 digits after normalization
    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        res.status(400).json({
          success: false,
          message: 'Mobile number must contain exactly 10 digits.',
        });
        return;
      }
    }

    // Specification: Password minimum 8, maximum 13 characters
    if (password.length < 8 || password.length > 13) {
      res.status(400).json({
        success: false,
        message: 'Password must be between 8 and 13 characters for this initial requirement.',
      });
      return;
    }

    // Check existing email or username
    const existingEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingEmail) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const existingUsername = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
    if (existingUsername) {
      res.status(409).json({ success: false, message: 'This username is already taken. Please choose another.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            fullName,
            age: age ? parseInt(age) : null,
            gender,
            phone,
            country,
            state,
            district,
            educationLevel,
            preferredCourse,
            preferredInstitution,
            admissionStatus,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'USER_REGISTERED',
      targetType: 'USER',
      targetId: user.id,
      details: `Student registered: ${username}`,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Student account created successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.studentProfile,
      },
    });
  } catch (err: any) {
    console.error('Student registration error:', err);
    res.status(500).json({ success: false, message: 'Failed to create student account: ' + err.message });
  }
});

// Faculty Registration
router.post('/register/faculty', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      institution,
      department,
      designation,
      subjectSpecialization,
      professionalInfo,
      password,
    } = req.body;

    if (!fullName || !email || !password || !institution || !department || !designation) {
      res.status(400).json({ success: false, message: 'Please provide all required faculty details.' });
      return;
    }

    // Auto-generate username from email prefix (English letters only)
    let generatedUsername = email.split('@')[0].replace(/[^A-Za-z]/g, '').toLowerCase();
    if (!generatedUsername || generatedUsername.length < 3) {
      generatedUsername = 'prof' + Math.floor(1000 + Math.random() * 9000);
    }

    // Check email
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: generatedUsername,
        passwordHash,
        role: 'FACULTY',
        status: 'ACTIVE',
        emailVerified: true,
        facultyProfile: {
          create: {
            fullName,
            phone,
            institutionName: institution,
            departmentName: department,
            designation,
            subjectSpecialization: subjectSpecialization || 'General Academic',
            professionalInfo,
            approvalStatus: 'APPROVED',
          },
        },
      },
      include: {
        facultyProfile: true,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'FACULTY_REGISTERED',
      targetType: 'USER',
      targetId: user.id,
      details: `Faculty registered: ${fullName} (${institution})`,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Faculty account registered successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.facultyProfile,
      },
    });
  } catch (err: any) {
    console.error('Faculty registration error:', err);
    res.status(500).json({ success: false, message: 'Failed to create faculty account.' });
  }
});

// University Registration
router.post('/register/university', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      institutionName,
      officialEmail,
      phone,
      address,
      country = 'India',
      state,
      city,
      website,
      institutionType,
      verificationDocs,
      password,
    } = req.body;

    if (!institutionName || !officialEmail || !password || !state || !city || !institutionType) {
      res.status(400).json({ success: false, message: 'Please provide all required university details.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: officialEmail.toLowerCase() } });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this institutional email already exists.' });
      return;
    }

    let generatedUsername = officialEmail.split('@')[0].replace(/[^A-Za-z]/g, '').toLowerCase();
    if (!generatedUsername || generatedUsername.length < 3) {
      generatedUsername = 'univ' + Math.floor(1000 + Math.random() * 9000);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: officialEmail.toLowerCase(),
        username: generatedUsername,
        passwordHash,
        role: 'UNIVERSITY',
        status: 'ACTIVE',
        emailVerified: true,
        universityProfile: {
          create: {
            institutionName,
            officialEmail,
            phone,
            address,
            country,
            state,
            city,
            website,
            institutionType,
            verificationDocs,
            approvalStatus: 'APPROVED',
          },
        },
      },
      include: {
        universityProfile: true,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'UNIVERSITY_REGISTERED',
      targetType: 'USER',
      targetId: user.id,
      details: `University registered: ${institutionName}`,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'University account registered successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.universityProfile,
      },
    });
  } catch (err: any) {
    console.error('University registration error:', err);
    res.status(500).json({ success: false, message: 'Failed to create university account.' });
  }
});

// Login for all roles
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // email or username

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Identifier (email/username) and password are required.' });
      return;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        universityProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email/username and password.' });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator. Please contact support.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your password.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    let profile: any = null;
    if (user.role === 'STUDENT') profile = user.studentProfile;
    else if (user.role === 'FACULTY') profile = user.facultyProfile;
    else if (user.role === 'UNIVERSITY') profile = user.universityProfile;

    res.json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        profile,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login authentication.' });
  }
});

// Get current logged-in user profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        studentProfile: true,
        facultyProfile: true,
        universityProfile: true,
        studyProfile: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let profile: any = null;
    if (user.role === 'STUDENT') profile = user.studentProfile;
    else if (user.role === 'FACULTY') profile = user.facultyProfile;
    else if (user.role === 'UNIVERSITY') profile = user.universityProfile;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        profile,
        studyProfile: user.studyProfile,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
});

export default router;
