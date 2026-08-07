#!/usr/bin/env node
// DS 메뉴 MD ↔ screen-registry.json ↔ menu-inventory.json 정합성 검증 스크립트.
// Usage:
//   node docs/ds/scripts/validate-ds.mjs <menuId>   단일 메뉴 검증
//   node docs/ds/scripts/validate-ds.mjs --all      전체 메뉴 + 전역 DS No. 중복 검사

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const DS_DIR = path.join(ROOT, "docs", "ds");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function splitRow(line) {
  const parts = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\\" && line[i + 1] === "|") {
      cur += "|";
      i++;
      continue;
    }
    if (ch === "|") {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  if (parts.length && parts[0].trim() === "") parts.shift();
  if (parts.length && parts[parts.length - 1].trim() === "") parts.pop();
  return parts.map((s) => s.trim());
}

export function parseMenuMd(text) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let current = null;
  let inTable = false;
  let mode = null; // 'files' | 'summary' | null
  const fileList = [];
  const summaryList = [];
  const meta = {};

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const h2 = line.match(/^## (.+?) — (.+?) · (.+)$/);
    if (h2) {
      current = {
        screenId: h2[1].trim(),
        sectionName: h2[2].trim(),
        stateLabel: h2[3].trim(),
        rows: [],
        headerLineNo: lineNo,
      };
      sections.push(current);
      inTable = false;
      mode = null;
      return;
    }
    const h2simple = line.match(/^## (.+)$/);
    if (h2simple) {
      const title = h2simple[1].trim();
      current = null;
      inTable = false;
      if (title === "분석 파일") mode = "files";
      else if (title === "미구현·확인필요 요약") mode = "summary";
      else mode = null;
      return;
    }
    const metaMatch = line.match(/^- (Menu ID|Registry|Baseline): (.+)$/);
    if (metaMatch && !current && mode === null) {
      meta[metaMatch[1]] = metaMatch[2].trim();
      return;
    }
    if (mode === "files") {
      const m = line.match(/^- (.+)$/);
      if (m) fileList.push(m[1].trim());
      return;
    }
    if (mode === "summary") {
      const m = line.match(/^- (.+)$/);
      if (m) summaryList.push(m[1].trim());
      return;
    }
    if (current) {
      if (/^\|\s*DS No\./.test(line)) return; // header row
      if (/^\|\s*---/.test(line)) {
        inTable = true;
        return;
      }
      if (inTable && line.trim().startsWith("|")) {
        const cells = splitRow(line);
        if (cells.length < 6) {
          current.rows.push({ error: `열 개수 부족(${cells.length})`, raw: line, lineNo });
          return;
        }
        const [dsNo, sectionName, screenId, gubun, spec, note] = cells;
        current.rows.push({ dsNo, sectionName, screenId, gubun, spec, note, lineNo });
      }
    }
  });

  return { meta, sections, fileList, summaryList };
}

export function validateMenu(menuId) {
  const inventory = loadJSON(path.join(DS_DIR, "menu-inventory.json"));
  const registry = loadJSON(path.join(DS_DIR, "screen-registry.json"));
  const menu = inventory.menus.find((m) => m.menuId === menuId);
  if (!menu) throw new Error(`menu-inventory.json에 ${menuId} 없음`);

  const mdPath = path.join(ROOT, menu.dsFile);
  if (!fs.existsSync(mdPath)) {
    return { menuId, dsFile: menu.dsFile, ok: false, issues: [`MD 파일 없음: ${menu.dsFile}`], screenCount: 0, dsNoCount: 0, parsed: null };
  }
  const text = fs.readFileSync(mdPath, "utf8");
  const parsed = parseMenuMd(text);

  const issues = [];
  const allDsNos = [];
  const dsNoLineMap = new Map();
  const regScreens = new Map(registry.screens.map((s) => [s.screenId, s]));

  for (const sec of parsed.sections) {
    const regScreen = regScreens.get(sec.screenId);
    if (!regScreen) {
      issues.push(`[${sec.screenId}] registry에 없는 Screen ID (섹션 헤더 line ${sec.headerLineNo})`);
    }
    const mdDsNos = [];
    for (const row of sec.rows) {
      if (row.error) {
        issues.push(`[${sec.screenId}] line ${row.lineNo}: ${row.error} — raw="${row.raw}"`);
        continue;
      }
      allDsNos.push(row.dsNo);
      if (dsNoLineMap.has(row.dsNo)) {
        issues.push(`중복 DS No. ${row.dsNo} (line ${dsNoLineMap.get(row.dsNo)} / line ${row.lineNo})`);
      } else {
        dsNoLineMap.set(row.dsNo, row.lineNo);
      }
      mdDsNos.push(row.dsNo);

      if (row.screenId !== sec.screenId) {
        issues.push(`[${row.dsNo}] line ${row.lineNo}: 행의 Screen ID(${row.screenId})가 섹션 헤더(${sec.screenId})와 다름`);
      }
      if (row.sectionName !== sec.sectionName) {
        issues.push(`[${row.dsNo}] line ${row.lineNo}: 행의 Section명(${row.sectionName})이 섹션 헤더(${sec.sectionName})와 다름`);
      }

      const labelMatches = row.spec.match(/-[^\s:]+\.\d{2}:/g) || [];
      if (labelMatches.length === 0) {
        issues.push(`[${row.dsNo}] 상세 사양에 -라벨.NN: 형식이 없음: "${row.spec.slice(0, 40)}"`);
      } else if (labelMatches.length > 1) {
        issues.push(`[${row.dsNo}] 상세 사양 한 셀에 라벨 ${labelMatches.length}개(복수 라벨): ${labelMatches.join(", ")}`);
      } else if (!row.spec.startsWith(labelMatches[0])) {
        issues.push(`[${row.dsNo}] 상세 사양 라벨이 셀 맨 앞이 아님: "${row.spec.slice(0, 40)}"`);
      }
      if (row.spec.includes("<br>")) {
        issues.push(`[${row.dsNo}] 상세 사양에 <br> 사용됨(금지)`);
      }
      if (/확인\s*필요/.test(row.spec)) {
        issues.push(`[${row.dsNo}] 상세 사양에 "확인 필요" 문구가 있음(비고로 이동 필요)`);
      }
      const noteWarnMatches = row.note.match(/⚠️\s*확인\s*필요[^:]*:/g) || [];
      for (const w of noteWarnMatches) {
        if (!/^⚠️ 확인 필요\.\d{2}:$/.test(w)) {
          issues.push(`[${row.dsNo}] 비고의 확인 필요 표기 형식 오류: "${w}"`);
        }
      }
    }

    if (regScreen) {
      const mdSet = new Set(mdDsNos);
      const regSet = new Set(regScreen.dsNos);
      const missingInMd = regScreen.dsNos.filter((d) => !mdSet.has(d));
      const extraInMd = mdDsNos.filter((d) => !regSet.has(d));
      if (missingInMd.length) issues.push(`[${sec.screenId}] registry에는 있지만 MD에 없는 DS No.: ${missingInMd.join(", ")}`);
      if (extraInMd.length) issues.push(`[${sec.screenId}] MD에는 있지만 registry에 없는 DS No.: ${extraInMd.join(", ")}`);
    }
  }

  const mdScreenIds = new Set(parsed.sections.map((s) => s.screenId));
  const invScreenIds = new Set(menu.screenIds || []);
  const missingScreens = [...invScreenIds].filter((s) => !mdScreenIds.has(s));
  const extraScreens = [...mdScreenIds].filter((s) => !invScreenIds.has(s));
  if (missingScreens.length) issues.push(`menu-inventory에는 있지만 MD에 없는 Screen ID: ${missingScreens.join(", ")}`);
  if (extraScreens.length) issues.push(`MD에는 있지만 menu-inventory에 없는 Screen ID: ${extraScreens.join(", ")}`);

  return {
    menuId,
    dsFile: menu.dsFile,
    screenCount: parsed.sections.length,
    dsNoCount: allDsNos.length,
    ok: issues.length === 0,
    issues,
    parsed,
  };
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node docs/ds/scripts/validate-ds.mjs <menuId>|--all");
    process.exit(1);
  }

  if (arg === "--all") {
    const inventory = loadJSON(path.join(DS_DIR, "menu-inventory.json"));
    const registry = loadJSON(path.join(DS_DIR, "screen-registry.json"));
    let totalIssues = 0;
    const globalDsNoMap = new Map();
    for (const menu of inventory.menus) {
      const mdPath = path.join(ROOT, menu.dsFile);
      if (!fs.existsSync(mdPath)) {
        console.log(`\n⬜ ${menu.menuId} (${menu.menuName}): MD 파일 없음 — 건너뜀`);
        continue;
      }
      const result = validateMenu(menu.menuId);
      console.log(`\n=== ${menu.menuId} (${menu.menuName}) — screens:${result.screenCount} dsNos:${result.dsNoCount} ===`);
      if (result.ok) console.log("OK");
      else {
        result.issues.forEach((i) => console.log("  - " + i));
        totalIssues += result.issues.length;
      }
      for (const sec of result.parsed?.sections || []) {
        for (const row of sec.rows) {
          if (!row.dsNo) continue;
          if (globalDsNoMap.has(row.dsNo) && globalDsNoMap.get(row.dsNo) !== menu.menuId) {
            console.log(`  - [전역 중복] ${row.dsNo}: ${globalDsNoMap.get(row.dsNo)} 와 ${menu.menuId}에 동시 존재`);
            totalIssues++;
          } else {
            globalDsNoMap.set(row.dsNo, menu.menuId);
          }
        }
      }
    }
    const regTotal = registry.screens.reduce((n, s) => n + s.dsNos.length, 0);
    console.log(`\nRegistry 전체 DS No.: ${regTotal}건`);
    console.log(`총 이슈: ${totalIssues}건`);
    process.exit(totalIssues > 0 ? 1 : 0);
  } else {
    const result = validateMenu(arg);
    console.log(`=== ${arg} — screens:${result.screenCount} dsNos:${result.dsNoCount} ===`);
    if (result.ok) {
      console.log("OK: 이슈 없음");
    } else {
      result.issues.forEach((i) => console.log("- " + i));
    }
    process.exit(result.ok ? 0 : 1);
  }
}

if (path.resolve(process.argv[1] || "") === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
