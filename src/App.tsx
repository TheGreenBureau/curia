import "./i18n";
import { createRoot } from "react-dom/client";
import { SyTheme } from "@purplebureau/sy-react";
import { MainView } from "@components/Views/MainView";
import {
  SquarePlus,
  FolderOpen,
  CircleArrowLeft,
  Import,
  Settings,
} from "lucide";
import { registerIcons } from "@purplebureau/sy-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

registerIcons({
  SquarePlus,
  FolderOpen,
  CircleArrowLeft,
  Import,
  Settings,
});

const queryClient = new QueryClient();

const app = document.getElementById("app");
const root = createRoot(app);

root.render(
  <SyTheme>
    <QueryClientProvider client={queryClient}>
      <MainView />
    </QueryClientProvider>
  </SyTheme>
);
