import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletters, users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

// GET /api/admin/newsletters/[id] - 개별 뉴스레터 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const newsletterData = await db
      .select({
        id: newsletters.id,
        title: newsletters.title,
        content: newsletters.content,
        thumbnail: newsletters.thumbnail,
        authorId: newsletters.authorId,
        published: newsletters.published,
        views: newsletters.views,
        createdAt: newsletters.createdAt,
        updatedAt: newsletters.updatedAt,
        publishedAt: newsletters.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(newsletters)
      .leftJoin(users, eq(newsletters.authorId, users.id))
      .where(eq(newsletters.id, id))
      .limit(1);

    if (newsletterData.length === 0) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    const newsletter = newsletterData[0];

    return NextResponse.json(newsletter);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching newsletter:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch newsletter' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/newsletters/[id] - 뉴스레터 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const { title, content, published } = body;

    // 기존 뉴스레터 확인
    const existingNewsletterData = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.id, id))
      .limit(1);

    if (existingNewsletterData.length === 0) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    const existingNewsletter = existingNewsletterData[0];

    // 발행 상태가 변경되면 publishedAt 업데이트
    const publishedAt =
      published && !existingNewsletter.published
        ? new Date()
        : existingNewsletter.publishedAt;

    const [updatedNewsletter] = await db
      .update(newsletters)
      .set({
        title,
        content,
        published,
        publishedAt,
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

    const newsletter = {
      ...updatedNewsletter,
      author: authorData[0],
    };

    return NextResponse.json(newsletter);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating newsletter:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to update newsletter' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/newsletters/[id] - 뉴스레터 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await db
      .delete(newsletters)
      .where(eq(newsletters.id, id));

    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error deleting newsletter:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to delete newsletter' },
      { status: 500 }
    );
  }
}

