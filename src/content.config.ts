import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = [
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Phone & Gadgets',
  'Fashion & Accessories',
  'Health & Wellness',
] as const;

const REVIEW_BASES = ['hands-on', 'research'] as const;

const VERDICT_LABELS = ['worth-it', 'mixed', 'skip-it'] as const;

const SELLER_STATUSES = ['looks-ok', 'caution', 'not-checked'] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function startOfTodayUtc(): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.getTime();
}

function isRealIsoDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isFuture(value: string): boolean {
  return new Date(`${value}T00:00:00Z`).getTime() > startOfTodayUtc();
}

const isoDate = z
  .string()
  .regex(ISO_DATE, { message: 'must use the yyyy-MM-dd format' })
  .refine(isRealIsoDate, { message: 'is not a real calendar date' })
  .refine((value) => !isFuture(value), { message: 'is in the future' });

const httpsUrl = z
  .string()
  .regex(/^https:\/\/\S+$/, { message: 'must start with https://' });

const imagePath = z
  .string()
  .regex(/^\/images\/.+\.(jpe?g|png|webp)$/i, {
    message: 'must be a JPG, PNG or WebP file under /images/',
  });

export function imageExists(path: string): boolean {
  return existsSync(resolve(process.cwd(), 'public', path.replace(/^\//, '')));
}

const reviewSchema = z
  .object({
    title: z.string().min(3, 'must be at least 3 characters').max(80, 'must be at most 80 characters'),
    slug: z
      .string()
      .min(3, 'must be at least 3 characters')
      .max(80, 'must be at most 80 characters')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'must be lowercase words joined by single hyphens',
      }),
    brand: z.string().min(1).max(40).optional(),
    category: z.enum(CATEGORIES, {
      errorMap: () => ({ message: `must be one of: ${CATEGORIES.join(', ')}` }),
    }),
    reviewedFrom: z.enum(REVIEW_BASES, {
      errorMap: () => ({ message: 'must be hands-on or research' }),
    }),
    verdictLabel: z.enum(VERDICT_LABELS, {
      errorMap: () => ({ message: 'must be worth-it, mixed or skip-it' }),
    }),
    verdict: z.string().min(20, 'must be at least 20 characters').max(280, 'must be at most 280 characters'),
    pros: z.array(z.string().min(3).max(120)).min(1, 'needs at least one item').max(6, 'allows at most 6 items'),
    cons: z.array(z.string().min(3).max(120)).min(1, 'needs at least one item').max(6, 'allows at most 6 items'),
    image: imagePath,
    imageAlt: z.string().min(5, 'alt text must be at least 5 characters').max(160, 'alt text must be at most 160 characters'),
    gallery: z
      .array(
        z.object({
          image: imagePath,
          alt: z.string().min(5, 'alt text must be at least 5 characters').max(160, 'alt text must be at most 160 characters'),
        })
      )
      .max(4, 'allows at most 4 gallery images')
      .optional(),
    specs: z
      .array(
        z.object({
          label: z.string().min(1).max(40),
          value: z.string().min(1).max(80),
        })
      )
      .max(10, 'allows at most 10 specs')
      .optional(),
    reviewedAt: isoDate,
    sellerName: z.string().min(1).max(80),
    sellerUrl: httpsUrl.optional(),
    sellerCheckedAt: isoDate,
    sellerStatus: z.enum(SELLER_STATUSES, {
      errorMap: () => ({ message: 'must be looks-ok, caution or not-checked' }),
    }).default('looks-ok'),
    sellerNotes: z.string().min(10, 'must be at least 10 characters').max(600, 'must be at most 600 characters'),
    affiliateUrl: httpsUrl.optional(),
    affiliateAddedAt: isoDate.optional(),
    tiktokVideoUrl: httpsUrl.optional(),
    draft: z.boolean().default(true),
  })
  .superRefine((review, ctx) => {
    if (review.affiliateUrl !== undefined && review.affiliateAddedAt === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['affiliateAddedAt'],
        message: 'is required when affiliateUrl is set',
      });
    }
    if (!imageExists(review.image)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['image'],
        message: `file not found at public${review.image}`,
      });
    }
    review.gallery?.forEach((item, index) => {
      if (!imageExists(item.image)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gallery', index, 'image'],
          message: `file not found at public${item.image}`,
        });
      }
    });
  });

const siteSchema = z
  .object({
    settings: z.object({
      siteName: z.string().min(1).max(60),
      tagline: z.string().min(1).max(120),
      brandIntro: z.string().min(1).max(400),
      about: z.string().min(100, 'the about text needs at least 100 characters'),
      contactEmail: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: 'must be a valid email address',
      }),
      tiktokProfileUrl: httpsUrl.optional(),
      defaultDisclosure: z.string().min(20).max(400),
      mascotImage: imagePath,
      ogImage: imagePath,
    }),
  })
  .transform(({ settings }) => settings);

export const collections = {
  reviews: defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: './src/content/reviews',
      generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: reviewSchema,
  }),
  site: defineCollection({
    loader: glob({ pattern: 'site.yml', base: './src/data' }),
    schema: siteSchema,
  }),
};
