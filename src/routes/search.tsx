import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { CATEGORIES, CROPS, type Crop } from "@/lib/mock/crops";
import { MARKETS, type Market } from "@/lib/mock/markets";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "검색 — AGDICT" },
      { name: "description", content: "작물명, 시장명으로 시세를 검색하세요." },
    ],
  }),
});

const RECENT_KEY = "agdict.recentSearches";
const MAX_RECENT = 10;

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    /* ignore */
  }
}

function SearchPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
    inputRef.current?.focus();
  }, []);

  const query = q.trim().toLowerCase();
  const hasQuery = query.length > 0;

  const cropResults = useMemo<Crop[]>(() => {
    if (!hasQuery) return [];
    return CROPS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        CATEGORY_LABEL[c.category]?.toLowerCase().includes(query),
    ).slice(0, 20);
  }, [query, hasQuery]);

  const marketResults = useMemo<Market[]>(() => {
    if (!hasQuery) return [];
    return MARKETS.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.region.toLowerCase().includes(query),
    ).slice(0, 20);
  }, [query, hasQuery]);

  const noResults = hasQuery && cropResults.length === 0 && marketResults.length === 0;

  // trending: biggest absolute % change today
  const trending = useMemo(() => {
    return [...CROPS]
      .map((c) => ({
        c,
        pct: ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100,
      }))
      .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
      .slice(0, 8)
      .map((x) => x.c);
  }, []);

  const commit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, MAX_RECENT);
    setRecent(next);
    saveRecent(next);
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    saveRecent(next);
  };

  const openCrop = (c: Crop) => {
    commit(c.name);
    navigate({ to: "/market/$crop", params: { crop: c.id } });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
      {/* Search header */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center gap-1 border-b border-[#E9ECEF] bg-background px-2">
        <Link
          to="/"
          aria-label="뒤로"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#F1F3F5] px-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(q);
            }}
            placeholder="작물명, 시장명으로 검색"
            className="h-9 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
          {q.length > 0 && (
            <button
              type="button"
              aria-label="지우기"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="grid h-6 w-6 place-items-center rounded-full bg-[#ADB5BD] text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {hasQuery ? (
          noResults ? (
            <EmptyResults />
          ) : (
            <div className="pt-2">
              {cropResults.length > 0 && (
                <Section title={`작물 (${cropResults.length})`}>
                  <ul className="divide-y divide-border">
                    {cropResults.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => openCrop(c)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface">
                            <CropIcon name={c.name} size={22} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="truncate text-[14px] font-semibold text-foreground"
                                dangerouslySetInnerHTML={{
                                  __html: highlight(c.name, query),
                                }}
                              />
                              <span className="rounded bg-[#F0F9F0] px-1.5 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
                                {CATEGORY_LABEL[c.category]}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted-foreground">
                              <span className="font-data">
                                {c.currentPrice.toLocaleString()}
                              </span>
                              <span>{c.unit}</span>
                            </div>
                          </div>
                          <ChangeBadge current={c.currentPrice} prev={c.prevPrice} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {marketResults.length > 0 && (
                <Section title={`시장 (${marketResults.length})`}>
                  <ul className="divide-y divide-border">
                    {marketResults.map((m) => (
                      <li key={m.id}>
                        <Link
                          to="/market"
                          onClick={() => commit(m.name)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-[16px]">
                            🏪
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className="truncate text-[14px] font-semibold text-foreground"
                              dangerouslySetInnerHTML={{
                                __html: highlight(m.name, query),
                              }}
                            />
                            <div className="text-[12px] text-muted-foreground">
                              {m.region}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )
        ) : (
          <div className="pt-2">
            {recent.length > 0 && (
              <Section
                title="최근 검색어"
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setRecent([]);
                      saveRecent([]);
                    }}
                    className="text-[12px] text-muted-foreground"
                  >
                    전체삭제
                  </button>
                }
              >
                <ul>
                  {recent.map((term) => (
                    <li
                      key={term}
                      className="flex items-center gap-2 px-4 py-2.5"
                    >
                      <SearchIcon className="h-4 w-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setQ(term)}
                        className="flex-1 truncate text-left text-[14px] text-foreground"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        aria-label={`${term} 삭제`}
                        onClick={() => removeRecent(term)}
                        className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section
              title={
                <span className="inline-flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#E03131]" />
                  지금 많이 찾는 작물
                </span>
              }
            >
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {trending.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openCrop(c)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-semibold text-foreground"
                  >
                    <CropIcon name={c.name} size={16} />
                    {c.name}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3">
      <div className="flex items-center justify-between px-4 pb-2">
        <h2 className="text-[12px] font-bold text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ChangeBadge({ current, prev }: { current: number; prev: number }) {
  const diff = current - prev;
  const pct = prev ? (diff / prev) * 100 : 0;
  if (diff === 0) {
    return (
      <span className="rounded bg-[#F1F3F5] px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
        0.0%
      </span>
    );
  }
  const up = diff > 0;
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[11px] font-bold",
        up ? "bg-[#FFF5F5] text-[#E03131]" : "bg-[#EDF2FF] text-[#1971C2]",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F1F3F5]">
        <SearchIcon className="h-7 w-7 text-[#ADB5BD]" />
      </div>
      <p className="mt-4 text-[15px] font-bold text-foreground">
        검색 결과가 없어요
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        다른 키워드로 검색해보세요
      </p>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlight(text: string, query: string) {
  if (!query) return escapeHtml(text);
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return escapeHtml(text);
  const end = idx + query.length;
  return (
    escapeHtml(text.slice(0, idx)) +
    `<mark class="bg-transparent text-[#3A8A3A] font-bold">${escapeHtml(text.slice(idx, end))}</mark>` +
    escapeHtml(text.slice(end))
  );
}
