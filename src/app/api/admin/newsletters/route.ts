import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletters, users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-utils';
import { desc, count, eq } from 'drizzle-orm';

// GET /api/admin/newsletters - 모든 뉴스레터 목록 (관리자용)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const newslettersData: any[] = await db
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
      .orderBy(desc(newsletters.createdAt))
      .limit(limit)
      .offset(skip);

    const totalResult = await db
      .select({ count: count() })
      .from(newsletters);

    const total = totalResult[0]?.count || 0;
    const newslettersList = newslettersData;

    return NextResponse.json({
      newsletters: newslettersList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching newsletters:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

// POST /api/admin/newsletters - 뉴스레터 생성
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();

    const { title, content, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const [newNewsletter] = await db
      .insert(newsletters)
      .values({
        title,
        content,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: user.id,
      })
      .returning();

    // 작성자 정보도 가져오기
    const authorData = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const newsletter = {
      ...newNewsletter,
      author: authorData[0],
    };

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating newsletter:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to create newsletter' },
      { status: 500 }
    );
  }
}

