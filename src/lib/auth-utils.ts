import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

// NextAuth 옵션 (route.ts에서 가져올 수 없으므로 여기서 정의)
export async function getCurrentUser() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}

