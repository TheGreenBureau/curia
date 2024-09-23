import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createRoot } from "react-dom/client";
import { Landing } from "@/components/Pages/Landing";
import { Listing } from "@/components/Pages/Listing";
import { Settings } from "@/components/Pages/Settings";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useResources } from "@/hooks/useResources";
import { CuriaLogo, CuriaLogoSVG } from "./components/CuriaLogo";
import { Heading } from "./components/ui/headings";
import { useTranslation } from "react-i18next";
import { useStore } from "@/hooks/useStore";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useLanguage } from "./hooks/useLanguage";
import { RoughEase } from "gsap/EasePack";

gsap.registerPlugin(useGSAP, RoughEase);

const queryClient = new QueryClient();

const app = document.getElementById("app");

if (app) {
  const root = createRoot(app);
  root.render(<App />);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="curia-ui-theme">
        <Pages />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function Pages() {
  const [initialRender, setInitialRender] = useState(true);
  const currentListing = useStore((state) => state.currentListing);
  const resources = useResources();

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setInitialRender(false);
        },
      });

      tl.to(".main-loading", {
        opacity: 1,
        delay: 0.5,
        ease: "power2.inOut",
        duration: 2,
      });

      tl.to(
        "#curia-loading-logo",
        {
          scale: 1,
          duration: 2,
          ease: "power1.out",
        },
        "<"
      );

      tl.to(
        "#curia-loading-heading",
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "+1.9"
      );

      tl.to("#curia-loading-heading", {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
      });

      tl.to(".main-loading", {
        height: "auto",
        marginTop: "5rem",
        duration: 2,
        ease: "power3.inOut",
      });
    },
    {
      dependencies: [],
      scope: container,
    }
  );

  const { t } = useTranslation();

  return (
    <div ref={container}>
      {initialRender && (
        <div className="ml-auto mr-auto mt-auto mb-auto w-fit max-w-[80%] flex flex-col justify-center gap-2 h-screen main-loading opacity-0">
          <CuriaLogoSVG
            className="w-36 ml-auto mr-auto scale-[5]"
            id="curia-loading-logo"
          />
          <Heading
            level="h2"
            className="text-center mt-6 opacity-0"
            id="curia-loading-heading"
          >
            {t("Tervetuloa Curiaan!")}
          </Heading>
        </div>
      )}
      {!initialRender && resources.isSuccess && (
        <div className="overflow-x-hidden relative scrollbar scrollbar-thumb-slate-500 scrollbar-w-2">
          {!currentListing ? <Landing /> : <Listing />}
          <div className={cn("absolute right-8 top-4 flex align-middle gap-2")}>
            <Settings />
            <ModeToggle />
            <LanguageToggle />
          </div>
        </div>
      )}
    </div>
  );
}
