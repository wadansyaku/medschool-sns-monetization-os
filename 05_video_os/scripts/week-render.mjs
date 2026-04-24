#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const mode = process.argv[2];
const slug = process.argv[3];
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "video-packages.manifest.json"), "utf8"),
);

const LONGFORM_INTRO_FRAMES = 300;
const LONGFORM_SCENE_FRAMES = 360;

const usage = `Usage: node scripts/week-render.mjs <still|render|list> <${manifest
  .map((item) => item.slug)
  .join("|")}|all>`;

if (!mode || (mode !== "list" && !slug)) {
  console.error(usage);
  process.exit(1);
}

const run = (args) => {
  const result = spawnSync("npx", ["remotion", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const selectedPackages = slug === "all" ? manifest : manifest.filter((item) => item.slug === slug);

if (mode === "list") {
  for (const item of manifest) {
    console.log(`${item.slug}\t${item.longformId}\t${item.thumbnailId}\t${item.shortIds.join(",")}`);
  }
  process.exit(0);
}

if (selectedPackages.length === 0) {
  console.error(usage);
  process.exit(1);
}

for (const videoPackage of selectedPackages) {
  const coreSceneFrame =
    LONGFORM_INTRO_FRAMES +
    Math.floor(videoPackage.sceneCount / 2) * LONGFORM_SCENE_FRAMES +
    60;
  const outroFrame =
    LONGFORM_INTRO_FRAMES + videoPackage.sceneCount * LONGFORM_SCENE_FRAMES + 20;

  if (mode === "still") {
    run(["still", videoPackage.thumbnailId, `out/${videoPackage.outPrefix}-thumb.png`, "--frame=0"]);
    run(["still", videoPackage.longformId, `out/${videoPackage.outPrefix}-long-cover.png`, "--frame=45"]);
    run([
      "still",
      videoPackage.longformId,
      `out/${videoPackage.outPrefix}-long-scene.png`,
      `--frame=${coreSceneFrame}`,
    ]);
    run([
      "still",
      videoPackage.longformId,
      `out/${videoPackage.outPrefix}-long-outro.png`,
      `--frame=${outroFrame}`,
    ]);

    videoPackage.shortIds.forEach((shortId, index) => {
      run([
        "still",
        shortId,
        `out/${videoPackage.outPrefix}-short-${String(index + 1).padStart(2, "0")}.png`,
        "--frame=60",
      ]);
    });
  } else if (mode === "render") {
    videoPackage.shortIds.forEach((shortId, index) => {
      run([
        "render",
        shortId,
        `out/${videoPackage.outPrefix}-short-${String(index + 1).padStart(2, "0")}.mp4`,
      ]);
    });

    run([
      "render",
      videoPackage.longformId,
      `out/${videoPackage.outPrefix}-long-draft.mp4`,
      "--scale=0.5",
    ]);
  } else {
    console.error("Mode must be 'still', 'render', or 'list'.");
    process.exit(1);
  }
}
