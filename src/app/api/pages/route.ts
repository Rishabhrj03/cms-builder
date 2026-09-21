import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPage, getPages, getStats } from '@/lib/db/pagesRepo';

import { getWorkspaceByDomain } from '@/lib/db/workspacesRepo';

async function getWorkspaceId() {
  const session = await auth();
  const sessionWsId = (session?.user as any)?.workspaceId as string | undefined;
  if (sessionWsId) return sessionWsId;

  const defaultWs = await getWorkspaceByDomain('localhost');
  return defaultWs?._id?.toString();
}

export async function GET() {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized: No workspace found' }, { status: 401 });

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
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized: No workspace found' }, { status: 401 });

    const body = await req.json();
    const { title, slug, status = 'draft', blocks = [] } = body;

    if (!title) {
      return NextResponse.json({ error: 'Page title is required' }, { status: 400 });
    }

    const rawSlug = slug && slug.trim() ? slug.trim() : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const formattedSlug = rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`;

    const id = await createPage({
      workspaceId,
      title,
      slug: formattedSlug,
      status,
      blocks,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error('Error creating page:', err);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
