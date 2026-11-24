/**
 * Trace the supplied JPG without adding a production dependency.
 * Install potrace@2.1.8 and sharp@0.35.5 into a temporary directory, then run:
 * node scripts/vectorize-logo.cjs <temporary-directory>
 * The original JPG is never modified. Output uses the existing DESIGN palette.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { createRequire } = require("node:module");

async function main() {
  if (!process.argv[2])
    throw new Error("Pass the temporary tool installation directory.");
  const toolRequire = createRequire(
    path.resolve(process.argv[2], "package.json"),
  );
  const sharp = toolRequire("sharp");
  const { trace } = toolRequire("potrace");
  const root = path.resolve(__dirname, "..");
  const { data, info } = await sharp(
    path.join(root, "public/brand/canibookstud-logo.jpg"),
  )
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const palette = [
    [255, 255, 255],
    [0, 43, 88],
    [255, 110, 1],
  ];
  const labels = new Uint8Array(info.width * info.height);
  for (let i = 0; i < labels.length; i++) {
    let nearest = Infinity;
    palette.forEach((color, index) => {
      const distance = color.reduce(
        (sum, value, channel) =>
          sum + (value - data[i * info.channels + channel]) ** 2,
        0,
      );
      if (distance < nearest) {
        nearest = distance;
        labels[i] = index;
      }
    });
  }
  const paths = [];
  for (const [index, fill] of [
    [1, "#002B58"],
    [2, "#FF6E01"],
  ]) {
    const mask = Buffer.alloc(labels.length);
    for (let i = 0; i < labels.length; i++)
      mask[i] = labels[i] === index ? 0 : 255;
    const png = await sharp(mask, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
      .png()
      .toBuffer();
    const traced = await new Promise((resolve, reject) =>
      trace(
        png,
        {
          threshold: 127,
          turdSize: 16,
          optTolerance: 0.2,
          color: fill,
        },
        (error, svg) => (error ? reject(error) : resolve(svg)),
      ),
    );
    paths.push(...traced.match(/<path\b[^>]*\/>/g));
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}">\n  <title>CanibookStud paw mark</title>\n  <desc>Vector trace of the supplied CanibookStud logo; original proportions and existing brand colors.</desc>\n  ${paths.join("\n  ")}\n</svg>\n`;
  const output = path.join(root, "public/brand/canibookstud-logo.svg");
  await fs.writeFile(output, svg);
  console.log(
    `${output}: ${info.width} x ${info.height}, ${Buffer.byteLength(svg)} bytes, ${paths.length} color paths`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
