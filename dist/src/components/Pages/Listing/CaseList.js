"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@dnd-kit/core");
const sortable_1 = require("@dnd-kit/sortable");
const SortableItem_1 = require("@/components/Pages/Listing/SortableItem");
const modifiers_1 = require("@dnd-kit/modifiers");
const useCases_1 = require("@/hooks/useCases");
const react_1 = require("react");
const Item_1 = require("./Item");
const react_dom_1 = require("react-dom");
const react_2 = require("@gsap/react");
const gsap_1 = require("gsap");
function CaseList() {
    const [activeId, setActiveId] = (0, react_1.useState)(null);
    const [overId, setOverId] = (0, react_1.useState)(null);
    const [cases, updateCases] = (0, useCases_1.useCases)();
    const sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.PointerSensor), (0, core_1.useSensor)(core_1.KeyboardSensor, { coordinateGetter: sortable_1.sortableKeyboardCoordinates }));
    (0, react_2.useGSAP)(() => {
        gsap_1.gsap.to("#case-list", {
            x: 0,
            opacity: 1,
            scaleY: 1,
            duration: 0.5,
            ease: "power2.inOut",
        });
    });
    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
        setOverId(active.id);
    }
    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = cases.findIndex((c) => c.id === active.id);
            const newIndex = cases.findIndex((c) => c.id === over.id);
            updateCases((0, sortable_1.arrayMove)(cases, oldIndex, newIndex));
        }
        setActiveId(null);
        setOverId(null);
    }
    function handleDragOver(event) {
        const { over } = event;
        if (over) {
            setOverId(over.id);
        }
    }
    const getDestinationIndex = () => {
        return cases.findIndex((c) => c.id === overId);
    };
    const getOverlayCase = () => {
        const active = cases.find((c) => c.id === activeId);
        if (!active)
            return null;
        return {
            ...active,
            time: new Date(active.time),
        };
    };
    const overlayCase = getOverlayCase();
    const dragIndex = (original) => {
        if (!activeId || !overId || activeId === overId) {
            return original;
        }
        const activeIndex = cases.findIndex((c) => c.id === activeId);
        const overIndex = cases.findIndex((c) => c.id === overId);
        if (activeIndex === original) {
            return getDestinationIndex();
        }
        if (original > activeIndex && original > overIndex) {
            return original;
        }
        if (original > activeIndex && original <= overIndex) {
            return original - 1;
        }
        if (original < activeIndex && original < overIndex) {
            return original;
        }
        if (original < activeIndex && original >= overIndex) {
            return original + 1;
        }
        return original;
    };
    const rootElement = document.getElementById("app");
    return ((0, jsx_runtime_1.jsx)("div", { id: "case-list", className: "flex flex-col gap-4 opacity-0 scaleY-0", children: (0, jsx_runtime_1.jsxs)(core_1.DndContext, { sensors: sensors, collisionDetection: core_1.closestCenter, onDragStart: handleDragStart, onDragOver: handleDragOver, onDragEnd: handleDragEnd, modifiers: [modifiers_1.restrictToVerticalAxis, modifiers_1.restrictToParentElement], children: [(0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: cases, strategy: sortable_1.verticalListSortingStrategy, children: cases.map((c, index) => ((0, jsx_runtime_1.jsx)(SortableItem_1.SortableItem, { item: {
                            ...c,
                            time: new Date(c.time),
                        }, index: dragIndex(index) }, c.id))) }, void 0), rootElement &&
                    (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(core_1.DragOverlay, { children: overlayCase ? ((0, jsx_runtime_1.jsx)(Item_1.Item, { item: overlayCase, index: getDestinationIndex(), className: "dark:border-sy-06" }, void 0)) : null }, void 0), rootElement)] }, void 0) }, void 0));
}
exports.CaseList = CaseList;
//# sourceMappingURL=CaseList.js.map