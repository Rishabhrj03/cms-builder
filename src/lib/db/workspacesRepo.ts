import { ObjectId } from 'mongodb';
import clientPromise from '../mongoClient';
import { Workspace } from '@/types/User';

async function getCollection() {
  const client = await clientPromise;
  return client.db('pageforge').collection<Workspace>('workspaces');
}

export async function createWorkspace(data: Omit<Workspace, '_id'>): Promise<string> {
  const col = await getCollection();
  const result = await col.insertOne({ ...data, createdAt: new Date() });
  return result.insertedId.toString();
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const col = await getCollection();
  const ws = await col.findOne({ _id: new ObjectId(id) });
  if (!ws) return null;
  return { ...ws, _id: ws._id?.toString() };
}

export async function getWorkspaceByDomain(domain: string): Promise<Workspace | null> {
  const col = await getCollection();
  let ws = await col.findOne({ domain });
  if (!ws) {
    ws = await col.findOne({ $or: [{ domain: 'localhost' }, { domain: '127.0.0.1' }, {}] });
  }
  if (!ws) return null;
  return { ...ws, _id: ws._id?.toString() };
}

export async function updateWorkspaceDomain(id: string, domain: string): Promise<void> {
  const col = await getCollection();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { domain } });
}
