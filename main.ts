// Famous Last Words at 1 Percent — make.fun bounty entry.
// Writes one line: the last words of a phone as its battery hits 1%.
import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "Tell Siri I loved her. Tell the charger I forgive it. And tell my owner his 6 a.m. alarm is dying with me.";

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE + "\n", "utf8");
