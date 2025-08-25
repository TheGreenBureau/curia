"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combobox = exports.ComboboxFree = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const command_1 = require("@/components/ui/command");
const popover_1 = require("@/components/ui/popover");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const input_1 = require("./input");
function ComboboxFree({ options, value: propValue, defaultValue, onChange, placeholderSelect, placeholderDisabled, disabled, className, }) {
    const isControlled = propValue !== undefined;
    const [open, setOpen] = (0, react_1.useState)(false);
    const [internalValue, setInternalValue] = (0, react_1.useState)(defaultValue ?? "");
    const divRef = (0, react_1.useRef)(null);
    const contentRef = (0, react_1.useRef)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
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
    const filteredOptions = (0, react_1.useMemo)(() => {
        if (value() === "") {
            return options;
        }
        return options.filter((opt) => opt.label.toLowerCase().includes(value().toLowerCase()));
    }, [internalValue, propValue, options]);
    const placeholder = () => {
        if (disabled) {
            return placeholderDisabled ?? t("Valitse");
        }
        if (value() === "") {
            return placeholderSelect ?? t("Valitse");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("relative", className), ref: divRef, children: (0, jsx_runtime_1.jsxs)(popover_1.Popover, { open: open, onOpenChange: () => setOpen(false), modal: false, children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { className: "w-full", children: (0, jsx_runtime_1.jsx)(input_1.Input, { className: "w-full justify-between", value: value(), onChange: (e) => {
                            onValueChanged(e.target.value);
                        }, placeholder: placeholder(), onClick: (e) => e.stopPropagation(), onKeyUp: (e) => {
                            e.preventDefault();
                            if (e.key === "ArrowDown" && contentRef.current) {
                                contentRef.current.focus();
                            }
                        }, onFocus: () => setOpen(true), disabled: disabled, onClear: () => {
                            onValueChanged("");
                        } }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { withoutPortal: true, onOpenAutoFocus: (e) => e.preventDefault(), className: (0, utils_1.cn)("p-0", filteredOptions.length === 0 && "scale-0"), style: { width: `${divRef.current?.offsetWidth ?? 500}px` }, children: (0, jsx_runtime_1.jsx)(command_1.Command, { children: (0, jsx_runtime_1.jsx)(command_1.CommandList, { className: "scrollbar scrollbar-thumb-slate-500 scrollbar-w-2", children: (0, jsx_runtime_1.jsx)(command_1.CommandGroup, { className: "w-full", children: filteredOptions.map((opt) => ((0, jsx_runtime_1.jsxs)(command_1.CommandItem, { value: opt.value, onSelect: (currentValue) => {
                                        setOpen(false);
                                        onValueChanged(currentValue === value() ? "" : currentValue);
                                    }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h4 w-4", internalValue === opt.value
                                                ? "opacity-100"
                                                : "opacity-0") }, void 0), opt.label] }, opt.value))) }, void 0) }, void 0) }, void 0) }, void 0)] }, void 0) }, void 0));
}
exports.ComboboxFree = ComboboxFree;
function Combobox({ options, value: propValue, defaultValue, onChange, placeholderSelect, placeholderSearch, placeholderDisabled, searchEmpty, disabled, className, }) {
    const isControlled = propValue !== undefined;
    const [open, setOpen] = (0, react_1.useState)(false);
    const [internalValue, setInternalValue] = (0, react_1.useState)(defaultValue ?? "");
    const divRef = (0, react_1.useRef)(null);
    const value = isControlled ? propValue : internalValue;
    const { t } = (0, react_i18next_1.useTranslation)();
    const onSelect = (currentValue) => {
        if (onChange) {
            onChange(currentValue);
        }
        if (isControlled) {
            setInternalValue(currentValue);
        }
    };
    const placeholder = () => {
        if (disabled) {
            return placeholderDisabled ?? t("Valitse");
        }
        if (value === "") {
            return placeholderSelect ?? t("Valitse");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: className, ref: divRef, children: (0, jsx_runtime_1.jsxs)(popover_1.Popover, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { disabled: disabled, asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: (0, utils_1.cn)("justify-between font-normal w-full", !value && "text-muted-foreground"), disabled: disabled, children: value
                            ? options.find((opt) => opt.value === value)?.label
                            : placeholder() }, void 0) }, void 0), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { withoutPortal: true, className: "w-full p-0", style: { width: `${divRef.current?.offsetWidth ?? 500}px` }, children: (0, jsx_runtime_1.jsxs)(command_1.Command, { filter: (value, search) => {
                            const item = options.find((option) => option.value === value);
                            if (!item) {
                                return 0;
                            }
                            return item.label.toLowerCase().includes(search.toLowerCase())
                                ? 1
                                : 0;
                        }, children: [(0, jsx_runtime_1.jsx)(command_1.CommandInput, { placeholder: placeholderSearch ?? t("Etsi...") }, void 0), (0, jsx_runtime_1.jsxs)(command_1.CommandList, { className: "scrollbar scrollbar-thumb-slate-500 scrollbar-w-2 max-h-48", children: [(0, jsx_runtime_1.jsx)(command_1.CommandEmpty, { children: searchEmpty ?? t("Ei tuloksia") }, void 0), (0, jsx_runtime_1.jsx)(command_1.CommandGroup, { children: options.map((opt) => ((0, jsx_runtime_1.jsxs)(command_1.CommandItem, { value: opt.value, onSelect: (currentValue) => {
                                                onSelect(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: (0, utils_1.cn)("mr-2 h4 w-4", value === opt.value ? "opacity-100" : "opacity-0") }, void 0), opt.label] }, opt.value))) }, void 0)] }, void 0)] }, void 0) }, void 0)] }, void 0) }, void 0));
}
exports.Combobox = Combobox;
//# sourceMappingURL=combobox.js.map