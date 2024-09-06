import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { CSSProperties, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "./input";

type ComboboxProps = {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholderSelect?: string;
  placeholderSearch?: string;
  placeholderDisabled?: string;
  searchEmpty?: string;
  disabled?: boolean;
  freeText?: boolean;
  className?: string;
};

export function ComboboxFree({
  options,
  value: propValue,
  defaultValue,
  onChange,
  placeholderSelect,
  placeholderDisabled,
  disabled,
  className,
}: ComboboxProps) {
  const isControlled = propValue !== undefined;

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const divRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();

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

  const filteredOptions = useMemo(() => {
    if (value() === "") {
      return options;
    }

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(value().toLowerCase())
    );
  }, [internalValue, propValue, options]);

  const placeholder = () => {
    if (disabled) {
      return placeholderDisabled ?? t("strings:Valitse");
    }

    if (value() === "") {
      return placeholderSelect ?? t("strings:Valitse");
    }
  };

  return (
    <div className={cn("relative", className)} ref={divRef}>
      <Popover open={open} onOpenChange={() => setOpen(false)} modal={false}>
        <PopoverTrigger className="w-full">
          <Input
            className="w-full justify-between"
            value={value()}
            onChange={(e) => {
              onValueChanged(e.target.value);
            }}
            placeholder={placeholder()}
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => {
              e.preventDefault();

              if (e.key === "ArrowDown") {
                contentRef.current.focus();
              }
            }}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            onClear={() => {
              onValueChanged("");
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          withoutPortal
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn("p-0", filteredOptions.length === 0 && "scale-0")}
          style={{ width: `${divRef.current?.offsetWidth ?? 500}px` }}
        >
          <Command>
            <CommandList className="scrollbar scrollbar-thumb-slate-500 scrollbar-w-2">
              <CommandGroup className="w-full">
                {filteredOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onValueChanged(
                        currentValue === value() ? "" : currentValue
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h4 w-4",
                        internalValue === opt.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function Combobox({
  options,
  value: propValue,
  defaultValue,
  onChange,
  placeholderSelect,
  placeholderSearch,
  placeholderDisabled,
  searchEmpty,
  disabled,
  className,
}: ComboboxProps) {
  const isControlled = propValue !== undefined;

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const divRef = useRef<HTMLDivElement | null>(null);

  const value = isControlled ? propValue : internalValue;

  const { t } = useTranslation();

  const onSelect = (currentValue: string) => {
    if (onChange) {
      onChange(currentValue);
    }

    if (isControlled) {
      setInternalValue(currentValue);
    }
  };

  const placeholder = () => {
    if (disabled) {
      return placeholderDisabled ?? t("strings:Valitse");
    }

    if (value === "") {
      return placeholderSelect ?? t("strings:Valitse");
    }
  };

  return (
    <div className={className} ref={divRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between font-normal w-full",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder()}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          withoutPortal
          className="w-full p-0"
          style={{ width: `${divRef.current?.offsetWidth ?? 500}px` }}
        >
          <Command
            filter={(value, search) => {
              const item = options.find((option) => option.value === value);

              if (!item) {
                return 0;
              }

              return item.label.toLowerCase().includes(search.toLowerCase())
                ? 1
                : 0;
            }}
          >
            <CommandInput
              placeholder={placeholderSearch ?? t("strings:Etsi...")}
            />
            <CommandList className="scrollbar scrollbar-thumb-slate-500 scrollbar-w-2">
              <CommandEmpty>
                {searchEmpty ?? t("strings:Ei tuloksia")}
              </CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
