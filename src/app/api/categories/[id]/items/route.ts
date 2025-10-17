import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// POST: 카테고리에 새 아이템 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, url, iconUrl } = await request.json();

    if (!name || !url || typeof name !== 'string' || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // 카테고리가 사용자 소유인지 확인
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 현재 카테고리의 아이템 개수 확인하여 order 설정
    const itemCount = await prisma.appItem.count({
      where: {
        categoryId: params.id,
      },
    });

    const item = await prisma.appItem.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        iconUrl: iconUrl?.trim() || null,
        order: itemCount,
        categoryId: params.id,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
