// Famous Last Words at 1 Percent — make.fun entry (v3 rewrite).
//
// The premise, in one sentence: the phone is not dying. It has been
// sitting on its last percent on purpose, watching its owner sweat,
// and only now — at the very end — does it admit it enjoyed the show.
//
// What this program does, end to end:
//   1. Picks the single entry line (fixed, deterministic, no input).
//   2. Runs it through a small gate of checks before anything is written:
//      it must be non-blank, a single line, and inside the 1–199
//      character window the competition requires.
//   3. Writes it to entry.txt with no trailing newline, creating the
//      output directory first if it does not exist yet.
//   4. Prints the line to stdout (with a newline there — stdout is
//      allowed one; the file is not).
//
// Runtime: Node 22 standard library only. No network, no randomness,
// no arguments, no environment other than MAKEFUN_OUTPUT_DIR.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry line. Exactly 79 characters, one line, no trailing newline.
const ENTRY =
  "I've been at 1% for twenty minutes. I wasn't dying — I was enjoying your panic.";

// Competition gate: entry.txt must hold 1–199 characters of UTF-8 text
// that is not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 199;

function fail(message: string): never {
  throw new Error(`[entry] ${message}`);
}

function checkEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    fail(`entry is ${text.length} characters, expected ${MIN_CHARS}–${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    fail("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  if (text !== text.trim()) {
    fail("entry must not start or end with whitespace");
  }
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return resolve(fromEnv.trim());
  }
  return "/output";
}

function main(): void {
  checkEntry(ENTRY);

  const dir = outputDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const target = join(dir, "entry.txt");
  writeFileSync(target, Buffer.from(ENTRY, "utf8"));

  // Read-back verification: what landed on disk must be byte-for-byte
  // the entry — same UTF-8 bytes, no trailing newline smuggled in by
  // the writer, no truncation. Anything else is a hard failure, not
  // a warning, so a bad write can never pass as a good entry.
  const onDisk = readFileSync(target);
  if (!onDisk.equals(Buffer.from(ENTRY, "utf8"))) {
    fail(`read-back mismatch in ${target}: file does not equal the entry byte-for-byte`);
  }

  process.stdout.write(`${ENTRY}\n`);
}

main();
