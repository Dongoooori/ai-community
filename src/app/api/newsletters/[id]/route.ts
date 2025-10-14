import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/newsletters/[id] - 개별 뉴스레터 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const newsletter = await prisma.newsletter.findUnique({
      where: {
        id,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await prisma.newsletter.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter' },
      { status: 500 }
    );
  }
}

