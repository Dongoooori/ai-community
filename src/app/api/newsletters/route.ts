import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletters, users } from '@/lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';

// GET /api/newsletters - 발행된 뉴스레터 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
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
      .where(eq(newsletters.published, true))
      .orderBy(desc(newsletters.publishedAt))
      .limit(limit)
      .offset(skip);

    const totalResult = await db
      .select({ count: count() })
      .from(newsletters)
      .where(eq(newsletters.published, true));

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
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

