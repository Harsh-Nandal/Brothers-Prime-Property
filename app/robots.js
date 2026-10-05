import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${site.url.replace(/\/$/, '')}/sitemap.xml`,
  };
}