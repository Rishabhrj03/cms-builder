import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getWorkspaceByDomain } from '@/lib/db/workspacesRepo';
import { getPageBySlug } from '@/lib/db/pagesRepo';
import BlockRenderer from '@/components/blocks/BlockRenderer';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const domain = hostname.split(':')[0];
  const { slug } = await params;
  const slugPath = slug && slug.length > 0 ? '/' + slug.join('/') : '/';

  const workspace = await getWorkspaceByDomain(domain);
  if (!workspace) return { title: 'Not Found' };

  const page = await getPageBySlug(slugPath, workspace._id?.toString());
  if (!page) return { title: 'Not Found' };

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      images: page.ogImage ? [{ url: page.ogImage }] : [],
    },
  };
}

export default async function SitePage({ params }: Props) {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const domain = hostname.split(':')[0];
  const { slug } = await params;
  const slugPath = slug && slug.length > 0 ? '/' + slug.join('/') : '/';

  const workspace = await getWorkspaceByDomain(domain);
  if (!workspace) notFound();

  const page = await getPageBySlug(slugPath, workspace._id?.toString());
  if (!page) notFound();

  return (
    <main>
      {(page.blocks ?? [])
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
    </main>
  );
}
