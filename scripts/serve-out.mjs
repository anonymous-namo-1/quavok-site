// Minimal static server for previewing the exported site in out/.
// Resolves directory URLs to index.html (like GitHub Pages) and serves
// out/404.html for anything missing. No dependencies.
//   node scripts/serve-out.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function find(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let p = join(root, clean);
  if (!p.startsWith(root)) return null;
  try {
    const s = await stat(p);
    if (s.isDirectory()) {
      if (!urlPath.split("?")[0].endsWith("/")) return { redirect: urlPath.split("?")[0] + "/" };
      p = join(p, "index.html");
    }
    await stat(p);
    return { path: p };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const hit = await find(req.url || "/");
  if (hit?.redirect) {
    res.writeHead(301, { Location: hit.redirect });
    return res.end();
  }
  const path = hit?.path || join(root, "404.html");
  try {
    const body = await readFile(path);
    res.writeHead(hit ? 200 : 404, { "Content-Type": types[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end("Run `npm run build` first.");
  }
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
