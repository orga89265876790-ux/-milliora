import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const openNext = resolve(root, ".open-next");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

await cp(openNext, resolve(dist, "server", "open-next"), { recursive: true });
await cp(resolve(openNext, "assets"), resolve(dist, "assets"), { recursive: true });

await writeFile(
  resolve(dist, "server", "index.js"),
  'export { default } from "./open-next/worker.js";\n',
  "utf8",
);

const hosting = await readFile(resolve(root, ".openai", "hosting.json"), "utf8");
await writeFile(resolve(dist, ".openai", "hosting.json"), hosting, "utf8");
