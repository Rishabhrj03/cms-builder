import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  name: string;
  email: string;
  passwordHash: string;
  workspaceId: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: Date;
}

export interface Workspace {
  _id?: ObjectId | string;
  name: string;
  ownerId: string;
  domain?: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: Date;
}
