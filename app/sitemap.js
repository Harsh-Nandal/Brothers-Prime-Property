import { site } from '@/lib/site';
import { projects } from '@/lib/projects';
export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const base = site.url.replace(/\/$/, '');
  const pages = ['', '/about', '/projects', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));
  const details = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  return [...pages, ...details];
}
