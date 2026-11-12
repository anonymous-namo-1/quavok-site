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
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
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
    const headers = { "Content-Type": types[extname(path)] || "application/octet-stream", "Content-Length": body.length };
    if (hit && [".mp4", ".mp3", ".wav"].includes(extname(path)) && req.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      const start = range?.[1] ? Number(range[1]) : Math.max(0, body.length - Number(range?.[2] || 0));
      const end = range?.[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      if (!range || start > end || start >= body.length) {
        res.writeHead(416, { "Content-Range": `bytes */${body.length}` });
        return res.end();
      }
      res.writeHead(206, { ...headers, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${body.length}`, "Content-Length": end - start + 1 });
      return res.end(req.method === "HEAD" ? undefined : body.subarray(start, end + 1));
    }
    res.writeHead(hit ? 200 : 404, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500);
    res.end("Run `npm run build` first.");
  }
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
