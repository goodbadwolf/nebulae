#!/usr/bin/env node

import { mkdir, readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

import config from "../tanaka.config.js";

async function generateIcons() {
  const svgPath = join(config.staticDir, "icons/icon.svg");
  const outputDir = join(config.staticDir, "icons");

  try {
    await mkdir(outputDir, { recursive: true });

    const svgBuffer = await readFile(svgPath);

    for (const size of config.iconSizes) {
      const outputPath = join(outputDir, `icon-${size}.png`);

      await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);

      console.log(`✓ Generated ${outputPath}`);
    }

    console.log("\n✓ All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

generateIcons();
