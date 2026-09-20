import clientPromise from '../mongoClient';
import { User } from '@/types/User';

async function getCollection() {
  const client = await clientPromise;
  return client.db('pageforge').collection<User>('users');
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const col = await getCollection();
  const user = await col.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  return { ...user, _id: user._id?.toString() };
}

export async function createUser(data: Omit<User, '_id'>): Promise<string> {
  const col = await getCollection();
  // ensure unique email index
  await col.createIndex({ email: 1 }, { unique: true });
  const result = await col.insertOne({ ...data, email: data.email.toLowerCase() });
  return result.insertedId.toString();
}
