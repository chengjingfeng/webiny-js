import React, { useCallback, useRef, useEffect } from "react";
import styled from "react-emotion";
import { getLinkRange, TYPE } from "./utils";

const Tooltip = styled("span")({
    position: "fixed",
    display: "none",
    flexDirection: "row",
    top: 20,
    left: 0,
    padding: "2px 5px",
    backgroundColor: "#fff",
    border: "1px solid var(--mdc-theme-secondary)",
    zIndex: 1,
    width: "auto",
    maxWidth: 520,
    a: {
        fontSize: 16
    },
    "> span:not(:first-child)": {
        marginLeft: 10
    }
});

const compressLink = href => {
    const start = href.substr(0, 24);
    const end = href.substr(24).substr(-24);

    return [start, "...", end].join("");
};

const getSelectionRect = () => {
    const native = window.getSelection();
    if (native.type === "None") {
        return { top: 0, left: 0, width: 0, height: 0 };
    }

    const range = native.getRangeAt(0);
    return range.getBoundingClientRect();
};

const LinkTooltip = ({ editor, onChange, activatePlugin }) => {
    const menuRef = useRef(null);
    const link = editor.value.inlines.find(inline => inline.type === "link");
    const { selection } = editor.value;

    useEffect(() => {
        const menu = menuRef.current;

        if (!link && selection.isFocused) {
            menu.style.display = "none";
            return;
        }

        if (!selection.isFocused) {
            // Don't reposition the tooltip;
            // When we attempt to click the button, editor focus is lost.
            return;
        }

        // Calculate position
        if (menu) {
            const editorRect = menu.parentNode.getBoundingClientRect();
            let { top, left, height } = getSelectionRect();

            // Position menu
            const position = { top: top - editorRect.top + height, left: left - editorRect.left };

            menu.style.display = "flex";
            menu.style.top = position.top + "px";
            menu.style.left = position.left + "px";

            const menuRect = menu.getBoundingClientRect();
            const menuRight = left + menuRect.width;
            const diff = editorRect.right - menuRight;
            if (diff < 0) {
                menu.style.left = `${left - editorRect.left + diff}px`;
            }
        }
    });

    const activateLink = useCallback(() => activatePlugin("cms-slate-menu-item-link"));
    const removeLink = useCallback(() => {
        const menu = menuRef.current;
        editor.change(change => {
            // Restore selection
            change.select(getLinkRange(change, change.value.selection)).unwrapInline(TYPE);
            onChange(change);
            menu.style.display = "none";
        });
    });

    const href = link ? link.data.get("href") : "";

    return (
        <Tooltip innerRef={menuRef}>
            <span>
                <a href={href} target={"_blank"}>
                    {href.length > 50 ? compressLink(href) : href}
                </a>
            </span>
            <button onClick={activateLink}>Change</button>
            <button onClick={removeLink}>Remove</button>
        </Tooltip>
    );
};

export default LinkTooltip;
