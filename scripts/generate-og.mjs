// Generate the static social card locally; no font or image network requests.
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
const source = await readFile(new URL("./og-image.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const exports = {};
new Function("require", "exports", outputText)(require, exports);
const response = exports.GET();
await writeFile(resolve("public/og.png"), Buffer.from(await response.arrayBuffer()));
console.log("Generated public/og.png (1200 × 630)");
