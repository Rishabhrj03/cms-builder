import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPage, getPages, getStats } from '@/lib/db/pagesRepo';

async function getWorkspaceId() {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.workspaceId as string | undefined;
}

export async function GET() {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [pages, stats] = await Promise.all([getPages(workspaceId), getStats(workspaceId)]);
    return NextResponse.json({ pages, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, slug, status = 'draft', blocks = [] } = body;

    if (!title || !slug)
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });

    const id = await createPage({
      workspaceId,
      title,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      status,
      blocks,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
