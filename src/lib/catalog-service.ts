/**
 * 카탈로그 조회 서비스 - 부류/품목/품종 데이터에 대한 유일한 접근 경로.
 *
 * 컴포넌트는 CATEGORIES / ITEMS 배열을 직접 filter/find 하지 말고
 * 반드시 이 파일의 함수만 사용한다.
 */
import {
  CATEGORIES,
  ITEMS,
  type Category,
  type Item,
  type Variety,
} from "@/lib/mock/catalog";

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === categoryId);
}

export function getItemsByCategory(categoryId: string): Item[] {
  return ITEMS.filter((i) => i.categoryId === categoryId);
}

export function getItemById(itemId: string): Item | undefined {
  return ITEMS.find((i) => i.id === itemId);
}

export function getVarietyById(
  itemId: string,
  varietyId: string,
): Variety | undefined {
  return getItemById(itemId)?.varieties.find((v) => v.id === varietyId);
}

export interface SearchResult {
  category: Category;
  item: Item;
  variety?: Variety;
}

/**
 * 부류·품목·품종명을 크로스 검색한다.
 * - 부류명 매칭 시: 해당 부류의 모든 품목이 결과로 포함된다.
 * - 품목명 매칭 시: 상위 부류와 함께 반환.
 * - 품종명 매칭 시: 상위 부류·품목·매칭된 품종이 함께 반환.
 */
export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];
  const pushed = new Set<string>();
  const push = (r: SearchResult) => {
    const key = `${r.category.id}:${r.item.id}:${r.variety?.id ?? ""}`;
    if (pushed.has(key)) return;
    pushed.add(key);
    results.push(r);
  };

  for (const category of CATEGORIES) {
    const categoryHit = category.name.toLowerCase().includes(q);
    for (const item of ITEMS) {
      if (item.categoryId !== category.id) continue;
      const itemHit = item.name.toLowerCase().includes(q);
      const varietyHits = item.varieties.filter((v) =>
        v.name.toLowerCase().includes(q),
      );

      if (categoryHit || itemHit) {
        push({ category, item });
      }
      for (const variety of varietyHits) {
        push({ category, item, variety });
      }
    }
  }

  return results;
}
