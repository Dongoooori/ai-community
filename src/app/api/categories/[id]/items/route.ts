import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { categories, appItems } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

// POST: 카테고리에 새 아이템 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, url, iconUrl } = await request.json();
    const { id } = await params;

    if (!name || !url || typeof name !== 'string' || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Name and URL are required' },
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

    // 현재 카테고리의 아이템 개수 확인하여 order 설정
    const itemCountResult = await db
      .select({ count: count() })
      .from(appItems)
      .where(eq(appItems.categoryId, id));

    const itemCount = itemCountResult[0]?.count || 0;

    const [newItem] = await db
      .insert(appItems)
      .values({
        name: name.trim(),
        url: url.trim(),
        iconUrl: iconUrl?.trim() || null,
        order: itemCount,
        categoryId: id,
      })
      .returning();

    const item = newItem;

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
