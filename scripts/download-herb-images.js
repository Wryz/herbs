const fs = require('fs');
const path = require('path');
const https = require('https');

const HERBS_JSON = path.resolve(__dirname, '../src/data/herbs.json');
const OUTPUT_DIR = path.resolve(__dirname, '../src/assets/herbs');
const IMAGE_MAP_FILE = path.resolve(__dirname, '../src/data/herbImages.ts');
const IMAGE_BASE_URL = 'https://www.meandqi.com';

function decodeSrc(src) {
  return src.replace(/&amp;/g, '&');
}

function download(url) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        return reject(new Error(`Too many redirects for ${url}`));
      }
      const mod = currentUrl.startsWith('https') ? https : require('http');
      mod
        .get(currentUrl, res => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return request(res.headers.location, redirectCount + 1);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`));
          }
          const chunks = [];
          res.on('data', c => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        })
        .on('error', reject);
    };
    request(url);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const data = JSON.parse(fs.readFileSync(HERBS_JSON, 'utf-8'));
  const herbs = data.herbs;

  fs.mkdirSync(OUTPUT_DIR, {recursive: true});

  const successfulSlugs = [];
  let downloaded = 0;
  let failed = 0;

  for (const herb of herbs) {
    const src = herb.image?.src;
    if (!src) {
      console.log(`SKIP  ${herb.slug} (no image)`);
      continue;
    }

    const filename = `${herb.slug}.webp`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
      console.log(`EXISTS ${herb.slug}`);
      successfulSlugs.push(herb.slug);
      downloaded++;
      continue;
    }

    const url = `${IMAGE_BASE_URL}${decodeSrc(src)}`;
    try {
      const buf = await download(url);
      fs.writeFileSync(filepath, buf);
      successfulSlugs.push(herb.slug);
      downloaded++;
      console.log(`OK    ${herb.slug} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failed++;
      console.error(`FAIL  ${herb.slug}: ${err.message}`);
    }

    await sleep(100);
  }

  console.log(`\nDone: ${downloaded} downloaded, ${failed} failed\n`);

  // Generate TypeScript image map
  const lines = [
    'const herbImages: Record<string, number> = {',
  ];
  for (const slug of successfulSlugs) {
    lines.push(`  '${slug}': require('../assets/herbs/${slug}.webp'),`);
  }
  lines.push('};');
  lines.push('');
  lines.push('export default herbImages;');
  lines.push('');

  fs.writeFileSync(IMAGE_MAP_FILE, lines.join('\n'));
  console.log(`Generated ${IMAGE_MAP_FILE} with ${successfulSlugs.length} entries`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
