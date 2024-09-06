import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const [language, setLanguage] = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span
            className={cn(
              "absolute scale-100 transition-all duration-150 text-center",
              language === "sv" && "scale-0"
            )}
          >
            FI
          </span>
          <span
            className={cn(
              "absolute scale-0 transition-all duration-150 text-center",
              language === "sv" && "scale-100"
            )}
          >
            SV
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("fi")}>
          Suomi
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("sv")}>
          Svenska
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
