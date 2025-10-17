import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { categories, appItems } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

// PUT: 카테고리 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();
    const { id } = await params;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        title: title.trim(),
      })
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, (session.user as { id: string }).id)
        )
      )
      .returning();

    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 카테고리의 아이템들도 가져오기
    const items = await db
      .select()
      .from(appItems)
      .where(eq(appItems.categoryId, id))
      .orderBy(asc(appItems.order));

    const category = {
      ...updatedCategory,
      items,
    };

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE: 카테고리 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const deletedCategory = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, (session.user as { id: string }).id)
        )
      )
      .returning();

    if (deletedCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
