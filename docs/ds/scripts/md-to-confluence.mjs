#!/usr/bin/env node
// docs/ds/pages/{menuId}.md → docs/ds/pages/{menuId}-ds-confluence.html 생성 스크립트.
// Usage: node docs/ds/scripts/md-to-confluence.mjs <menuId>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMenuMd } from "./validate-ds.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const DS_DIR = path.join(ROOT, "docs", "ds");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function inlineCode(s) {
  return s.replace(/`([^`]+)`/g, "<code>$1</code>");
}

function buildHtml(menuName, meta, sections, fileList, summaryList) {
  const parts = [];
  parts.push("<!doctype html>");
  parts.push('<html lang="ko">');
  parts.push("<head>");
  parts.push('<meta charset="utf-8">');
  parts.push(`<title>${menuName} DS — Confluence</title>`);
  parts.push(`<style>
  body { font-family: -apple-system, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; color: #1f2328; max-width: 1400px; margin: 0 auto; padding: 24px; line-height: 1.5; }
  h1 { font-size: 22px; border-bottom: 2px solid #3A8A3A; padding-bottom: 8px; }
  h2 { font-size: 16px; margin-top: 32px; background: #F5FAF6; padding: 8px 12px; border-left: 4px solid #3A8A3A; }
  table.ds-table { width: 100%; border-collapse: collapse; font-size: 12.5px; table-layout: fixed; }
  table.ds-table th, table.ds-table td { border: 1px solid #DEE2E6; padding: 6px 8px; text-align: left; vertical-align: top; word-break: break-word; }
  table.ds-table th { background: #EDF2ED; font-weight: 700; }
  td.ds-no { font-family: monospace; white-space: nowrap; }
  td.gubun { white-space: nowrap; }
  code { background: #F1F3F5; padding: 1px 4px; border-radius: 3px; font-size: 0.95em; }
  ul.meta-list, ul.file-list, ul.summary-list { padding-left: 20px; }
  ul.file-list li code { background: none; padding: 0; }
</style>`);
  parts.push("</head>");
  parts.push("<body>");
  parts.push(`<h1>${menuName} DS</h1>`);
  parts.push('  <ul class="meta-list">');
  if (meta["Menu ID"]) parts.push(`    <li>Menu ID: ${meta["Menu ID"]}</li>`);
  if (meta["Registry"]) parts.push(`    <li>Registry: ${meta["Registry"]}</li>`);
  if (meta["Baseline"]) parts.push(`    <li>Baseline: ${meta["Baseline"]}</li>`);
  parts.push("  </ul>");

  for (const sec of sections) {
    const rows = sec.rows.filter((r) => !r.error);
    parts.push("");
    parts.push(`  <h2>${sec.screenId} — ${sec.sectionName} · ${sec.stateLabel}</h2>`);
    parts.push('  <table class="ds-table">');
    parts.push("    <colgroup>");
    parts.push('      <col style="width:8%"><col style="width:13%"><col style="width:18%">');
    parts.push('      <col style="width:9%"><col style="width:37%"><col style="width:15%">');
    parts.push("    </colgroup>");
    parts.push("    <thead>");
    parts.push("      <tr><th>DS No.</th><th>Section명</th><th>Screen ID</th><th>구분</th><th>상세 사양</th><th>비고</th></tr>");
    parts.push("    </thead>");
    parts.push("    <tbody>");
    rows.forEach((row, i) => {
      parts.push("      <tr>");
      parts.push(`        <td class="ds-no">${row.dsNo}</td>`);
      if (i === 0) {
        parts.push(`        <td rowspan="${rows.length}">${sec.sectionName}</td>`);
        parts.push(`        <td rowspan="${rows.length}">${sec.screenId}</td>`);
      }
      parts.push(`        <td class="gubun">${row.gubun}</td>`);
      parts.push(`        <td class="spec">${inlineCode(row.spec)}</td>`);
      parts.push(`        <td class="note">${row.note === "-" ? "-" : inlineCode(row.note)}</td>`);
      parts.push("      </tr>");
    });
    parts.push("    </tbody>");
    parts.push("  </table>");
  }

  parts.push("");
  parts.push("  <h2>분석 파일</h2>");
  parts.push('  <ul class="file-list">');
  for (const f of fileList) parts.push(`    <li><code>${f}</code></li>`);
  parts.push("  </ul>");

  parts.push("");
  parts.push("  <h2>미구현·확인필요 요약</h2>");
  parts.push('  <ul class="summary-list">');
  for (const s of summaryList) parts.push(`    <li>${inlineCode(s)}</li>`);
  parts.push("  </ul>");

  parts.push("");
  parts.push("</body>");
  parts.push("</html>");
  return parts.join("\n");
}

function main() {
  const menuId = process.argv[2];
  if (!menuId) {
    console.error("Usage: node docs/ds/scripts/md-to-confluence.mjs <menuId>");
    process.exit(1);
  }

  const inventory = loadJSON(path.join(DS_DIR, "menu-inventory.json"));
  const menu = inventory.menus.find((m) => m.menuId === menuId);
  if (!menu) {
    console.error(`menu-inventory.json에 ${menuId} 없음`);
    process.exit(1);
  }

  const mdPath = path.join(ROOT, menu.dsFile);
  const text = fs.readFileSync(mdPath, "utf8");
  const { meta, sections, fileList, summaryList } = parseMenuMd(text);

  const html = buildHtml(menu.menuName, meta, sections, fileList, summaryList);
  const outPath = mdPath.replace(/\.md$/, "-ds-confluence.html");
  fs.writeFileSync(outPath, html, "utf8");
  const rowCount = sections.reduce((n, s) => n + s.rows.filter((r) => !r.error).length, 0);
  console.log(`생성됨: ${path.relative(ROOT, outPath)} (${sections.length} screens, ${rowCount} rows)`);
}

main();
