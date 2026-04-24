#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const repoRoot = resolve(root, "..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "video-packages.manifest.json"), "utf8"),
);

const dataSource = readFileSync(resolve(root, "src/data/videoPackages.ts"), "utf8");
const readRepoFile = (relativePath) => readFileSync(resolve(repoRoot, relativePath), "utf8");

const forbiddenClaims = [
  "必ず治る",
  "この症状なら大丈夫",
  "医学的に正しい",
  "診断します",
  "治療できます",
  "必ず受かる",
  "合格保証",
];

const packageRequiredSections = [
  "核テーマ",
  "YouTube 長尺",
  "短尺 4 本",
  "Instagram カルーセル",
  "X 投稿 10 本",
  "Video OS handoff",
  "KPI 仮説",
  "QA",
];

const failures = [];
const seenSlugs = new Set();
const seenIds = new Set();

for (const item of manifest) {
  if (seenSlugs.has(item.slug)) {
    failures.push(`manifest: duplicate slug '${item.slug}'`);
  }
  seenSlugs.add(item.slug);

  if (!existsSync(resolve(repoRoot, item.sourcePath))) {
    failures.push(`manifest: sourcePath missing '${item.sourcePath}'`);
    continue;
  }

  const packageText = readRepoFile(item.sourcePath);

  for (const section of packageRequiredSections) {
    if (!packageText.includes(section)) {
      failures.push(`${item.sourcePath}: missing section '${section}'`);
    }
  }

  for (const field of ["レイヤー:", "登録理由:", "YouTube 長尺化の理由:", "次に見る長尺:"]) {
    if (!packageText.includes(field)) {
      failures.push(`${item.sourcePath}: missing field '${field}'`);
    }
  }

  for (const claim of forbiddenClaims) {
    if (packageText.includes(claim)) {
      failures.push(`${item.sourcePath}: forbidden claim '${claim}' found`);
    }
  }

  if (!Array.isArray(item.shortIds) || item.shortIds.length !== 4) {
    failures.push(`manifest:${item.slug}: shortIds must contain exactly 4 shorts`);
  }

  for (const id of [item.longformId, item.thumbnailId, ...item.shortIds]) {
    if (seenIds.has(id)) {
      failures.push(`manifest: duplicate composition id '${id}'`);
    }
    seenIds.add(id);

    if (!dataSource.includes(id)) {
      failures.push(`src/data/videoPackages.ts: missing composition id '${id}'`);
    }
  }

  if (!dataSource.includes(item.sourcePath)) {
    failures.push(`src/data/videoPackages.ts: missing sourcePath '${item.sourcePath}'`);
  }

  if (!dataSource.includes(`compositionIds:`)) {
    failures.push("src/data/videoPackages.ts: VideoPackage entries must include explicit compositionIds");
  }

  if (!packageText.includes(item.longformId) || !packageText.includes(item.thumbnailId)) {
    failures.push(`${item.sourcePath}: Video OS handoff must include ${item.longformId} and ${item.thumbnailId}`);
  }

  for (const id of item.shortIds) {
    if (!packageText.includes(id)) {
      failures.push(`${item.sourcePath}: Video OS handoff must include short id ${id}`);
    }
  }
}

for (const claim of forbiddenClaims) {
  if (dataSource.includes(claim)) {
    failures.push(`src/data/videoPackages.ts: forbidden claim '${claim}' found`);
  }
}

if (failures.length > 0) {
  console.error("Content validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Content validation passed for ${manifest.length} packages.`);
