import { ObjectId } from 'mongodb';
import clientPromise from '../mongoClient';
import { Page, PageSummary } from '@/types/Page';

async function getCollection() {
  const client = await clientPromise;
  return client.db('pageforge').collection<Page>('pages');
}

export async function getPages(workspaceId: string): Promise<PageSummary[]> {
  const col = await getCollection();
  const pages = await col
    .find({ workspaceId }, { projection: { title: 1, slug: 1, status: 1, blocks: 1, updatedAt: 1, workspaceId: 1 } })
    .sort({ updatedAt: -1 })
    .toArray();

  return pages.map((p) => ({
    _id: p._id!.toString(),
    workspaceId: p.workspaceId,
    title: p.title,
    slug: p.slug,
    status: p.status,
    blockCount: p.blocks?.length ?? 0,
    updatedAt: p.updatedAt,
  }));
}

function buildIdFilter(id: string) {
  if (ObjectId.isValid(id)) {
    return { $in: [new ObjectId(id), id] };
  }
  return id;
}

export async function getPageById(id: string, workspaceId?: string): Promise<Page | null> {
  const col = await getCollection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { _id: buildIdFilter(id) };
  if (workspaceId) filter.workspaceId = workspaceId;

  const page = await col.findOne(filter);
  if (!page) return null;
  return { ...page, _id: page._id.toString() };
}

export async function getPageBySlug(slug: string, workspaceId?: string): Promise<Page | null> {
  const col = await getCollection();
  let page = workspaceId ? await col.findOne({ slug, workspaceId }) : null;
  if (!page) {
    page = await col.findOne({ slug });
  }
  if (!page) return null;
  return { ...page, _id: page._id!.toString() };
}

export async function createPage(data: Omit<Page, '_id'>): Promise<string> {
  const col = await getCollection();
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updatePage(id: string, data: Partial<Page>, workspaceId?: string): Promise<boolean> {
  const col = await getCollection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { _id: buildIdFilter(id) };
  if (workspaceId) filter.workspaceId = workspaceId;

  const result = await col.updateOne(filter, { $set: { ...data, updatedAt: new Date() } });
  return result.matchedCount > 0;
}

export async function deletePage(id: string, workspaceId?: string): Promise<boolean> {
  const col = await getCollection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { _id: buildIdFilter(id) };
  if (workspaceId) filter.workspaceId = workspaceId;

  const result = await col.deleteOne(filter);
  return result.deletedCount > 0;
}

export async function getStats(workspaceId: string) {
  const col = await getCollection();
  const [total, published, draft] = await Promise.all([
    col.countDocuments({ workspaceId }),
    col.countDocuments({ workspaceId, status: 'published' }),
    col.countDocuments({ workspaceId, status: 'draft' }),
  ]);
  return { total, published, draft };
}

export async function getAllPublishedPages(): Promise<Page[]> {
  const col = await getCollection();
  return col.find({ status: 'published' }).toArray();
}
