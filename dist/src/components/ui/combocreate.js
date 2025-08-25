"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboCreate = exports.ComboCreateCrime = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const command_1 = require("@/components/ui/command");
const popover_1 = require("@/components/ui/popover");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const react_query_1 = require("@tanstack/react-query");
const queries_1 = require("@/hooks/queries");
const queryKeys_1 = require("@/lib/queryKeys");
const tooltip_1 = require("@/components/ui/tooltip");
function ComboCreateCrime({ ...props }) {
    const [query, setQuery] = (0, react_1.useState)("");
    const lang = (0, queries_1.useResolvedLanguage)();
    (0, react_1.useEffect)(() => {
        setQuery("");
    }, [lang]);
    const crimes = (0, react_query_1.useQuery)({
        queryKey: [queryKeys_1.QUERY_KEYS.crimes, lang, query],
        queryFn: async () => await window.api.crimesSearch({ lang, query }),
        placeholderData: react_query_1.keepPreviousData,
    });
    return ((0, jsx_runtime_1.jsx)(ComboCreate, { ...props, options: crimes.data ?? [], onQueryChange: setQuery, triggerClassName: (0, utils_1.cn)(props.value && props.value !== "" && "uppercase font-medium"), minQueryLength: 3 }, void 0));
}
exports.ComboCreateCrime = ComboCreateCrime;
function ComboCreate({ options, value: propValue, defaultValue, className, placeholder: placeholderSelect, placeholderDisabled, onChange, disabled, onQueryChange, triggerClassName, minQueryLength, }) {
    const isControlled = propValue !== undefined;
    const [open, setOpen] = (0, react_1.useState)(false);
    const [internalValue, setInternalValue] = (0, react_1.useState)(defaultValue ?? "");
    const [query, setQuery] = (0, react_1.useState)("");
    const divRef = (0, react_1.useRef)(null);
    const spanRef = (0, react_1.useRef)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        if (open) {
            setQuery("");
            if (onQueryChange) {
                onQueryChange("");
            }
        }
    }, [open]);
    const onValueChanged = (currentValue) => {
        if (onChange) {
            onChange(currentValue);
        }
        setInternalValue(currentValue);
    };
    const value = () => {
        const foundValue = isControlled ? propValue ?? "" : internalValue;
        if (foundValue === "")
            return foundValue;
        const foundOption = options.find((opt) => opt.value === foundValue);
        if (foundOption) {
            return foundOption.label ?? "";
        }
        return foundValue;
    };
    const placeholder = () => {
        if (disabled) {
            return placeholderDisabled ?? t("Valitse");
        }
        if (value() === "") {
            return placeholderSelect ?? t("Valitse");
        }
    };
    const triggerHasOverflow = () => {
        if (spanRef.current) {
            return spanRef.current.scrollWidth > spanRef.current.clientWidth;
        }
        return false;
    };
    const filterAndSortOptions = () => {
        const filtered = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
        const sorted = filtered.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();
            const lowQuery = query.toLowerCase();
            if (labelA.startsWith(lowQuery) && !labelB.startsWith(lowQuery)) {
                return -1;
            }
            if (labelB.startsWith(lowQuery) && !labelA.startsWith(lowQuery)) {
                return 1;
            }
            return 0;
        });
        return sorted;
    };
    const filteredSortedOptions = filterAndSortOptions();
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("block", className), ref: divRef, children: (0, jsx_runtime_1.jsxs)(popover_1.Popover, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: (0, utils_1.cn)("w-full justify-between font-normal", triggerClassName), disabled: disabled, children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("max-w-full overflow-hidden text-ellipsis", value() === "" && "text-muted-foreground"), ref: spanRef, children: value() === "" ? placeholder() : value() }, void 0), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" }, void 0)] }, void 0) }, void 0) }, void 0), triggerHasOverflow() && ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { children: (0, jsx_runtime_1.jsx)("p", { children: value() }, void 0) }, void 0))] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { className: "p-0", style: { width: `${divRef.current?.offsetWidth ?? 500}px` }, children: (0, jsx_runtime_1.jsxs)(command_1.Command, { shouldFilter: false, children: [(0, jsx_runtime_1.jsx)(command_1.CommandInput, { placeholder: placeholder(), value: query, onValueChange: (value) => {
                                    setQuery(value);
                                    if (onQueryChange) {
                                        onQueryChange(value);
                                    }
                                }, icon: (0, jsx_runtime_1.jsx)(lucide_react_1.TextSearch, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }, void 0), onClear: () => {
                                    setQuery("");
                                    if (onQueryChange) {
                                        onQueryChange("");
                                    }
                                } }, void 0), (0, jsx_runtime_1.jsx)(command_1.CommandList, { className: (0, utils_1.cn)("scrollbar scrollbar-thumb-slate-500 scrollbar-w-2"), children: !minQueryLength || query.length >= minQueryLength ? ((0, jsx_runtime_1.jsxs)(command_1.CommandGroup, { children: [query !== "" &&
                                            !options.find((option) => option.label.toLowerCase() === query.toLowerCase()) && ((0, jsx_runtime_1.jsxs)(command_1.CommandItem, { value: query, onSelect: () => {
                                                if (onChange) {
                                                    const found = options.find((option) => option.label.toLowerCase() ===
                                                        query.toLowerCase());
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
                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h-4 w-4", value() === query ? "opacity-100" : "opacity-0") }, void 0), query] }, void 0)), filteredSortedOptions.map((option) => ((0, jsx_runtime_1.jsxs)(command_1.CommandItem, { value: option.label, onSelect: () => {
                                                if (onChange) {
                                                    onChange(option.value);
                                                }
                                                setOpen(false);
                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h-4 w-4", value().includes(option.label)
                                                        ? "opacity-100"
                                                        : "opacity-0") }, void 0), (0, jsx_runtime_1.jsx)("span", { className: "w-full max-w-full overflow-hidden", children: option.label }, void 0)] }, option.value)))] }, void 0)) : ((0, jsx_runtime_1.jsx)("p", { className: "p-4 italic text-sm", children: t("Etsintään vaaditaan vähintään 3 merkkiä") }, void 0)) }, void 0)] }, void 0) }, void 0)] }, void 0) }, void 0));
}
exports.ComboCreate = ComboCreate;
//# sourceMappingURL=combocreate.js.map