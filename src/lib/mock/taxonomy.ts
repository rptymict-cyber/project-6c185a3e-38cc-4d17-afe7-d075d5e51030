// Varieties (품종) per crop (중분류). Leaf-level items that resolve back
// to the same /market/$crop detail page for MVP.
export const VARIETIES: Record<string, string[]> = {
  apple: ["부사", "홍로", "쓰가루"],
  pear: ["신고", "원황"],
  grape: ["샤인머스캣", "캠벨얼리", "거봉"],
  cabbage: ["봄배추", "고랭지", "월동"],
  lettuce: ["청상추", "적상추"],
  garlic: ["난지형", "한지형", "깐마늘"],
  onion: ["조생종", "중만생종"],
  chili: ["청양", "홍고추"],
  radish: ["봄무", "가을무", "월동무"],
  carrot: ["봄당근", "가을당근"],
  potato: ["수미", "대지"],
  sweetpotato: ["호박고구마", "밤고구마"],
  shiitake: ["생표고", "건표고"],
  enoki: ["일반", "특품"],
  rice: ["일반계", "찰벼"],
  barley: ["겉보리", "쌀보리"],
  soybean: ["백태", "서리태"],
  redbean: ["일반팥"],
};
