import { getEntry, type CollectionEntry } from 'astro:content';

export type SiteSettings = CollectionEntry<'site'>['data'];

export async function getSite(): Promise<SiteSettings> {
  const entry = await getEntry('site', 'site');
  if (entry === undefined) {
    throw new Error('Site settings are missing. Expected src/data/site.yml.');
  }
  return entry.data;
}
