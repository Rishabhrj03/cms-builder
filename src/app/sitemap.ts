import { MetadataRoute } from 'next';
import { getAllPublishedPages } from '@/lib/db/pagesRepo';

export const revalidate = 3600; // Refresh sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  try {
    const pages = await getAllPublishedPages();

    const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/preview${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly',
      priority: page.slug === '/home' ? 1 : 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...pageEntries,
    ];
  } catch {
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
