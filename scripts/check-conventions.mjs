// Kiểm tra các luật kiến trúc mà Biome không diễn đạt được:
//
// 1. Component / hook / store: đúng MỘT default export, tên file trùng tên export.
// 2. File server-only phải mở đầu bằng `import "server-only";`.
// 3. `index.ts` của feature không được re-export module server-only.
// 4. Trong `src/features/**` không được import barrel (`index.ts`).
// 5. `src/shared` không có barrel.
// 6. `actions.ts` phải mở đầu bằng `"use server";`.
//
// Chạy: bun run conventions

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const SHARED = join(SRC, "shared");
const FEATURES = join(SRC, "features");
const SKIP_DIRS = new Set(["node_modules", ".next"]);
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".jsx"];

const problems = [];
const report = (file, message) => {
  problems.push(`${relative(ROOT, file).split(sep).join("/")}: ${message}`);
};

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext)))
      files.push(full);
  }
  return files;
}

const cache = new Map();
function parse(file) {
  if (!cache.has(file)) {
    cache.set(
      file,
      ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      ),
    );
  }
  return cache.get(file);
}

/** Số default export và tên default export (nếu là định danh). */
function defaultExports(sourceFile) {
  const names = [];
  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      names.push(
        ts.isIdentifier(statement.expression)
          ? statement.expression.text
          : "<biểu thức>",
      );
      continue;
    }
    const hasDefault = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
    );
    if (
      hasDefault &&
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement))
    ) {
      names.push(statement.name?.text ?? "<ẩn danh>");
    }
  }
  return names;
}

function isServerOnlyStatement(statement) {
  return (
    ts.isImportDeclaration(statement) &&
    ts.isStringLiteral(statement.moduleSpecifier) &&
    statement.moduleSpecifier.text === "server-only"
  );
}

function hasServerOnly(sourceFile) {
  return sourceFile.statements.some(isServerOnlyStatement);
}

function isUseServerStatement(statement) {
  return (
    ts.isExpressionStatement(statement) &&
    ts.isStringLiteral(statement.expression) &&
    statement.expression.text === "use server"
  );
}

function resolveSpecifier(fromFile, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith("."))
    base = resolve(dirname(fromFile), specifier);
  else return null;

  for (const ext of EXTENSIONS) {
    if (existsSync(`${base}${ext}`)) return `${base}${ext}`;
  }
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const ext of EXTENSIONS) {
      const index = join(base, `index${ext}`);
      if (existsSync(index)) return index;
    }
  }
  return null;
}

/** Các module được re-export bởi một file `index.ts`. */
function indexTargets(file, visited = new Set()) {
  if (visited.has(file)) return [];
  visited.add(file);

  const sourceFile = parse(file);
  const targets = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier)
      continue;
    if (statement.isTypeOnly) continue;
    const target = resolveSpecifier(file, statement.moduleSpecifier.text);
    if (!target) continue;
    targets.push(target);
    if (basename(target).startsWith("index.")) {
      targets.push(...indexTargets(target, visited));
    }
  }
  return targets;
}

const files = walk(SRC);

const isInDir = (file, dir) => file.startsWith(`${dir}${sep}`);
const segments = (file) => relative(SRC, file).split(sep);

const componentDirNames = new Set(["components", "icons", "providers"]);
const hookDirNames = new Set(["hooks", "stores"]);

for (const file of files) {
  const parts = segments(file);
  const name = basename(file);
  const sourceFile = parse(file);
  const inFeature = isInDir(file, FEATURES);

  // 1. Component / hook / store: một default export, tên file trùng tên export.
  const isComponent = parts.some(
    (part, index) => index < parts.length - 1 && componentDirNames.has(part),
  );
  const isHook = parts.some(
    (part, index) => index < parts.length - 1 && hookDirNames.has(part),
  );

  if (
    !name.startsWith("index.") &&
    (isHook || (isComponent && name.endsWith(".tsx")))
  ) {
    const names = defaultExports(sourceFile);
    const expected = name.replace(/\.(tsx|ts|mts|js|jsx)$/, "");
    if (names.length !== 1) {
      report(file, `phải có đúng 1 default export, đang có ${names.length}`);
    } else if (names[0] !== expected) {
      report(
        file,
        `default export "${names[0]}" không trùng tên file "${expected}"`,
      );
    }
  }

  // 2. server-only: bắt buộc với server.ts/session.ts/db client, và phải đứng đầu.
  if (
    hasServerOnly(sourceFile) &&
    !isServerOnlyStatement(sourceFile.statements[0])
  ) {
    report(file, 'import "server-only" phải là câu lệnh đầu tiên');
  }
  const needsServerOnly =
    (inFeature && (name === "server.ts" || name === "session.ts")) ||
    file === join(SRC, "db", "client.ts");
  if (needsServerOnly && !hasServerOnly(sourceFile)) {
    report(file, 'file server-only phải mở đầu bằng import "server-only"');
  }

  // 6. actions.ts phải là Server Action module.
  if (inFeature && name === "actions.ts") {
    if (!sourceFile.statements.some(isUseServerStatement)) {
      report(file, 'actions.ts phải mở đầu bằng "use server"');
    }
  }

  // 3. index.ts không được re-export module server-only (kể cả qua barrel con).
  if (name.startsWith("index.") && inFeature) {
    for (const target of indexTargets(file)) {
      if (hasServerOnly(parse(target))) {
        report(
          file,
          `re-export module server-only "${relative(ROOT, target).split(sep).join("/")}"`,
        );
      }
    }
  }

  // 4. Trong features không được import barrel.
  if (inFeature) {
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const target = resolveSpecifier(file, statement.moduleSpecifier.text);
      if (target && basename(target).startsWith("index.")) {
        report(
          file,
          `import barrel "${statement.moduleSpecifier.text}" trong src/features`,
        );
      }
    }
  }

  // 5. shared không có barrel.
  if (isInDir(file, SHARED) && name.startsWith("index.")) {
    report(file, "src/shared không được có barrel (index.ts)");
  }
}

if (problems.length > 0) {
  console.log(`Có ${problems.length} vi phạm convention:`);
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exit(1);
}

console.log(`Convention OK (${files.length} file).`);
