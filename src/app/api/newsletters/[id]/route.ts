import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletters, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/newsletters/[id] - 개별 뉴스레터 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      .where(
        and(
          eq(newsletters.id, id),
          eq(newsletters.published, true)
        )
      )
      .limit(1);

    if (newsletterData.length === 0) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    const newsletter = newsletterData[0];

    // 조회수 증가
    await db
      .update(newsletters)
      .set({ views: newsletter.views + 1 })
      .where(eq(newsletters.id, id));

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter' },
      { status: 500 }
    );
  }
}

