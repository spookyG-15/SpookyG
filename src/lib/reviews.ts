import { getCollection, type CollectionEntry } from 'astro:content';
import { daysSince } from './format';
import { AFFILIATE_OLD_AFTER_DAYS, SELLER_STALE_AFTER_DAYS } from './affiliate';

export const VERDICT_LABEL_TEXT: Record<VerdictLabel, string> = {
  'worth-it': 'Worth it',
  mixed: 'Mixed',
  'skip-it': 'Skip it',
};

export const BASIS_LABEL_TEXT: Record<ReviewBasis, string> = {
  'hands-on': 'Hands-on tested',
  research: 'Research-based',
};

export const SELLER_STATUS_TEXT: Record<SellerStatus, string> = {
  'looks-ok': 'Looks ok',
  caution: 'Caution',
  'not-checked': 'Not checked',
};

export function categoryKey(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export type Review = CollectionEntry<'reviews'>;
export type ReviewData = Review['data'];
export type VerdictLabel = ReviewData['verdictLabel'];
export type SellerStatus = ReviewData['sellerStatus'];
export type ReviewBasis = ReviewData['reviewedFrom'];

const warned = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[spooky-g] ${message}`);
}

function entryLabel(entry: Review): string {
  return entry.filePath ?? `${entry.id}.md`;
}

function validateEntry(entry: Review): void {
  const label = entryLabel(entry);
  const { slug } = entry.data;

  if (slug !== entry.id) {
    throw new Error(
      `${label}: slug "${slug}" does not match the file name "${entry.id}.md". The file name must equal the slug so the URL stays correct.`
    );
  }

  const body = (entry.body ?? '').trim();
  if (body.length < 100) {
    throw new Error(`${label}: the review body is ${body.length} characters and needs at least 100.`);
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const entries = await getCollection('reviews');
  entries.forEach(validateEntry);
  return entries.sort(
    (a, b) =>
      b.data.reviewedAt.localeCompare(a.data.reviewedAt) || a.data.title.localeCompare(b.data.title)
  );
}

export async function getPublishedReviews(): Promise<Review[]> {
  const entries = (await getAllReviews()).filter((entry) => entry.data.draft === false);
  entries.forEach(warnIfStale);
  return entries;
}

function warnIfStale(entry: Review): void {
  const { slug, affiliateAddedAt, sellerCheckedAt } = entry.data;

  if (affiliateAddedAt !== undefined && daysSince(affiliateAddedAt) > AFFILIATE_OLD_AFTER_DAYS) {
    warnOnce(
      `affiliate:${slug}`,
      `${entryLabel(entry)}: the affiliate link was added ${daysSince(affiliateAddedAt)} days ago. Refresh it.`
    );
  }

  if (daysSince(sellerCheckedAt) > SELLER_STALE_AFTER_DAYS) {
    warnOnce(
      `seller:${slug}`,
      `${entryLabel(entry)}: the seller check is ${daysSince(sellerCheckedAt)} days old. Re-check the store.`
    );
  }
}
