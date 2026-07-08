import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  getCategoryIconKey,
  getCropIconKey,
  getCropIconUrl,
  type CropIconKey,
} from "@/lib/crop-icons";

interface CropIconProps {
  /** 작물/품목/품종명. iconKey가 없을 때 이 이름으로 매핑을 조회한다. */
  name?: string | null;
  /** 카테고리 id (fruit/vegetable/...) - 대표 아이콘. */
  categoryId?: string | null;
  /** 직접 iconKey 지정. name/categoryId보다 우선한다. */
  iconKey?: CropIconKey;
  /** px 단위 렌더링 크기. 기본 24. */
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * 작물 대표 SVG 아이콘. 이모지/PNG 대체용.
 */
export const CropIcon = memo(function CropIcon({
  name,
  categoryId,
  iconKey,
  size = 24,
  className,
  alt,
}: CropIconProps) {
  const key: CropIconKey =
    iconKey ??
    (categoryId ? getCategoryIconKey(categoryId) : getCropIconKey(name));
  const url = getCropIconUrl(key);
  return (
    <img
      src={url}
      alt={alt ?? name ?? ""}
      width={size}
      height={size}
      draggable={false}
      className={cn("inline-block select-none object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
});
