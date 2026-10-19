import type { APIRoute } from 'astro';

const sitemapUrl = new URL('/sitemap-index.xml', import.meta.env.SITE).href;

const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
