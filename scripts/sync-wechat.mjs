import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const SOURCE_DIR = process.env.WECHAT_SOURCE_DIR;
const ATTACHMENTS_DIRS = (process.env.WECHAT_ATTACHMENTS_DIRS || "")
  .split(path.delimiter)
  .map((value) => value.trim())
  .filter(Boolean);
const TARGET_DIR = path.resolve("src/content/posts");
const IMAGE_TARGET_DIR = path.resolve("public/article-images");

const topicMap = new Map([
  ["Codex", "Codex"],
  ["Hermes", "Hermes"],
  ["OpenClaw", "OpenClaw"],
  ["飞牛 NAS", "飞牛 NAS"],
  ["其他内容", "其他内容"]
]);

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function slugFromTitle(title, sourceFile) {
  const ascii = title
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = hash(sourceFile);
  return ascii ? `${ascii}-${suffix}` : `post-${hash(`${title}:${sourceFile}`)}`;
}

function inferSeries(filePath) {
  const relative = path.relative(SOURCE_DIR, filePath);
  const [first] = relative.split(path.sep);
  return topicMap.get(first) || "其他内容";
}

function inferTags(title, series, existingTags) {
  const tags = new Set(Array.isArray(existingTags) ? existingTags : []);
  if (series && series !== "其他内容") tags.add(series);

  for (const keyword of ["Codex", "Hermes", "OpenClaw", "DeepSeek", "GPT", "NAS", "Agent", "Claude", "OpenRouter"]) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) tags.add(keyword);
  }

  return [...tags].slice(0, 6);
}

function descriptionFrom(content) {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[\[[^\]]+]\]/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function dateForSource(sourceFile, parsedData) {
  if (parsedData.date) return parsedData.date;
  if (parsedData.created) return parsedData.created;

  const stats = await fs.stat(sourceFile);
  return formatLocalDate(stats.mtime);
}

function safeImageName(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase() || ".png";
  return `image-${hash(sourcePath)}${ext}`;
}

async function buildAttachmentIndex() {
  const files = [];
  for (const dir of ATTACHMENTS_DIRS) {
    try {
      files.push(...(await walkFiles(dir)));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  const imageFiles = files.filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file));
  const index = new Map();

  for (const file of imageFiles) {
    const name = path.basename(file);
    if (!index.has(name)) index.set(name, file);
  }

  return index;
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function transformObsidianImages(content, attachmentIndex, missingImages) {
  const matches = [...content.matchAll(/!\[\[([^\]]+)]]/g)];
  let output = content;

  for (const match of matches) {
    const rawTarget = match[1].trim();
    const [fileName, altText = ""] = rawTarget.split("|").map((value) => value.trim());
    const sourceImage = attachmentIndex.get(path.basename(fileName));

    if (!sourceImage) {
      missingImages.add(fileName);
      output = output.replace(match[0], `> 图片未找到：${fileName}`);
      continue;
    }

    const targetName = safeImageName(sourceImage);
    const targetPath = path.join(IMAGE_TARGET_DIR, targetName);
    await fs.copyFile(sourceImage, targetPath);
    output = output.replace(match[0], `![${altText || path.basename(fileName, path.extname(fileName))}](/article-images/${targetName})`);
  }

  return output;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function sync() {
  if (!SOURCE_DIR) {
    throw new Error("Set WECHAT_SOURCE_DIR before running sync:wechat.");
  }

  await fs.mkdir(TARGET_DIR, { recursive: true });
  await fs.mkdir(IMAGE_TARGET_DIR, { recursive: true });
  const attachmentIndex = await buildAttachmentIndex();
  const sourceFiles = await walk(SOURCE_DIR);
  let count = 0;
  const missingImages = new Set();

  for (const sourceFile of sourceFiles) {
    const raw = await fs.readFile(sourceFile, "utf8");
    const parsed = matter(raw);
    const content = await transformObsidianImages(parsed.content.trimStart(), attachmentIndex, missingImages);
    const title = parsed.data.title || path.basename(sourceFile, ".md");
    const series = parsed.data.series || inferSeries(sourceFile);
    const date = await dateForSource(sourceFile, parsed.data);
    const slug = parsed.data.slug || slugFromTitle(title, sourceFile);
    const targetFile = path.join(TARGET_DIR, `${slug}.md`);

    const data = {
      title,
      description: parsed.data.description || descriptionFrom(parsed.content),
      date,
      category: parsed.data.category || parsed.data.column || "AI",
      series,
      tags: inferTags(title, series, parsed.data.tags),
      source: parsed.data.source || [],
      wechat: true,
      draft: Boolean(parsed.data.draft)
    };

    const output = matter.stringify(content, data);
    await fs.writeFile(targetFile, output.endsWith("\n") ? output : `${output}\n`);
    count += 1;
  }

  console.log(`Synced ${count} Markdown files to ${TARGET_DIR}`);
  if (missingImages.size > 0) {
    console.warn(`Missing ${missingImages.size} referenced image(s):`);
    for (const image of missingImages) console.warn(`- ${image}`);
  }
}

sync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
