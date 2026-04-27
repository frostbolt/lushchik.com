import { readdir, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";

const ROOT = "public/img/blog";
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;
const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") return;
		throw err;
	}
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(path);
		else yield path;
	}
}

function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function optimize(file) {
	const ext = extname(file).toLowerCase();
	if (!SUPPORTED.has(ext)) return null;

	const before = (await stat(file)).size;
	const image = sharp(file, { failOn: "truncated" });
	const meta = await image.metadata();

	let pipeline = image.rotate();
	if ((meta.width ?? 0) > MAX_WIDTH) {
		pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
	}

	if (ext === ".png") {
		pipeline = pipeline.png({ compressionLevel: 9, palette: true });
	} else if (ext === ".webp") {
		pipeline = pipeline.webp({ quality: WEBP_QUALITY });
	} else {
		pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
	}

	const buffer = await pipeline.toBuffer();
	if (buffer.length >= before) {
		console.log(`  skip ${file} (${formatBytes(before)}, already optimal)`);
		return { before, after: before, changed: false };
	}

	await writeFile(file, buffer);
	console.log(`  done ${file} (${formatBytes(before)} -> ${formatBytes(buffer.length)})`);
	return { before, after: buffer.length, changed: true };
}

const target = process.argv[2] ?? ROOT;
console.log(`Optimizing images in ${target} (max width ${MAX_WIDTH}px)`);

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for await (const file of walk(target)) {
	const result = await optimize(file);
	if (!result) continue;
	totalBefore += result.before;
	totalAfter += result.after;
	count += 1;
}

if (count === 0) {
	console.log("No images found.");
} else {
	const saved = totalBefore - totalAfter;
	const pct = totalBefore === 0 ? 0 : ((saved / totalBefore) * 100).toFixed(1);
	console.log(
		`\n${count} image${count === 1 ? "" : "s"}: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (saved ${formatBytes(saved)}, ${pct}%)`
	);
}
