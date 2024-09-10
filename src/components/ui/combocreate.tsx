import { Check, ChevronsUpDown, TextSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Option } from "@/types/data/options";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useResolvedLanguage } from "@/hooks/queries";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ComboCreateProps = {
  options: Option[];
  value?: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  placeholderDisabled?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  onQueryChange?: (query: string) => void;
  triggerClassName?: string;
  minQueryLength?: number;
};

export function ComboCreateCrime({
  ...props
}: Omit<ComboCreateProps, "options" | "onQueryChange" | "minQueryLength">) {
  const [query, setQuery] = useState("");

  const lang = useResolvedLanguage();
  const crimes = useQuery({
    queryKey: [QUERY_KEYS.crimes, lang, query],
    queryFn: async () => await window.api.crimesSearch({ lang, query }),
    placeholderData: keepPreviousData,
  });

  return (
    <ComboCreate
      {...props}
      options={crimes.data ?? []}
      onQueryChange={setQuery}
      triggerClassName="text-lg uppercase font-medium"
      minQueryLength={3}
    />
  );
}

export function ComboCreate({
  options,
  value: propValue,
  defaultValue,
  className,
  placeholder: placeholderSelect,
  placeholderDisabled,
  onChange,
  disabled,
  onQueryChange,
  triggerClassName,
  minQueryLength,
}: ComboCreateProps) {
  const isControlled = propValue !== undefined;

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [query, setQuery] = useState("");

  const divRef = useRef<HTMLDivElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setQuery("");
      if (onQueryChange) {
        onQueryChange("");
      }
    }
  }, [open]);

  const onValueChanged = (currentValue: string) => {
    if (onChange) {
      onChange(currentValue);
    }

    setInternalValue(currentValue);
  };

  const value = () => {
    const foundValue = isControlled ? propValue ?? "" : internalValue;

    if (foundValue === "") return foundValue;

    const foundOption = options.find((opt) => opt.value === foundValue);

    if (foundOption) {
      return foundOption.label ?? "";
    }

    return foundValue;
  };

  const placeholder = () => {
    if (disabled) {
      return placeholderDisabled ?? t("strings:Valitse");
    }

    if (value() === "") {
      return placeholderSelect ?? t("strings:Valitse");
    }
  };

  const triggerHasOverflow = () => {
    if (spanRef.current) {
      return spanRef.current.scrollWidth > spanRef.current.clientWidth;
    }
    return false;
  };

  return (
    <div className={cn("block", className)} ref={divRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between font-normal",
                    triggerClassName
                  )}
                  disabled={disabled}
                >
                  <span
                    className="max-w-full overflow-hidden text-ellipsis"
                    ref={spanRef}
                  >
                    {value() === "" ? placeholder() : value()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            {triggerHasOverflow() && (
              <TooltipContent>
                <p>{value()}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <PopoverContent
          className="p-0"
          style={{ width: `${divRef.current?.offsetWidth ?? 500}px` }}
        >
          <Command
            filter={(value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            <CommandInput
              placeholder={placeholder()}
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                if (onQueryChange) {
                  onQueryChange(value);
                }
              }}
              icon={<TextSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
              onClear={() => {
                setQuery("");
                if (onQueryChange) {
                  onQueryChange("");
                }
              }}
            />
            <CommandList
              className={cn(
                "scrollbar scrollbar-thumb-slate-500 scrollbar-w-2"
              )}
            >
              {!minQueryLength || query.length >= minQueryLength ? (
                <CommandGroup>
                  {query !== "" &&
                    !options.find(
                      (option) =>
                        option.label.toLowerCase() === query.toLowerCase()
                    ) && (
                      <CommandItem
                        value={query}
                        onSelect={() => {
                          if (onChange) {
                            const found = options.find(
                              (option) =>
                                option.label.toLowerCase() ===
                                query.toLowerCase()
                            );

                            if (found) {
                              setQuery(found.label);
                              if (onQueryChange) {
                                onQueryChange(found.value);
                              }
                              onValueChanged(found.value);
                              setOpen(false);
                              return;
                            }

                            onValueChanged(query);
                          }

                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value() === query ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {query}
                      </CommandItem>
                    )}
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        if (onChange) {
                          onChange(option.value);
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value().includes(option.label)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="w-full max-w-full overflow-hidden">
                        {option.label}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <p className="p-4 italic text-sm">
                  {t("strings:Etsintään vaaditaan vähintään 3 merkkiä")}
                </p>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
