import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletters, users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

// PATCH /api/admin/newsletters/[id]/publish - 발행/비발행 토글
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const newsletterData = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.id, id))
      .limit(1);

    if (newsletterData.length === 0) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    const newsletter = newsletterData[0];

    const [updatedNewsletter] = await db
      .update(newsletters)
      .set({
        published: !newsletter.published,
        publishedAt: !newsletter.published ? new Date() : null,
      })
      .where(eq(newsletters.id, id))
      .returning();

    // 작성자 정보도 가져오기
    const authorData = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, updatedNewsletter.authorId))
      .limit(1);

    const result = {
      ...updatedNewsletter,
      author: authorData[0],
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error toggling publish status:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to toggle publish status' },
      { status: 500 }
    );
  }
}

