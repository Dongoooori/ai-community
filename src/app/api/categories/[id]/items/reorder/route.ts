import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT: 아이템 순서 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fromIndex, toIndex } = await request.json();

    if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
      return NextResponse.json(
        { error: 'fromIndex and toIndex are required' },
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

    // 현재 아이템들을 order 순으로 가져오기
    const items = await prisma.appItem.findMany({
      where: {
        categoryId: params.id,
      },
      orderBy: {
        order: 'asc',
      },
    });

    if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
      return NextResponse.json(
        { error: 'Invalid index' },
        { status: 400 }
      );
    }

    // 아이템 순서 변경
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // 새로운 order 값으로 업데이트
    const updatePromises = items.map((item, index) =>
      prisma.appItem.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering items:', error);
    return NextResponse.json(
      { error: 'Failed to reorder items' },
      { status: 500 }
    );
  }
}
