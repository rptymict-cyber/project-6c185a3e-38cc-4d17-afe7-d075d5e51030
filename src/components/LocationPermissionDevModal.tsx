import { MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation } from "@/store/location";

/**
 * ⚠️ 임시 확인용 모달 (제거 대상)
 * 실제 사양은 브라우저(OS)의 네이티브 위치 권한 팝업이다.
 * 러버블 프리뷰(iframe)에서는 보안 정책상 네이티브 팝업이 노출되지 않아
 * 개발 중 흐름 확인이 불가능하므로 이 모달을 임시로 사용한다.
 * 배포(iframe 밖) 환경에서 네이티브 팝업 동작을 확인한 뒤 삭제한다.
 */
export function LocationPermissionDevModal() {
  const open = useLocation((s) => s.promptOpen);
  const resolvePrompt = useLocation((s) => s.resolvePrompt);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resolvePrompt(false);
      }}
    >
      <DialogContent className="w-[300px] rounded-2xl p-0">
        <div className="px-5 pt-5 pb-4 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#3A8A3A14]">
            <MapPin className="h-5 w-5 text-[#3A8A3A]" />
          </div>
          <h2 className="mt-3 text-[15.5px] font-bold text-foreground">
            현재 위치 정보를 사용할까요?
          </h2>
          <p className="mt-1.5 text-[12.5px] leading-[18px] text-muted-foreground">
            가까운 도매시장과 현재 위치 날씨를 안내하는 데 사용됩니다.
          </p>
          <p className="mt-3 rounded-[10px] bg-[#F8F9FA] px-3 py-2 text-[11.5px] leading-[17px] text-[#6C757D]">
            이것은 임시 확인용 화면이며, 실제 배포 환경에서는 브라우저(OS)의
            네이티브 위치 권한 팝업이 대신 표시됩니다.
          </p>
        </div>
        <div className="grid grid-cols-2 border-t border-[#F1F3F5]">
          <button
            type="button"
            onClick={() => resolvePrompt(false)}
            className="py-3.5 text-[14px] font-semibold text-[#6C757D] active:bg-[#F8F9FA]"
          >
            거부
          </button>
          <button
            type="button"
            onClick={() => resolvePrompt(true)}
            className="border-l border-[#F1F3F5] py-3.5 text-[14px] font-bold text-[#3A8A3A] active:bg-[#F8F9FA]"
          >
            허용
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
