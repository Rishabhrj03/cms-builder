import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/db/pagesRepo';
import BlockRenderer from '@/components/blocks/BlockRenderer';

export const revalidate = 60; // ISR: regenerate every 60 seconds

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = '/' + slug.join('/');
  const page = await getPageBySlug(slugPath);

  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || `${page.title} — built with PAGEFORGE`,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      images: page.ogImage ? [{ url: page.ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      images: page.ogImage ? [page.ogImage] : [],
    },
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
  };
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = '/' + slug.join('/');

  const page = await getPageBySlug(slugPath);
  if (!page) notFound();

  return (
    <div className="preview-root">
      {/* Preview Banner — shown in dev only */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
          color: '#fff',
          padding: '8px 20px',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700 }}>⚡ PAGEFORGE</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>Preview: {page.title}</span>
          <span
            style={{
              background: page.status === 'published' ? '#10b981' : '#f59e0b',
              padding: '2px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {page.status.toUpperCase()}
          </span>
        </div>
        <a href="/dashboard" style={{ color: '#fff', fontSize: 12, opacity: 0.8 }}>
          ← Back to Editor
        </a>
      </div>

      {/* Page Content */}
      <main>
        {(page.blocks ?? [])
          .sort((a, b) => a.order - b.order)
          .map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
      </main>
    </div>
  );
}
