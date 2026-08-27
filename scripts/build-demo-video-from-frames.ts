/**
 * Build a captioned clinical walkthrough MP4 from captured keyframes.
 * Run after `npx tsx scripts/record-clinical-demo.ts` (or reuse existing _frames).
 *
 *   npx tsx scripts/build-demo-video-from-frames.ts
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "docs", "demo");
const FRAMES_DIR = join(OUT_DIR, "_frames");
const VIDEO_PATH = join(OUT_DIR, "ehr-sidecar-clinical-walkthrough.mp4");
const FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";

const SCENES: { file: string; caption: string; seconds: number }[] = [
  {
    file: "01-p1-safety-header.png",
    caption: "Bedside view — allergies & code status always visible",
    seconds: 3.5,
  },
  {
    file: "02-p1-vitals-expanded.png",
    caption: "Progressive vitals — trends in one tap",
    seconds: 3.2,
  },
  {
    file: "03-p1-order-set.png",
    caption: "Context-aware CHF order set",
    seconds: 3.2,
  },
  {
    file: "04-p1-orders-selected.png",
    caption: "Select orders — common workflows in ≤2 clicks",
    seconds: 3.0,
  },
  {
    file: "05-p1-critical-care-notes.png",
    caption: "AI summary elevates Critical Care Notes first",
    seconds: 4.0,
  },
  {
    file: "06-p2-sepsis-dnr.png",
    caption: "Sepsis patient — NKDA + DNR at a glance",
    seconds: 3.2,
  },
  {
    file: "07-p2-sepsis-orders.png",
    caption: "STAT sepsis workup orders ready",
    seconds: 3.0,
  },
  {
    file: "08-p2-ai-summary.png",
    caption: "HIPAA-minded AI — browser sends noteId only",
    seconds: 3.5,
  },
  {
    file: "09-p3-pediatric.png",
    caption: "Pediatric asthma — peanut allergy surfaced",
    seconds: 3.0,
  },
  {
    file: "10-p4-empty-states.png",
    caption: "Minimal chart — graceful empty states",
    seconds: 3.0,
  },
  {
    file: "11-closing-p1.png",
    caption: "Augments the legacy EHR — does not replace it",
    seconds: 3.2,
  },
];

function runFfmpeg(args: string[], label: string) {
  const result = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(result.stderr);
    throw new Error(`ffmpeg ${label} failed`);
  }
}

function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/%/g, "%%");
}

function main() {
  if (!existsSync(FRAMES_DIR)) {
    throw new Error("Missing docs/demo/_frames — run record-clinical-demo.ts first");
  }

  const work = join(OUT_DIR, "_scene_clips");
  mkdirSync(work, { recursive: true });
  for (const f of readdirSync(work)) unlinkSync(join(work, f));

  const clipPaths: string[] = [];

  // Title
  const title = join(work, "00-title.mp4");
  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=0x2f3640:s=1440x900:d=3.2",
      "-vf",
      [
        `drawtext=fontfile=${FONT_BOLD}:text='EHR Sidecar':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2-70`,
        `drawtext=fontfile=${FONT_REG}:text='How clinicians would use it at the bedside':fontcolor=0xe8eaed:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+10`,
        `drawtext=fontfile=${FONT_REG}:text='Synthetic demo — not for production PHI':fontcolor=0xaeb4bc:fontsize=22:x=(w-text_w)/2:y=(h-text_h)/2+60`,
      ].join(","),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      title,
    ],
    "title",
  );
  clipPaths.push(title);

  for (const [i, scene] of SCENES.entries()) {
    const src = join(FRAMES_DIR, scene.file);
    if (!existsSync(src)) {
      console.warn(`Skipping missing frame: ${scene.file}`);
      continue;
    }
    const out = join(work, `${String(i + 1).padStart(2, "0")}.mp4`);
    const caption = escapeDrawtext(scene.caption);
    runFfmpeg(
      [
        "-y",
        "-loop",
        "1",
        "-i",
        src,
        "-t",
        String(scene.seconds),
        "-vf",
        [
          "scale=1440:900:force_original_aspect_ratio=decrease",
          "pad=1440:900:(ow-iw)/2:(oh-ih)/2:color=0x2f3640",
          "drawbox=x=0:y=ih-90:w=iw:h=90:color=0x1a1f26@0.82:t=fill",
          `drawtext=fontfile=${FONT_REG}:text='${caption}':fontcolor=white:fontsize=28:x=36:y=h-58`,
        ].join(","),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        out,
      ],
      scene.file,
    );
    clipPaths.push(out);
  }

  const end = join(work, "99-end.mp4");
  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=0x2f3640:s=1440x900:d=3",
      "-vf",
      [
        `drawtext=fontfile=${FONT_BOLD}:text='Safety at a glance. Orders in two clicks.':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=(h-text_h)/2-40`,
        `drawtext=fontfile=${FONT_REG}:text='Critical Care Notes elevate anaphylaxis\\, DNR\\, sepsis alerts':fontcolor=0xe8eaed:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2+10`,
        `drawtext=fontfile=${FONT_REG}:text='github.com/feedmecode9m/ehr-sidecar-project':fontcolor=0xc5cad1:fontsize=22:x=(w-text_w)/2:y=(h-text_h)/2+55`,
      ].join(","),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      end,
    ],
    "end",
  );
  clipPaths.push(end);

  const listFile = join(work, "concat.txt");
  writeFileSync(
    listFile,
    clipPaths.map((p) => `file '${p}'`).join("\n"),
  );

  runFfmpeg(
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFile,
      "-c:v",
      "libx264",
      "-crf",
      "20",
      "-preset",
      "medium",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      VIDEO_PATH,
    ],
    "concat",
  );

  console.log(`\n✅ Captioned clinical walkthrough:\n   ${VIDEO_PATH}\n`);

  const downloads = join(
    process.env.HOME ?? "",
    "Downloads",
    "EHR-Sidecar-Clinical-Walkthrough.mp4",
  );
  try {
    const { copyFileSync } = await import("node:fs");
    copyFileSync(VIDEO_PATH, downloads);
    console.log(`Also copied to:\n   ${downloads}\n`);
  } catch {
    // Downloads folder may not exist in CI
  }
}

main();
