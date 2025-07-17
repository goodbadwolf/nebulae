#!/usr/bin/env node

import sharp from 'sharp';
import { readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [16, 32, 48, 128];

async function generateIcons() {
  const svgPath = join(__dirname, '../public/icons/icon.svg');
  const outputDir = join(__dirname, '../public/icons');

  try {
    await mkdir(outputDir, { recursive: true });

    const svgBuffer = await readFile(svgPath);

    for (const size of sizes) {
      const outputPath = join(outputDir, `icon-${size}.png`);

      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${outputPath}`);
    }

    console.log('\n✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
