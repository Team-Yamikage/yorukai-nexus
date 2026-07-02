#!/usr/bin/env node
/**
 * CI guard: fail the build if any "Lovable" branding string leaks into the
 * source tree or the built output. Run via `npm run check:branding`.
 *
 * Scans src/, public/, index.html and the build output dirs (dist/, .output/)
 * when present. Ignores this script itself and node_modules/build caches.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src", "public", "dist", ".output", "index.html"];
const SKIP_DIRS = new Set(["node_modules", ".git", ".vercel", ".cache"]);
const SKIP_FILES = new Set(["check-branding.mjs"]);
const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".html",
  ".css", ".md", ".txt", ".webmanifest", ".xml", ".svg",
]);

// Match "Lovable" as branding; allow build-toolchain package names that are
// unavoidable and never user-facing.
const PATTERN = /lovable/i;
const ALLOW = [
  /lovable-tagger/i,      // dev-only build tagger dependency
  /@lovable/i,            // scoped build tooling packages
];

const hits = [];

function scanFile(path) {
  if (SKIP_FILES.has(path.split("/").pop())) return;
  const ext = extname(path);
  if (ext && !TEXT_EXT.has(ext)) return;
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return;
  }
  content.split("\n").forEach((line, i) => {
    if (!PATTERN.test(line)) return;
    if (ALLOW.some((re) => re.test(line))) return;
    hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 160)}`);
  });
}

function walk(path) {
  if (!existsSync(path)) return;
  const st = statSync(path);
  if (st.isFile()) return scanFile(path);
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    walk(join(path, entry));
  }
}

for (const root of ROOTS) walk(root);

if (hits.length > 0) {
  console.error("✖ Found forbidden 'Lovable' branding references:\n");
  console.error(hits.join("\n"));
  console.error(`\n${hits.length} match(es). Remove all Lovable branding before shipping.`);
  process.exit(1);
}

console.log("✔ No Lovable branding found in source or build output.");
