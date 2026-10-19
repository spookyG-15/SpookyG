import type { Review } from './reviews';
import { daysSince } from './format';

export const AFFILIATE_OLD_AFTER_DAYS = 90;
export const AFFILIATE_EXPIRES_AFTER_DAYS = 100;
export const SELLER_STALE_AFTER_DAYS = 60;

export type AffiliateState = 'none' | 'hidden' | 'expired' | 'old' | 'active';

export interface Affiliate {
  state: AffiliateState;
  url: string | undefined;
  addedAt: string | undefined;
  ageInDays: number | undefined;
  isOld: boolean;
  isStale: boolean;
}

export function getAffiliate(review: Review): Affiliate {
  const { affiliateUrl, affiliateAddedAt, sellerStatus } = review.data;
  const url = affiliateUrl;
  const addedAt = affiliateAddedAt;
  const ageInDays = addedAt === undefined ? undefined : daysSince(addedAt);

  if (url === undefined) {
    return { state: 'none', url: undefined, addedAt, ageInDays, isOld: false, isStale: false };
  }

  if (sellerStatus === 'not-checked') {
    return { state: 'hidden', url: undefined, addedAt, ageInDays, isOld: false, isStale: false };
  }

  if (ageInDays === undefined || ageInDays > AFFILIATE_EXPIRES_AFTER_DAYS) {
    return { state: 'expired', url: undefined, addedAt, ageInDays, isOld: false, isStale: false };
  }

  if (ageInDays > AFFILIATE_OLD_AFTER_DAYS) {
    return { state: 'old', url, addedAt, ageInDays, isOld: true, isStale: false };
  }

  return { state: 'active', url, addedAt, ageInDays, isOld: false, isStale: false };
}

export function isSellerCheckStale(sellerCheckedAt: string): boolean {
  return daysSince(sellerCheckedAt) > SELLER_STALE_AFTER_DAYS;
}
