import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const MAX_BYTES = 1.5 * 1024 * 1024;
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const REQUIRED_SITE_ASSETS = ['mascot.png', 'mascot-head.png', 'og-image.png'];

function walk(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (!entry.isFile() || !ALLOWED.has(extname(entry.name).toLowerCase())) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

const root = resolve(process.cwd(), 'public/images');
const images = walk(root).sort();

const oversized = images
  .map((file) => ({ file, size: statSync(file).size }))
  .filter(({ size }) => size > MAX_BYTES);

const missingSiteAssets = REQUIRED_SITE_ASSETS.filter(
  (name) => !images.some((file) => file.endsWith(`/site/${name}`))
);

const megabytes = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

if (missingSiteAssets.length > 0) {
  console.warn(
    `[check-images] Missing site assets: ${missingSiteAssets.join(', ')}. The mascot falls back to a drawn ghost until they are supplied.`
  );
}

if (oversized.length > 0) {
  console.error(`[check-images] ${oversized.length} image(s) over the 1.5 MB limit:`);
  for (const { file, size } of oversized) {
    console.error(`[check-images]   ${relative(process.cwd(), file)} — ${megabytes(size)} MB`);
  }
  console.error('[check-images] Resize the photo and save again.');
  process.exit(1);
}

console.log(`[check-images] ${images.length} image(s) checked, all at or under 1.5 MB.`);
