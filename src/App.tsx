import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import { createRoot } from "react-dom/client";
import { useCurrentListing } from "@/hooks/queries";
import { Landing } from "@/components/Pages/Landing";
import { Listing } from "@/components/Pages/Listing";
import { Settings } from "@/components/Pages/Settings";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./components/LanguageToggle";

const queryClient = new QueryClient();

const app = document.getElementById("app");
const root = createRoot(app);

root.render(<App />);

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
  const current = useCurrentListing();

  return (
    <div className="overflow-hidden relative">
      {!current.data ? <Landing /> : <Listing />}
      <div className={cn("absolute right-8 top-4 flex align-middle gap-2")}>
        <Settings />
        <ModeToggle />
        <LanguageToggle />
      </div>
    </div>
  );
}
