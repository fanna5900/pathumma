import prisma from '../db';

export const logAuditEvent = async ({
  actorId,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
}: {
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
};
