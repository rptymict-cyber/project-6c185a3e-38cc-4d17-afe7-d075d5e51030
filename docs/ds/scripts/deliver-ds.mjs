#!/usr/bin/env node
// MD·HTML 일치 검사 + 결과 전달(로컬 Downloads 또는 클라우드 output 폴더) + 전체 완료 보고서 생성.
// Usage:
//   node docs/ds/scripts/deliver-ds.mjs <menuId> --mode=local|cloud
//   node docs/ds/scripts/deliver-ds.mjs --report --mode=local|cloud

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { parseMenuMd, validateMenu } from "./validate-ds.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const DS_DIR = path.join(ROOT, "docs", "ds");
const LOCAL_DELIVERY_ROOT = "C:\\Users\\chlgk\\Downloads\\Lovable DS 최종본";
const CLOUD_OUTPUT_DIR = path.join(DS_DIR, "output");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function parseArgs(argv) {
  const opts = { mode: null, report: false, menuId: null };
  for (const a of argv) {
    if (a === "--report") opts.report = true;
    else if (a.startsWith("--mode=")) opts.mode = a.slice("--mode=".length);
    else if (!a.startsWith("--")) opts.menuId = a;
  }
  return opts;
}

function htmlDsNos(html) {
  const out = [];
  const re = /<td class="ds-no">([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1].trim());
  return out;
}

function gitHeadShort() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: ROOT }).toString().trim();
  } catch {
    return "unknown";
  }
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// MD 파싱 결과와 생성된 HTML을 비교해서 행 수·DS No. 집합·상세 사양이 일치하는지 검사한다.
function compareMdHtml(mdPath, htmlPath) {
  const issues = [];
  if (!fs.existsSync(mdPath)) {
    issues.push(`MD 파일 없음: ${mdPath}`);
    return { ok: false, issues, mdRowCount: 0, htmlRowCount: 0 };
  }
  const mdText = fs.readFileSync(mdPath, "utf8");
  const { sections } = parseMenuMd(mdText);
  const mdRows = sections.flatMap((s) => s.rows.filter((r) => !r.error));
  const mdDsNos = mdRows.map((r) => r.dsNo);

  if (!fs.existsSync(htmlPath)) {
    issues.push(`HTML 파일 없음: ${htmlPath}`);
    return { ok: false, issues, mdRowCount: mdRows.length, htmlRowCount: 0 };
  }
  const htmlText = fs.readFileSync(htmlPath, "utf8");
  const htmlDs = htmlDsNos(htmlText);

  if (mdDsNos.length !== htmlDs.length) {
    issues.push(`행 수 불일치: MD ${mdDsNos.length}행 vs HTML ${htmlDs.length}행`);
  }
  const mdSet = new Set(mdDsNos);
  const htmlSet = new Set(htmlDs);
  const missingInHtml = mdDsNos.filter((d) => !htmlSet.has(d));
  const extraInHtml = htmlDs.filter((d) => !mdSet.has(d));
  if (missingInHtml.length) issues.push(`MD에는 있지만 HTML에 없는 DS No.: ${missingInHtml.join(", ")}`);
  if (extraInHtml.length) issues.push(`HTML에는 있지만 MD에 없는 DS No.: ${extraInHtml.join(", ")}`);

  return { ok: issues.length === 0, issues, mdRowCount: mdRows.length, htmlRowCount: htmlDs.length };
}

// 대상 폴더에 버전 충돌 없이 파일을 복사한다. 동일 파일이 이미 있으면 스킵, 내용이 다르면 _v2, _v3...
function copyWithVersioning(srcPath, destDir, baseName) {
  fs.mkdirSync(destDir, { recursive: true });
  const ext = path.extname(baseName);
  const stem = baseName.slice(0, -ext.length);
  const srcContent = fs.readFileSync(srcPath);

  let candidate = path.join(destDir, baseName);
  if (fs.existsSync(candidate)) {
    const existing = fs.readFileSync(candidate);
    if (existing.equals(srcContent)) {
      return { path: candidate, action: "skip-identical" };
    }
    let n = 2;
    while (fs.existsSync(path.join(destDir, `${stem}_v${n}${ext}`))) n++;
    candidate = path.join(destDir, `${stem}_v${n}${ext}`);
  }
  fs.writeFileSync(candidate, srcContent);

  const copied = fs.readFileSync(candidate);
  const sizeOk = copied.length > 0;
  const contentOk = copied.equals(srcContent);
  return { path: candidate, action: "copied", sizeOk, contentOk };
}

function deliverOne(menuId, mode) {
  const inventory = loadJSON(path.join(DS_DIR, "menu-inventory.json"));
  const menu = inventory.menus.find((m) => m.menuId === menuId);
  if (!menu) throw new Error(`menu-inventory.json에 ${menuId} 없음`);

  const mdPath = path.join(ROOT, menu.dsFile);
  const htmlPath = mdPath.replace(/\.md$/, "-ds-confluence.html");
  const cmp = compareMdHtml(mdPath, htmlPath);

  console.log(`=== ${menuId} (${menu.menuName}) — MD ${cmp.mdRowCount}행 / HTML ${cmp.htmlRowCount}행 ===`);
  if (cmp.ok) console.log("MD·HTML 일치: OK");
  else cmp.issues.forEach((i) => console.log("  - " + i));

  if (!cmp.ok) {
    process.exitCode = 1;
    return cmp;
  }

  if (mode === "local") {
    const orderStr = String(menu.order).padStart(2, "0");
    const destDir = path.join(LOCAL_DELIVERY_ROOT, `${orderStr}_${menuId}_${menu.menuName}`);
    const mdResult = copyWithVersioning(mdPath, destDir, path.basename(mdPath));
    const htmlResult = copyWithVersioning(htmlPath, destDir, path.basename(htmlPath));
    for (const r of [mdResult, htmlResult]) {
      if (r.action === "copied" && (!r.sizeOk || !r.contentOk)) {
        console.log(`  ! 전달 무결성 검사 실패: ${r.path}`);
        process.exitCode = 1;
      } else {
        console.log(`  전달됨(${r.action}): ${r.path}`);
      }
    }
  } else if (mode === "cloud") {
    fs.mkdirSync(CLOUD_OUTPUT_DIR, { recursive: true });
    const listPath = path.join(CLOUD_OUTPUT_DIR, "Confluence_업로드_목록.md");
    const line = `| ${String(menu.order).padStart(2, "0")} | ${menuId} | ${menu.menuName} | ${menu.dsFile} | ${path.relative(ROOT, htmlPath).replace(/\\/g, "/")} | ${cmp.mdRowCount} | ${gitHeadShort()} | ${nowStamp()} |\n`;
    if (!fs.existsSync(listPath)) {
      fs.writeFileSync(
        listPath,
        "# Confluence 업로드 목록\n\n| Order | Menu ID | 메뉴명 | MD 경로 | HTML 경로 | DS No. 수 | Git 커밋 | 기록 시각 |\n|---|---|---|---|---|---|---|---|\n" + line,
        "utf8"
      );
    } else {
      const existing = fs.readFileSync(listPath, "utf8");
      const withoutMenu = existing
        .split("\n")
        .filter((l) => !l.startsWith(`| ${String(menu.order).padStart(2, "0")} | ${menuId} |`))
        .join("\n");
      fs.writeFileSync(listPath, withoutMenu.replace(/\n*$/, "\n") + line, "utf8");
    }
    console.log(`  전달 기록됨(cloud): ${path.relative(ROOT, listPath)}`);
  } else {
    throw new Error("--mode=local|cloud 필요");
  }

  return cmp;
}

function buildReport(mode) {
  const inventory = loadJSON(path.join(DS_DIR, "menu-inventory.json"));
  const registry = loadJSON(path.join(DS_DIR, "screen-registry.json"));

  const rows = [];
  let totalIssues = 0;
  const globalDsNoMap = new Map();

  for (const menu of inventory.menus) {
    const mdPath = path.join(ROOT, menu.dsFile);
    if (!fs.existsSync(mdPath)) {
      rows.push({ menu, status: "MD 없음", issues: 1, dsNoCount: 0, screenCount: 0 });
      totalIssues += 1;
      continue;
    }
    const v = validateMenu(menu.menuId);
    const cmp = compareMdHtml(mdPath, mdPath.replace(/\.md$/, "-ds-confluence.html"));
    const issueCount = v.issues.length + cmp.issues.length;
    rows.push({ menu, status: issueCount === 0 ? "정합성 OK" : "이슈 있음", issues: issueCount, dsNoCount: v.dsNoCount, screenCount: v.screenCount });
    totalIssues += issueCount;

    for (const sec of v.parsed?.sections || []) {
      for (const row of sec.rows) {
        if (!row.dsNo) continue;
        if (globalDsNoMap.has(row.dsNo) && globalDsNoMap.get(row.dsNo) !== menu.menuId) {
          totalIssues++;
        } else {
          globalDsNoMap.set(row.dsNo, menu.menuId);
        }
      }
    }
  }

  const regTotal = registry.screens.reduce((n, s) => n + s.dsNos.length, 0);
  const lines = [];
  lines.push("# DS 전체 완료 보고서");
  lines.push("");
  lines.push(`생성 시각: ${nowStamp()} / Git 커밋: ${gitHeadShort()}`);
  lines.push("");
  lines.push("| Order | Menu ID | 메뉴명 | Screen 수 | DS No. 수 | 상태 | 이슈 수 |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const r of rows) {
    lines.push(`| ${String(r.menu.order).padStart(2, "0")} | ${r.menu.menuId} | ${r.menu.menuName} | ${r.screenCount} | ${r.dsNoCount} | ${r.status} | ${r.issues} |`);
  }
  lines.push("");
  lines.push(`Registry 전체 DS No.: ${regTotal}건`);
  lines.push(`총 이슈: ${totalIssues}건`);

  const outDir = mode === "local" ? LOCAL_DELIVERY_ROOT : CLOUD_OUTPUT_DIR;
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "DS_전체_완료_보고서.md");
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
  console.log(lines.join("\n"));
  console.log(`\n보고서 저장: ${outPath}`);
  return { totalIssues, outPath };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.mode) {
    console.error("Usage: node docs/ds/scripts/deliver-ds.mjs <menuId>|--report --mode=local|cloud");
    process.exit(1);
  }

  if (opts.report) {
    const { totalIssues } = buildReport(opts.mode);
    process.exit(totalIssues > 0 ? 1 : 0);
  } else {
    if (!opts.menuId) {
      console.error("Usage: node docs/ds/scripts/deliver-ds.mjs <menuId> --mode=local|cloud");
      process.exit(1);
    }
    const cmp = deliverOne(opts.menuId, opts.mode);
    process.exit(cmp.ok ? 0 : 1);
  }
}

if (path.resolve(process.argv[1] || "") === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
