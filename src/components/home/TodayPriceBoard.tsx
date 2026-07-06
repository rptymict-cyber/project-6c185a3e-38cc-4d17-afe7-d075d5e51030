import type { Crop } from "@/lib/mock/crops";
import { CropPriceCard } from "./CropPriceCard";

export function TodayPriceBoard({ crops }: { crops: Crop[] }) {
  const grades = ["특", "상", "상", "상"];
  return (
    <section className="mt-3">
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1">
        {crops.map((c, i) => (
          <CropPriceCard key={c.id} crop={c} grade={grades[i % grades.length]} />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1">
        <span className="h-1.5 w-4 rounded-full bg-[#3A8A3A]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#DEE2E6]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#DEE2E6]" />
      </div>
    </section>
  );
}
