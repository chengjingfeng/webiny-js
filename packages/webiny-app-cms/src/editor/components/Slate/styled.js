import { css } from "emotion";

export const hoverMenuStyle = css({
    display: "inline-flex",
    padding: 5,
    position: "absolute",
    borderRadius: 2,
    zIndex: 1,
    marginTop: -50,
    backgroundColor: "var(--mdc-theme-surface)",
    span: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: 2,
        svg: {
            height: 18
        }
    },
    "&::after": {
        content: "''",
        width: 0,
        height: 0,
        borderLeft: "7px solid transparent",
        borderRight: "7px solid transparent",
        borderTop: "7px solid var(--mdc-theme-surface)",
        position: "absolute",
        bottom: -7,
        left: "50%",
        transform: "translateX(-50%)"
    }
});

export const defaultStyle = {
    transform: "translateY(-20px)",
    opacity: 0,
    pointerEvents: "all",
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "100ms",
    willChange: "opacity, transform"
};

export const transitionStyles = {
    entering: { transform: "translateY(-20px)", opacity: 0 },
    entered: { transform: "translateY(0px)", opacity: 1 }
};