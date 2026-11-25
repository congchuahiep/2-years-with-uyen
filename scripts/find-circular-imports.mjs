// Tìm vòng import runtime trong `src/`.
//
// Vì sao cần script này: `madge` không resolve được alias `@/` trỏ vào barrel
// (`@/features/book`), nên nó bỏ qua đúng những cạnh dễ tạo vòng nhất.
//
// Cạnh `import type` / `export type` bị bỏ qua vì TypeScript xóa chúng khi
// compile, không tạo cạnh runtime (xem docs/import-boundaries.md).

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".jsx"];
const SKIP_DIRS = new Set(["node_modules", ".next"]);
// Asset (css, ảnh, json) không tạo cạnh module runtime.
const ASSET_EXTENSIONS = [
  ".css",
  ".scss",
  ".svg",
  ".png",
  ".jpg",
  ".webp",
  ".json",
];

/** Danh sách file nguồn (đường dẫn tuyệt đối). */
function collectSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(full));
      continue;
    }
    if (entry.name.endsWith(".d.ts")) continue;
    if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) files.push(full);
  }
  return files;
}

/** Specifier import/export có giá trị (bỏ type-only và dynamic import). */
function valueSpecifiers(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const specifiers = [];

  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      // `import type ...` bị xóa hoàn toàn khi compile.
      if (!node.importClause?.isTypeOnly) {
        specifiers.push(node.moduleSpecifier.text);
      }
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      if (!node.isTypeOnly) specifiers.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return specifiers;
}

/** Resolve specifier về file thật trong `src/`; package ngoài trả `external`. */
function resolveSpecifier(fromFile, specifier) {
  if (ASSET_EXTENSIONS.some((ext) => specifier.endsWith(ext))) {
    return { external: true };
  }

  let base;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith("."))
    base = resolve(dirname(fromFile), specifier);
  else return { external: true };

  for (const ext of EXTENSIONS) {
    if (existsSync(`${base}${ext}`)) return { file: `${base}${ext}` };
  }
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const ext of EXTENSIONS) {
      const index = join(base, `index${ext}`);
      if (existsSync(index)) return { file: index };
    }
  }
  return { unresolved: true };
}

/** Tarjan: trả về các thành phần liên thông mạnh (SCC). */
function stronglyConnectedComponents(nodes, edges) {
  const index = new Map();
  const low = new Map();
  const onStack = new Set();
  const stack = [];
  const components = [];
  let counter = 0;

  const connect = (node) => {
    index.set(node, counter);
    low.set(node, counter);
    counter += 1;
    stack.push(node);
    onStack.add(node);

    for (const next of edges.get(node) ?? []) {
      if (!index.has(next)) {
        connect(next);
        low.set(node, Math.min(low.get(node), low.get(next)));
      } else if (onStack.has(next)) {
        low.set(node, Math.min(low.get(node), index.get(next)));
      }
    }

    if (low.get(node) === index.get(node)) {
      const component = [];
      let popped;
      do {
        popped = stack.pop();
        onStack.delete(popped);
        component.push(popped);
      } while (popped !== node);
      components.push(component);
    }
  };

  for (const node of nodes) if (!index.has(node)) connect(node);
  return components;
}

/** Một đường đi khép kín bên trong SCC (để in ra dễ đọc). */
function cyclePath(component, edges) {
  const allowed = new Set(component);
  const start = component[0];
  const path = [];
  const seen = new Set();

  const walk = (node) => {
    path.push(node);
    seen.add(node);
    for (const next of edges.get(node) ?? []) {
      if (!allowed.has(next)) continue;
      if (next === start) return path.concat(start);
      if (!seen.has(next)) {
        const found = walk(next);
        if (found) return found;
      }
    }
    path.pop();
    return null;
  };

  return walk(start) ?? component.concat(start);
}

const files = collectSourceFiles(SRC);
const edges = new Map();
const external = new Set();
const unresolved = [];

for (const file of files) {
  const deps = new Set();
  for (const specifier of valueSpecifiers(file)) {
    const result = resolveSpecifier(file, specifier);
    if (result.file) deps.add(result.file);
    else if (result.external) external.add(specifier);
    else unresolved.push(`${relative(ROOT, file)} -> ${specifier}`);
  }
  edges.set(file, deps);
}

const toDisplay = (file) => relative(ROOT, file).split(sep).join("/");
const cycles = stronglyConnectedComponents(files, edges).filter(
  (component) =>
    component.length > 1 ||
    (edges.get(component[0]) ?? new Set()).has(component[0]),
);

for (const [i, component] of cycles.entries()) {
  const path = cyclePath(component, edges);
  console.log(`${i + 1}) ${path.map(toDisplay).join(" -> ")}`);
  const extra = component.filter((file) => !path.includes(file));
  if (extra.length > 0) {
    console.log(`   cùng vòng: ${extra.map(toDisplay).join(", ")}`);
  }
}

if (unresolved.length > 0) {
  console.log();
  console.log(`Import alias không resolve được (${unresolved.length}):`);
  for (const line of unresolved) console.log(`  ${line}`);
}

if (cycles.length > 0) {
  console.log();
  console.log(`Có ${cycles.length} vòng import runtime.`);
  process.exit(1);
}

console.log(
  `Không có vòng import runtime trong ${files.length} file ` +
    `(bỏ qua ${external.size} package ngoài).`,
);
