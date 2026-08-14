import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const exportedSite = resolve(root, "out");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

await cp(exportedSite, resolve(dist, "assets"), { recursive: true });

await writeFile(
  resolve(dist, "server", "index.js"),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== "GET") {
      return response;
    }

    const url = new URL(request.url);
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`,
  "utf8",
);

const hosting = await readFile(resolve(root, ".openai", "hosting.json"), "utf8");
await writeFile(resolve(dist, ".openai", "hosting.json"), hosting, "utf8");
