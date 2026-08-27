/**
 * Clinical walkthrough video recorder
 * Records a bedside-tablet style demo of the EHR Sidecar for medical users.
 *
 * Prerequisites: `npm run dev` (or DEMO_BASE_URL pointing at a running app)
 *
 * Usage:
 *   npx tsx scripts/record-clinical-demo.ts
 */
import { chromium, type Page } from "playwright";
import {
  mkdirSync,
  existsSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const BASE_URL = process.env.DEMO_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = join(process.cwd(), "docs", "demo");
const FRAMES_DIR = join(OUT_DIR, "_frames");
const VIDEO_PATH = join(OUT_DIR, "ehr-sidecar-clinical-walkthrough.mp4");
const FONT_BOLD =
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";

async function pause(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForSidecar(page: Page) {
  await page.waitForSelector("text=EHR Sidecar", { timeout: 30_000 });
}

async function captureFrame(page: Page, name: string) {
  await page.screenshot({
    path: join(FRAMES_DIR, `${name}.png`),
    fullPage: false,
  });
}

function runFfmpeg(args: string[], label: string) {
  const result = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(result.stderr);
    throw new Error(`ffmpeg ${label} failed`);
  }
}

async function runWalkthrough(): Promise<string> {
  mkdirSync(OUT_DIR, { recursive: true });
  if (existsSync(FRAMES_DIR)) {
    for (const f of readdirSync(FRAMES_DIR)) {
      unlinkSync(join(FRAMES_DIR, f));
    }
  } else {
    mkdirSync(FRAMES_DIR, { recursive: true });
  }

  const chromePath = join(
    process.env.HOME ?? "",
    ".cache/ms-playwright/chromium-1234/chrome-linux64/chrome",
  );
  const browser = await chromium.launch({
    headless: true,
    executablePath: existsSync(chromePath) ? chromePath : undefined,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Scene 1 — CHF patient, safety at a glance
  await page.goto(`${BASE_URL}/?patient=p1`, { waitUntil: "networkidle" });
  await waitForSidecar(page);
  await pause(1800);
  await captureFrame(page, "01-p1-safety-header");

  const expandBtn = page.getByRole("button", { name: /expand trends/i });
  if (await expandBtn.isVisible().catch(() => false)) {
    await expandBtn.click();
    await pause(1500);
    await captureFrame(page, "02-p1-vitals-expanded");
  }

  const orderHeading = page.getByText("CHF Exacerbation Panel");
  await orderHeading.scrollIntoViewIfNeeded();
  await pause(1000);
  await captureFrame(page, "03-p1-order-set");

  const orderChecks = page.locator('[role="list"] label');
  const count = await orderChecks.count();
  for (let i = 0; i < Math.min(3, count); i++) {
    await orderChecks.nth(i).click();
    await pause(400);
  }
  await pause(600);
  await captureFrame(page, "04-p1-orders-selected");

  const addBtn = page.getByRole("button", { name: /add selected orders/i });
  if (await addBtn.isVisible().catch(() => false)) {
    await addBtn.click();
    await pause(1000);
  }

  const aiCard = page.getByText("AI Clinical Summary");
  await aiCard.scrollIntoViewIfNeeded();
  await pause(800);
  const generateBtn = page.getByRole("button", {
    name: /generate ai summary/i,
  });
  if (await generateBtn.isVisible().catch(() => false)) {
    await generateBtn.click();
    await page
      .getByText("Critical Care Notes")
      .waitFor({ timeout: 15_000 })
      .catch(() => undefined);
    await pause(2200);
    await captureFrame(page, "05-p1-critical-care-notes");
  }

  // Scene 2 — Sepsis / DNR
  await page.goto(`${BASE_URL}/?patient=p2`, { waitUntil: "networkidle" });
  await waitForSidecar(page);
  await pause(1500);
  await captureFrame(page, "06-p2-sepsis-dnr");

  const sepsisOrders = page.getByText("Sepsis Workup");
  if (await sepsisOrders.isVisible().catch(() => false)) {
    await sepsisOrders.scrollIntoViewIfNeeded();
    await pause(1200);
    await captureFrame(page, "07-p2-sepsis-orders");
  }

  const generateP2 = page.getByRole("button", {
    name: /generate ai summary/i,
  });
  if (await generateP2.isVisible().catch(() => false)) {
    await generateP2.scrollIntoViewIfNeeded();
    await generateP2.click();
    await pause(2500);
    await captureFrame(page, "08-p2-ai-summary");
  }

  // Scene 3 — Pediatric
  await page.goto(`${BASE_URL}/?patient=p3`, { waitUntil: "networkidle" });
  await waitForSidecar(page);
  await pause(1500);
  await captureFrame(page, "09-p3-pediatric");

  // Scene 4 — Empty chart
  await page.goto(`${BASE_URL}/?patient=p4`, { waitUntil: "networkidle" });
  await waitForSidecar(page);
  await pause(1500);
  await captureFrame(page, "10-p4-empty-states");

  // Closing on CHF hero
  await page.goto(`${BASE_URL}/?patient=p1`, { waitUntil: "networkidle" });
  await waitForSidecar(page);
  await pause(1200);
  await captureFrame(page, "11-closing-p1");

  await context.close();
  await browser.close();

  const videoFiles = readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => join(OUT_DIR, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  if (videoFiles.length === 0) {
    throw new Error("No Playwright .webm recording found");
  }

  return videoFiles[0]!;
}

function burnTitlesAndExport(webmPath: string) {
  const titleMp4 = join(OUT_DIR, "_title_card.mp4");
  const endMp4 = join(OUT_DIR, "_end_card.mp4");
  const walkMp4 = join(OUT_DIR, "_walkthrough_raw.mp4");
  const listFile = join(OUT_DIR, "_concat.txt");

  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=0x2f3640:s=1440x900:d=3",
      "-vf",
      [
        `drawtext=fontfile=${FONT_BOLD}:text='EHR Sidecar':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2-60`,
        `drawtext=fontfile=${FONT_REG}:text='Clinical Walkthrough for Bedside Care':fontcolor=0xe8eaed:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2+20`,
        `drawtext=fontfile=${FONT_REG}:text='Synthetic demo — not for production PHI':fontcolor=0xaeb4bc:fontsize=22:x=(w-text_w)/2:y=(h-text_h)/2+70`,
      ].join(","),
      titleMp4,
    ],
    "title card",
  );

  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=0x2f3640:s=1440x900:d=2.5",
      "-vf",
      [
        `drawtext=fontfile=${FONT_BOLD}:text='Safety at a glance. Orders in two clicks.':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2-30`,
        `drawtext=fontfile=${FONT_REG}:text='github.com/feedmecode9m/ehr-sidecar-project':fontcolor=0xc5cad1:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2+30`,
      ].join(","),
      endMp4,
    ],
    "end card",
  );

  runFfmpeg(
    [
      "-y",
      "-i",
      webmPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-an",
      walkMp4,
    ],
    "webm→mp4",
  );

  writeFileSync(
    listFile,
    [`file '${titleMp4}'`, `file '${walkMp4}'`, `file '${endMp4}'`].join("\n"),
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
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      VIDEO_PATH,
    ],
    "concat",
  );

  console.log(`\n✅ Clinical walkthrough video:\n   ${VIDEO_PATH}\n`);
}

async function main() {
  console.log(`Recording clinical walkthrough from ${BASE_URL} …`);
  const webm = await runWalkthrough();
  console.log(`Raw capture: ${webm}`);
  burnTitlesAndExport(webm);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
