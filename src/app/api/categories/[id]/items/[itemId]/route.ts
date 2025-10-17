import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT: 아이템 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, url, iconUrl } = await request.json();

    // 카테고리가 사용자 소유인지 확인
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (url !== undefined) updateData.url = url.trim();
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl?.trim() || null;

    const item = await prisma.appItem.update({
      where: {
        id: params.itemId,
        categoryId: params.id,
      },
      data: updateData,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE: 아이템 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 카테고리가 사용자 소유인지 확인
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    await prisma.appItem.delete({
      where: {
        id: params.itemId,
        categoryId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
