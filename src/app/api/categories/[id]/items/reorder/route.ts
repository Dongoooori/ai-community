import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { categories, appItems } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

// PUT: 아이템 순서 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fromIndex, toIndex } = await request.json();
    const { id } = await params;

    if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
      return NextResponse.json(
        { error: 'fromIndex and toIndex are required' },
        { status: 400 }
      );
    }

    // 카테고리가 사용자 소유인지 확인
    const category = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, (session.user as { id: string }).id)
        )
      )
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 현재 아이템들을 order 순으로 가져오기
    const items = await db
      .select()
      .from(appItems)
      .where(eq(appItems.categoryId, id))
      .orderBy(asc(appItems.order));

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
    const updatePromises = items.map((item: any, index: number) =>
      db
        .update(appItems)
        .set({ order: index })
        .where(eq(appItems.id, item.id))
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
