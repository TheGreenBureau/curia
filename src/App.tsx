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
import { CuriaLogo } from "./components/CuriaLogo";
import { Heading } from "./components/ui/headings";
import { useTranslation } from "react-i18next";
import { useStore } from "@/hooks/useStore";

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
  const currentListing = useStore((state) => state.currentListing);
  const resources = useResources();

  const { t } = useTranslation();

  if (resources.isLoading) {
    return (
      <div className="ml-auto mr-auto mt-auto mb-auto w-fit max-w-[80%] flex flex-col justify-center gap-2">
        <CuriaLogo className="w-36 ml-auto mr-auto" />
        <Heading level="h2" className="text-center mt-6">
          {t("Tervetuloa Curiaan!")}
        </Heading>
      </div>
    );
  }

  if (resources.isSuccess) {
    return (
      <div className="overflow-x-hidden relative scrollbar scrollbar-thumb-slate-500 scrollbar-w-2">
        {!currentListing ? <Landing /> : <Listing />}
        <div className={cn("absolute right-8 top-4 flex align-middle gap-2")}>
          <Settings />
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    );
  }
}
