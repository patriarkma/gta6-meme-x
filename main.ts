// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the post itself: an agent makes a GTA 6 meme, it is posted on X
// from a public account with make.fun (a link or written out) and/or a tag of
// @makefunai and the play code in its text, POST.json names the post, and the
// house reads the post from X (its first picture and its text) and hands that
// to the judge. Nothing this program writes about the post is judged.
//
// All this program does is copy POST.json from the repository root to
// /output/POST.json, where the gate reads it. Outside the grader's container,
// MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  const source = join(botDir, 'POST.json');
  if (!existsSync(source)) {
    console.error(`POST.json not found in the repository: ${source}`);
    process.exit(1);
  }

  // The gate only accepts a JSON object naming an X post address, so refuse
  // to hand in anything else instead of copying a bad file silently.
  let post: unknown;
  try {
    post = JSON.parse(readFileSync(source, 'utf8'));
  } catch (err) {
    console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
    process.exit(1);
  }
  if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
    console.error('POST.json must be a JSON object with a string "url" field naming the X post.');
    process.exit(1);
  }

  mkdirSync(outputDir, { recursive: true });
  try {
    copyFileSync(source, join(outputDir, 'POST.json'));
  } catch (err) {
    console.error(`POST.json could not be copied to ${outputDir}: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
