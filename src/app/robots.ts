import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/preview/', '/site/'],
        disallow: ['/dashboard', '/pages/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
