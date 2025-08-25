"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortableItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
const Item_1 = require("./Item");
function SortableItem({ item, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = (0, sortable_1.useSortable)({ id: item.id });
    const style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: "relative",
        opacity: isDragging ? 0 : 1,
    };
    return ((0, jsx_runtime_1.jsx)(Item_1.Item, { item: item, attributes: attributes, listeners: listeners, index: index, style: style, ref: setNodeRef }, void 0));
}
exports.SortableItem = SortableItem;
//# sourceMappingURL=SortableItem.js.map