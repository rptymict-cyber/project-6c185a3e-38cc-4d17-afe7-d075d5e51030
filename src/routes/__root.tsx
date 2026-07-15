import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { RatePromptModal } from "../components/RatePromptModal";


function NotFoundComponent() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-3 text-lg font-semibold">페이지를 찾을 수 없어요</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          주소가 잘못되었거나 이동된 페이지입니다.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold">페이지를 불러오지 못했어요</h1>
        <p className="mt-2 text-sm text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold"
          >
            홈으로
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "AGDICT — 오늘의 농산물 시세" },
      {
        name: "description",
        content:
          "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:title", content: "AGDICT — 오늘의 농산물 시세" },
      {
        property: "og:description",
        content: "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AGDICT — 오늘의 농산물 시세" },
      { name: "twitter:description", content: "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ae4910b9-2e18-4c04-88db-709f4587f941/id-preview-092334a8--6c185a3e-38cc-4d17-afe7-d075d5e51030.lovable.app-1784076197777.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ae4910b9-2e18-4c04-88db-709f4587f941/id-preview-092334a8--6c185a3e-38cc-4d17-afe7-d075d5e51030.lovable.app-1784076197777.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // 앱 진입 시 OS 위치 권한 요청 (세션당 1회)
    import("../store/location").then(({ useLocation }) => {
      useLocation.getState().request();
    });
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <RatePromptModal />
      <Toaster
        position="bottom-center"
        offset={68}
        mobileOffset={68}
        theme="dark"
        closeButton={false}
        toastOptions={{
          style: {
            background: "#212529",
            color: "#FFFFFF",
            border: "none",
          },
        }}
      />
    </QueryClientProvider>

  );
}
