/**
 * 작물 아이콘 매핑 & 조회.
 *
 * - SVG 파일은 src/assets/crop-icons/ 에 있는 54개(default 포함)만 사용한다.
 * - 신규 이모지/PNG/아이콘 생성 금지. 이 파일을 통해서만 렌더링한다.
 *
 * 사용:
 *   import { CropIcon } from "@/components/crop-icon";
 *   <CropIcon name={crop.name} size={28} />
 */

// eager import all svg URLs
const modules = import.meta.glob("@/assets/crop-icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const URL_BY_KEY: Record<string, string> = {};
for (const path in modules) {
  const key = path.split("/").pop()!.replace(/\.svg$/, "");
  URL_BY_KEY[key] = modules[path];
}

export type CropIconKey = string;

/**
 * CSV(crop-icon-mapping.csv) 기반 매핑.
 * `tokens`는 usedFor에 나온 단어들(+ koreanName). 매칭 시 문자열 포함(includes)으로 판단한다.
 */
type Entry = { key: CropIconKey; koreanName: string; tokens: string[] };

const ENTRIES: Entry[] = [
  { key: "rice", koreanName: "쌀", tokens: ["쌀", "찹쌀", "현미", "흑미", "백미"] },
  { key: "rice-plant", koreanName: "벼", tokens: ["벼", "밭벼", "찰벼", "총체벼"] },
  { key: "barley", koreanName: "보리", tokens: ["보리", "쌀보리", "겉보리", "맥주보리"] },
  { key: "wheat", koreanName: "밀", tokens: ["밀", "우리밀", "소맥"] },
  { key: "soybean", koreanName: "콩", tokens: ["콩", "대두", "풋콩", "완두"] },
  { key: "bean", koreanName: "잡두", tokens: ["팥", "녹두", "강낭콩", "검정콩", "두류"] },
  { key: "corn", koreanName: "옥수수", tokens: ["옥수수", "찰옥수수", "단옥수수"] },
  { key: "potato", koreanName: "감자", tokens: ["감자", "수미감자", "대지감자"] },
  { key: "sweet-potato", koreanName: "고구마", tokens: ["고구마", "밤고구마", "호박고구마", "자색고구마"] },
  { key: "radish", koreanName: "무", tokens: ["무", "알타리무", "순무", "열무"] },
  { key: "carrot", koreanName: "당근", tokens: ["당근", "흙당근", "세척당근"] },
  { key: "lotus-root", koreanName: "연근", tokens: ["연근", "통연근", "절단연근"] },
  { key: "burdock", koreanName: "우엉", tokens: ["우엉", "깐우엉", "채우엉"] },
  { key: "taro", koreanName: "토란", tokens: ["토란", "토란대"] },
  { key: "napa-cabbage", koreanName: "배추", tokens: ["배추", "얼갈이배추", "봄동", "쌈배추"] },
  { key: "cabbage", koreanName: "양배추", tokens: ["양배추", "적양배추"] },
  { key: "lettuce", koreanName: "상추", tokens: ["상추", "청상추", "적상추", "포기상추"] },
  { key: "spinach", koreanName: "시금치", tokens: ["시금치", "섬초", "포항초"] },
  { key: "perilla-leaf", koreanName: "깻잎", tokens: ["깻잎", "들깻잎", "잎채소"] },
  { key: "green-onion", koreanName: "대파", tokens: ["대파", "실파", "쪽파", "깐파"] },
  { key: "onion", koreanName: "양파", tokens: ["양파", "깐양파", "저장양파", "햇양파"] },
  { key: "garlic", koreanName: "마늘", tokens: ["마늘", "깐마늘", "난지마늘", "한지마늘"] },
  { key: "ginger", koreanName: "생강", tokens: ["생강", "햇생강", "구생강"] },
  { key: "chili-pepper", koreanName: "고추", tokens: ["고추", "풋고추", "홍고추", "꽈리고추", "청양"] },
  { key: "tomato", koreanName: "토마토", tokens: ["토마토", "방울토마토", "대추방울토마토"] },
  { key: "cucumber", koreanName: "오이", tokens: ["오이", "백다다기", "취청", "가시오이"] },
  { key: "pumpkin", koreanName: "호박", tokens: ["호박", "애호박", "단호박", "늙은호박"] },
  { key: "eggplant", koreanName: "가지", tokens: ["가지"] },
  { key: "apple", koreanName: "사과", tokens: ["사과", "후지", "홍로", "양광", "아오리"] },
  { key: "pear", koreanName: "배", tokens: ["배", "신고", "원황", "황금배"] },
  { key: "grape", koreanName: "포도", tokens: ["포도", "거봉", "샤인머스캣", "캠벨얼리"] },
  { key: "peach", koreanName: "복숭아", tokens: ["복숭아", "천도복숭아", "백도", "황도"] },
  { key: "citrus", koreanName: "감귤", tokens: ["감귤", "귤", "오렌지", "한라봉", "천혜향", "레드향"] },
  { key: "strawberry", koreanName: "딸기", tokens: ["딸기", "설향", "금실", "죽향", "킹스베리"] },
  { key: "watermelon", koreanName: "수박", tokens: ["수박", "애플수박", "흑수박"] },
  { key: "melon", koreanName: "멜론", tokens: ["멜론", "머스크멜론", "참외"] },
  { key: "persimmon", koreanName: "감", tokens: ["감", "단감", "홍시", "곶감"] },
  { key: "chestnut", koreanName: "밤", tokens: ["밤", "깐밤", "생밤"] },
  { key: "walnut", koreanName: "호두", tokens: ["호두", "피호두", "깐호두"] },
  { key: "jujube", koreanName: "대추", tokens: ["대추", "건대추", "생대추"] },
  { key: "mushroom", koreanName: "버섯", tokens: ["버섯", "느타리", "양송이"] },
  { key: "shiitake", koreanName: "표고버섯", tokens: ["표고", "생표고", "건표고"] },
  { key: "king-oyster-mushroom", koreanName: "새송이버섯", tokens: ["새송이", "큰느타리"] },
  { key: "enoki-mushroom", koreanName: "팽이버섯", tokens: ["팽이", "황금팽이"] },
  { key: "ginseng", koreanName: "인삼", tokens: ["인삼", "수삼", "홍삼"] },
  { key: "sesame", koreanName: "참깨", tokens: ["참깨", "들깨", "깨"] },
  { key: "peanut", koreanName: "땅콩", tokens: ["땅콩", "피땅콩", "깐땅콩"] },
  { key: "tea", koreanName: "차", tokens: ["녹차", "차나무", "찻잎"] },
  { key: "coffee", koreanName: "커피", tokens: ["커피", "커피생두", "커피원두"] },
  { key: "seed", koreanName: "종자", tokens: ["종자", "씨앗", "묘종"] },
  { key: "medicinal-herb", koreanName: "약용잎", tokens: ["약용", "허브"] },
  { key: "medicinal-root", koreanName: "약용뿌리", tokens: ["도라지", "더덕", "황기"] },
  { key: "medicinal-flower", koreanName: "약용꽃", tokens: ["국화", "홍화", "꽃차"] },
];

// 부류(카테고리)용 대표 아이콘.
const CATEGORY_ICON: Record<string, CropIconKey> = {
  fruit: "apple",
  vegetable: "napa-cabbage",
  seasoning: "garlic",
  root: "carrot",
  tuber: "potato",
  mushroom: "mushroom",
  grain: "rice",
  legume: "soybean",
};

// 토큰을 길이 내림차순으로 미리 정렬 → 긴 토큰 우선 매칭
const SORTED_LOOKUP: { key: CropIconKey; token: string }[] = ENTRIES.flatMap((e) =>
  [e.koreanName, ...e.tokens].map((t) => ({ key: e.key, token: t })),
).sort((a, b) => b.token.length - a.token.length);

export function getCropIconKey(name?: string | null): CropIconKey {
  if (!name) return "crop-default";
  const s = name.trim();
  if (!s) return "crop-default";
  // exact koreanName 우선
  const exact = ENTRIES.find((e) => e.koreanName === s);
  if (exact) return exact.key;
  // usedFor / koreanName token 포함
  for (const { key, token } of SORTED_LOOKUP) {
    if (s.includes(token)) return key;
  }
  return "crop-default";
}

export function getCategoryIconKey(categoryId?: string | null): CropIconKey {
  if (!categoryId) return "crop-default";
  return CATEGORY_ICON[categoryId] ?? "crop-default";
}

export function getCropIconUrl(key: CropIconKey): string {
  return URL_BY_KEY[key] ?? URL_BY_KEY["crop-default"];
}

export function resolveCropIconUrl(name?: string | null): string {
  return getCropIconUrl(getCropIconKey(name));
}
