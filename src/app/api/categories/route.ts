import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { categories, appItems } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET: 사용자의 모든 카테고리 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, (session.user as { id: string }).id))
      .orderBy(asc(categories.order));

    // 각 카테고리의 아이템들도 가져오기
    const categoriesWithItems = await Promise.all(
      userCategories.map(async (category) => {
        const items = await db
          .select()
          .from(appItems)
          .where(eq(appItems.categoryId, category.id))
          .orderBy(asc(appItems.order));
        
        return {
          ...category,
          items,
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithItems });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // 현재 사용자의 카테고리 개수 확인하여 order 설정
    const existingCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, (session.user as { id: string }).id));
    
    const categoryCount = existingCategories.length;

    const [newCategory] = await db
      .insert(categories)
      .values({
        title: title.trim(),
        order: categoryCount,
        userId: (session.user as { id: string }).id,
      })
      .returning();

    const category = {
      ...newCategory,
      items: [],
    };

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
