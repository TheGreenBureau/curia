"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimePicker = exports.TimePickerInput = exports.DateTimePicker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const popover_1 = require("@/components/ui/popover");
const utils_1 = require("@/lib/utils");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const lucide_react_1 = require("lucide-react");
const lucide_react_2 = require("lucide-react");
const React = __importStar(require("react"));
const react_1 = require("react");
const select_1 = require("@/components/ui/select");
const react_day_picker_1 = require("react-day-picker");
// ---------- utils start ----------
/**
 * regular expression to check for valid hour format (01-23)
 */
function isValidHour(value) {
    return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}
/**
 * regular expression to check for valid 12 hour format (01-12)
 */
function isValid12Hour(value) {
    return /^(0[1-9]|1[0-2])$/.test(value);
}
/**
 * regular expression to check for valid minute format (00-59)
 */
function isValidMinuteOrSecond(value) {
    return /^[0-5][0-9]$/.test(value);
}
function getValidNumber(value, { max, min = 0, loop = false }) {
    let numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        if (!loop) {
            if (numericValue > max)
                numericValue = max;
            if (numericValue < min)
                numericValue = min;
        }
        else {
            if (numericValue > max)
                numericValue = min;
            if (numericValue < min)
                numericValue = max;
        }
        return numericValue.toString().padStart(2, "0");
    }
    return "00";
}
function getValidHour(value) {
    if (isValidHour(value))
        return value;
    return getValidNumber(value, { max: 23 });
}
function getValid12Hour(value) {
    if (isValid12Hour(value))
        return value;
    return getValidNumber(value, { min: 1, max: 12 });
}
function getValidMinuteOrSecond(value) {
    if (isValidMinuteOrSecond(value))
        return value;
    return getValidNumber(value, { max: 59 });
}
function getValidArrowNumber(value, { min, max, step }) {
    let numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        numericValue += step;
        return getValidNumber(String(numericValue), { min, max, loop: true });
    }
    return "00";
}
function getValidArrowHour(value, step) {
    return getValidArrowNumber(value, { min: 0, max: 23, step });
}
function getValidArrow12Hour(value, step) {
    return getValidArrowNumber(value, { min: 1, max: 12, step });
}
function getValidArrowMinuteOrSecond(value, step) {
    return getValidArrowNumber(value, { min: 0, max: 59, step });
}
function setMinutes(date, value) {
    const minutes = getValidMinuteOrSecond(value);
    date.setMinutes(parseInt(minutes, 10));
    return date;
}
function setSeconds(date, value) {
    const seconds = getValidMinuteOrSecond(value);
    date.setSeconds(parseInt(seconds, 10));
    return date;
}
function setHours(date, value) {
    const hours = getValidHour(value);
    date.setHours(parseInt(hours, 10));
    return date;
}
function set12Hours(date, value, period) {
    const hours = parseInt(getValid12Hour(value), 10);
    const convertedHours = convert12HourTo24Hour(hours, period);
    date.setHours(convertedHours);
    return date;
}
function setDateByType(date, value, type, period) {
    switch (type) {
        case "minutes":
            return setMinutes(date, value);
        case "seconds":
            return setSeconds(date, value);
        case "hours":
            return setHours(date, value);
        case "12hours": {
            if (!period)
                return date;
            return set12Hours(date, value, period);
        }
        default:
            return date;
    }
}
function getDateByType(date, type) {
    if (!date)
        return "00";
    switch (type) {
        case "minutes":
            return getValidMinuteOrSecond(String(date.getMinutes()));
        case "seconds":
            return getValidMinuteOrSecond(String(date.getSeconds()));
        case "hours":
            return getValidHour(String(date.getHours()));
        case "12hours":
            const hours = display12HourValue(date.getHours());
            return getValid12Hour(String(hours));
        default:
            return "00";
    }
}
function getArrowByType(value, step, type) {
    switch (type) {
        case "minutes":
            return getValidArrowMinuteOrSecond(value, step);
        case "seconds":
            return getValidArrowMinuteOrSecond(value, step);
        case "hours":
            return getValidArrowHour(value, step);
        case "12hours":
            return getValidArrow12Hour(value, step);
        default:
            return "00";
    }
}
/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
function convert12HourTo24Hour(hour, period) {
    if (period === "PM") {
        if (hour <= 11) {
            return hour + 12;
        }
        else {
            return hour;
        }
    }
    else if (period === "AM") {
        if (hour === 12)
            return 0;
        return hour;
    }
    return hour;
}
/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
function display12HourValue(hours) {
    if (hours === 0 || hours === 12)
        return "12";
    if (hours >= 22)
        return `${hours - 12}`;
    if (hours % 12 > 9)
        return `${hours}`;
    return `0${hours % 12}`;
}
function genMonths(locale) {
    return Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: (0, date_fns_1.format)(new Date(2021, i), "MMMM", { locale }),
    }));
}
function genYears(yearRange = 50) {
    const today = new Date();
    return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
        value: today.getFullYear() - yearRange + i,
        label: (today.getFullYear() - yearRange + i).toString(),
    }));
}
// ---------- utils end ----------
function Calendar({ className, classNames, showOutsideDays = true, yearRange = 50, ...props }) {
    const locale = React.useMemo(() => {
        let locale = locale_1.enUS;
        const { options, localize, formatLong } = props.locale || {};
        if (options && localize && formatLong) {
            locale = {
                options,
                localize,
                formatLong,
            };
        }
        return locale;
    }, []);
    const MONTHS = React.useMemo(() => {
        return genMonths(locale);
    }, []);
    const YEARS = React.useMemo(() => genYears(yearRange), []);
    return ((0, jsx_runtime_1.jsx)(react_day_picker_1.DayPicker, { showOutsideDays: showOutsideDays, className: (0, utils_1.cn)("p-3", className), classNames: {
            months: "flex flex-col sm:flex-row space-y-4  sm:space-y-0 justify-center",
            month: "flex flex-col items-center space-y-4",
            month_caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center ",
            button_previous: (0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-5 top-5"),
            button_next: (0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-5 top-5"),
            month_grid: "w-full border-collapse space-y-1",
            weekdays: (0, utils_1.cn)("flex", props.showWeekNumber && "justify-end"),
            weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            week: "flex w-full mt-2",
            day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-1",
            day_button: (0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-l-md rounded-r-md"),
            range_end: "day-range-end",
            selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-l-md rounded-r-md",
            today: "text-orange-600 dark:text-orange-400",
            outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            disabled: "text-muted-foreground opacity-50",
            range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            hidden: "invisible",
            ...classNames,
        }, components: {
            Chevron: ({ ...props }) => props.orientation === "left" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }, void 0)) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }, void 0)),
            MonthCaption: ({ calendarMonth }) => {
                return ((0, jsx_runtime_1.jsxs)("div", { className: "inline-flex gap-2", children: [(0, jsx_runtime_1.jsxs)(select_1.Select, { defaultValue: calendarMonth.date.getMonth().toString(), onValueChange: (value) => {
                                const newDate = new Date(calendarMonth.date);
                                newDate.setMonth(Number.parseInt(value, 10));
                                props.onMonthChange?.(newDate);
                            }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-fit gap-1 border-none p-0 focus:bg-accent focus:text-accent-foreground", children: (0, date_fns_1.format)(calendarMonth.date, "MMMM", { locale }) }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: MONTHS.map((month) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: month.value.toString(), children: month.label }, month.value))) }, void 0)] }, void 0), (0, jsx_runtime_1.jsxs)(select_1.Select, { defaultValue: calendarMonth.date.getFullYear().toString(), onValueChange: (value) => {
                                const newDate = new Date(calendarMonth.date);
                                newDate.setFullYear(Number.parseInt(value, 10));
                                props.onMonthChange?.(newDate);
                            }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-fit gap-1 border-none p-0 focus:bg-accent focus:text-accent-foreground", children: (0, date_fns_1.format)(calendarMonth.date, "yyyy") }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: YEARS.map((year) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: year.value.toString(), children: year.label }, year.value))) }, void 0)] }, void 0)] }, void 0));
            },
        }, ...props }, void 0));
}
Calendar.displayName = "Calendar";
const TimePeriodSelect = React.forwardRef(({ period, setPeriod, date, onDateChange, onLeftFocus, onRightFocus }, ref) => {
    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight")
            onRightFocus?.();
        if (e.key === "ArrowLeft")
            onLeftFocus?.();
    };
    const handleValueChange = (value) => {
        setPeriod?.(value);
        /**
         * trigger an update whenever the user switches between AM and PM;
         * otherwise user must manually change the hour each time
         */
        if (date) {
            const tempDate = new Date(date);
            const hours = display12HourValue(date.getHours());
            onDateChange?.(setDateByType(tempDate, hours.toString(), "12hours", period === "AM" ? "PM" : "AM"));
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex h-10 items-center", children: (0, jsx_runtime_1.jsxs)(select_1.Select, { defaultValue: period, onValueChange: (value) => handleValueChange(value), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { ref: ref, className: "w-[65px] focus:bg-accent focus:text-accent-foreground", onKeyDown: handleKeyDown, children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "AM", children: "AM" }, void 0), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "PM", children: "PM" }, void 0)] }, void 0)] }, void 0) }, void 0));
});
TimePeriodSelect.displayName = "TimePeriodSelect";
const TimePickerInput = React.forwardRef(({ className, type = "tel", value, id, name, date = new Date(new Date().setHours(0, 0, 0, 0)), onDateChange, onChange, onKeyDown, picker, period, onLeftFocus, onRightFocus, ...props }, ref) => {
    const [flag, setFlag] = React.useState(false);
    const [prevIntKey, setPrevIntKey] = React.useState("0");
    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
        if (flag) {
            const timer = setTimeout(() => {
                setFlag(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [flag]);
    const calculatedValue = React.useMemo(() => {
        return getDateByType(date, picker);
    }, [date, picker]);
    const calculateNewValue = (key) => {
        /*
         * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
         * The second entered digit will break the condition and the value will be set to 10-12.
         */
        if (picker === "12hours") {
            if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
                return "0" + key;
        }
        return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
    };
    const handleKeyDown = (e) => {
        if (e.key === "Tab")
            return;
        e.preventDefault();
        if (e.key === "ArrowRight")
            onRightFocus?.();
        if (e.key === "ArrowLeft")
            onLeftFocus?.();
        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            const step = e.key === "ArrowUp" ? 1 : -1;
            const newValue = getArrowByType(calculatedValue, step, picker);
            if (flag)
                setFlag(false);
            const tempDate = date ? new Date(date) : new Date();
            onDateChange?.(setDateByType(tempDate, newValue, picker, period));
        }
        if (e.key >= "0" && e.key <= "9") {
            if (picker === "12hours")
                setPrevIntKey(e.key);
            const newValue = calculateNewValue(e.key);
            if (flag)
                onRightFocus?.();
            setFlag((prev) => !prev);
            const tempDate = date ? new Date(date) : new Date();
            onDateChange?.(setDateByType(tempDate, newValue, picker, period));
        }
    };
    return ((0, jsx_runtime_1.jsx)(input_1.Input, { ref: ref, id: id || picker, name: name || picker, className: (0, utils_1.cn)("w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none", className), value: value || calculatedValue, onChange: (e) => {
            e.preventDefault();
            onChange?.(e);
        }, type: type, inputMode: "decimal", onKeyDown: (e) => {
            onKeyDown?.(e);
            handleKeyDown(e);
        }, ...props }, void 0));
});
exports.TimePickerInput = TimePickerInput;
TimePickerInput.displayName = "TimePickerInput";
const TimePicker = React.forwardRef(({ date: propDate, onChange, hourCycle = 24, granularity = "second", icon, disabled, }, ref) => {
    const date = propDate ? new Date(propDate) : null;
    const minuteRef = React.useRef(null);
    const hourRef = React.useRef(null);
    const secondRef = React.useRef(null);
    const periodRef = React.useRef(null);
    const [period, setPeriod] = React.useState(date && date.getHours() >= 12 ? "PM" : "AM");
    (0, react_1.useImperativeHandle)(ref, () => ({
        minuteRef: minuteRef.current,
        hourRef: hourRef.current,
        secondRef: secondRef.current,
        periodRef: periodRef.current,
    }), [minuteRef, hourRef, secondRef]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [icon && ((0, jsx_runtime_1.jsx)("label", { htmlFor: "datetime-picker-hour-input", className: "cursor-pointer", children: (0, jsx_runtime_1.jsx)(lucide_react_2.Clock, { className: "mr-2 h-4 w-4" }, void 0) }, void 0)), (0, jsx_runtime_1.jsx)(TimePickerInput, { disabled: disabled, className: "font-firasans font-semibold", picker: hourCycle === 24 ? "hours" : "12hours", date: date, id: "datetime-picker-hour-input", onDateChange: onChange, ref: hourRef, period: period, onRightFocus: () => minuteRef.current?.focus() }, void 0), (granularity === "minute" || granularity === "second") && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [":", (0, jsx_runtime_1.jsx)(TimePickerInput, { disabled: disabled, className: "font-firasans font-semibold", picker: "minutes", date: date, onDateChange: onChange, ref: minuteRef, onLeftFocus: () => hourRef.current?.focus(), onRightFocus: () => secondRef.current?.focus() }, void 0)] }, void 0)), granularity === "second" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [":", (0, jsx_runtime_1.jsx)(TimePickerInput, { picker: "seconds", date: date, onDateChange: onChange, ref: secondRef, onLeftFocus: () => minuteRef.current?.focus(), onRightFocus: () => periodRef.current?.focus() }, void 0)] }, void 0)), hourCycle === 12 && ((0, jsx_runtime_1.jsx)("div", { className: "grid gap-1 text-center", children: (0, jsx_runtime_1.jsx)(TimePeriodSelect, { period: period, setPeriod: setPeriod, date: date, onDateChange: (date) => {
                        onChange?.(date);
                        if (date && date?.getHours() >= 12) {
                            setPeriod("PM");
                        }
                        else {
                            setPeriod("AM");
                        }
                    }, ref: periodRef, onLeftFocus: () => secondRef.current?.focus() }, void 0) }, void 0))] }, void 0));
});
exports.TimePicker = TimePicker;
TimePicker.displayName = "TimePicker";
const DateTimePicker = React.forwardRef(({ locale = locale_1.enUS, value: propValue, onChange, hourCycle = 24, yearRange = 50, disabled = false, displayFormat, granularity = "second", placeholder = "Pick a date", ...props }, ref) => {
    const value = propValue ? new Date(propValue) : null;
    const [month, setMonth] = React.useState(value ?? new Date());
    const buttonRef = (0, react_1.useRef)(null);
    /**
     * carry over the current time when a user clicks a new day
     * instead of resetting to 00:00
     */
    const handleSelect = (newDay) => {
        if (!newDay)
            return;
        if (!value) {
            onChange?.(newDay);
            setMonth(newDay);
            return;
        }
        const diff = newDay.getTime() - value.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const newDateFull = (0, date_fns_1.add)(value, { days: Math.ceil(diffInDays) });
        onChange?.(newDateFull);
        setMonth(newDateFull);
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        ...buttonRef.current,
        value,
    }), [value]);
    const initHourFormat = {
        hour24: displayFormat?.hour24 ?? "PPP HH:mm:ss",
        hour12: displayFormat?.hour12 ?? "PP hh:mm:ss b",
    };
    let loc = locale_1.enUS;
    const { options, localize, formatLong } = locale;
    if (options && localize && formatLong) {
        loc = {
            ...locale_1.enUS,
            options,
            localize,
            formatLong,
        };
    }
    return ((0, jsx_runtime_1.jsxs)(popover_1.Popover, { children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { asChild: true, disabled: disabled, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "default", className: (0, utils_1.cn)("justify-start text-left font-normal w-full", !value && "text-muted-foreground"), ref: buttonRef, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-2 h-4 w-4" }, void 0), value ? ((0, date_fns_1.format)(value, hourCycle === 24
                            ? initHourFormat.hour24
                            : initHourFormat.hour12, {
                            locale: loc,
                        })) : ((0, jsx_runtime_1.jsx)("span", { children: placeholder }, void 0))] }, void 0) }, void 0), (0, jsx_runtime_1.jsxs)(popover_1.PopoverContent, { className: "w-auto p-0", children: [(0, jsx_runtime_1.jsx)(Calendar, { mode: "single", selected: value ?? undefined, month: month, onSelect: (d) => handleSelect(d), onMonthChange: handleSelect, yearRange: yearRange, locale: locale, ...props }, void 0), granularity !== "day" && ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-border p-3", children: (0, jsx_runtime_1.jsx)(TimePicker, { onChange: onChange, date: value, hourCycle: hourCycle, granularity: granularity }, void 0) }, void 0))] }, void 0)] }, void 0));
});
exports.DateTimePicker = DateTimePicker;
DateTimePicker.displayName = "DateTimePicker";
//# sourceMappingURL=date-time-picker.js.map