import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = process.env.YUNBO_CONTENT_REPO;
const ref = process.env.YUNBO_CONTENT_REF || "main";
const contentDir = path.resolve(process.env.YUNBO_CONTENT_DIR || ".content-private/repo");

const mappings = [
  ["src/content/posts", "src/content/posts/private"],
  ["public/article-images", "public/article-images"]
];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(source, target) {
  if (!(await pathExists(source))) return;
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.cp(source, target, { recursive: true });
}

async function sync() {
  if (!repo) {
    console.log("YUNBO_CONTENT_REPO is empty. Skipping private content sync.");
    return;
  }

  await fs.mkdir(path.dirname(contentDir), { recursive: true });

  if (await pathExists(path.join(contentDir, ".git"))) {
    run("git", ["-C", contentDir, "fetch", "--depth", "1", "origin", ref]);
    run("git", ["-C", contentDir, "checkout", "FETCH_HEAD"]);
  } else {
    await fs.rm(contentDir, { recursive: true, force: true });
    run("git", ["clone", "--depth", "1", "--branch", ref, repo, contentDir]);
  }

  for (const [sourceRelative, targetRelative] of mappings) {
    await copyDirectory(path.join(contentDir, sourceRelative), path.resolve(targetRelative));
  }

  console.log(`Synced private content from ${repo}`);
}

sync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
