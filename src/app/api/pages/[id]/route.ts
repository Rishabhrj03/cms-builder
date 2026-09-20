import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPageById, updatePage, deletePage } from '@/lib/db/pagesRepo';

async function getWorkspaceId() {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.workspaceId as string | undefined;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const page = await getPageById(id, workspaceId);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const updated = await updatePage(id, body, workspaceId);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const deleted = await deletePage(id, workspaceId);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
