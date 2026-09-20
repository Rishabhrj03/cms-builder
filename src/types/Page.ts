import { ObjectId } from 'mongodb';
import { Block } from './Block';

export type PageStatus = 'draft' | 'published';

export interface Page {
  _id?: ObjectId | string;
  workspaceId: string;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageSummary {
  _id: string;
  workspaceId: string;
  title: string;
  slug: string;
  status: PageStatus;
  blockCount: number;
  updatedAt: Date;
}
