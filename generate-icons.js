const sharp = require("sharp");
const fs = require("fs");

async function generateIcons() {
  const sizes = [48, 128];
  const svgBuffer = fs.readFileSync("icon.svg");

  for (const size of sizes) {
    await sharp(svgBuffer).resize(size, size).toFile(`icon${size}.png`);
    console.log(`Generated icon${size}.png`);
  }
}

generateIcons().catch(console.error);
