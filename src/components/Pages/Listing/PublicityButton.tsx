import { Row } from "@/components/ui/rowcol";
import { cn } from "@/lib/utils";
import { NotePublicity } from "@/types/data/case";
import { useTranslation } from "react-i18next";
import { Lock, Globe, Section } from "lucide-react";

type PublicityButtonProps = {
  publicity: NotePublicity;
  onClick: () => void;
  className?: string;
};

export function PublicityButton({
  publicity,
  onClick,
  className,
}: PublicityButtonProps) {
  const { t } = useTranslation();

  const color = () => {
    switch (publicity) {
      case "public":
        return "text-sky-600 dark:text-sky-400";
      case "prosecutor":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "";
    }
  };

  const buttonClasses = "h-4 w-4 cursor-pointer hover:opacity-80";

  const Icon = () => {
    switch (publicity) {
      case "private":
        return <Lock className={buttonClasses} />;
      case "public":
        return <Globe className={buttonClasses} />;
      case "prosecutor":
        return <Section className={buttonClasses} />;
      default:
        return null;
    }
  };

  return (
    <Row
      className={cn(
        "cursor-pointer hover:opacity-80 transition-opacity duration-200 gap-2 items-center font-semibold",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("transition-colors duration-100", color())}>
        <Icon />
      </div>
      <span
        className={cn("select-none transition-colors duration-100", color())}
      >
        {t(publicity)}
      </span>
    </Row>
  );
}
