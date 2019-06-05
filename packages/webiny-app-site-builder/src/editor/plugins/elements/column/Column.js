//@flow
import React from "react";
import styled from "react-emotion";
import { css } from "emotion";
import { connect } from "webiny-app-site-builder/editor/redux";
import { compose, withHandlers, pure } from "recompose";
import { IconButton } from "webiny-ui/Button";
import { ElementRoot } from "webiny-app-site-builder/render/components/ElementRoot";
import DropZone from "webiny-app-site-builder/editor/components/DropZone";
import ConnectedElement from "webiny-app-site-builder/editor/components/ConnectedElement";
import { ReactComponent as AddCircleOutline } from "webiny-app-site-builder/editor/assets/icons/baseline-add_circle-24px.svg";
import { dropElement, togglePlugin } from "webiny-app-site-builder/editor/actions";
import { getElement } from "webiny-app-site-builder/editor/selectors";
import ColumnChild from "./ColumnChild";
import ElementAnimation from "webiny-app-site-builder/render/components/ElementAnimation";

const ColumnContainer = styled("div")({
    position: "relative",
    flex: "1 100%",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    zIndex: 20,
    display: "flex"
});

const addIcon = css({
    color: "var(--mdc-theme-secondary)",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "scale(1.3)"
    },
    "&::before, &::after": {
        display: "none"
    }
});

const Column = pure(({ element, dropElement, togglePlugin }) => {
    return (
        <ElementAnimation>
            <ColumnContainer style={{ justifyContent: "center" }}>
                <ElementRoot
                    element={element}
                    className={"webiny-sb-base-element-style webiny-sb-layout-column"}
                    style={{ width: "100%", display: "flex", flexDirection: "column" }}
                >
                    <ConnectedElement elementId={element.id}>
                        {({ id, path, type, elements }) => (
                            <React.Fragment>
                                {!elements.length && (
                                    <DropZone.Center
                                        key={id}
                                        id={id}
                                        type={type}
                                        onDrop={dropElement}
                                    >
                                        <IconButton
                                            className={addIcon + " addIcon"}
                                            icon={<AddCircleOutline />}
                                            onClick={togglePlugin}
                                        />
                                    </DropZone.Center>
                                )}
                                {elements.map((childId, index) => (
                                    <ColumnChild
                                        key={childId}
                                        id={childId}
                                        index={index}
                                        count={elements.length}
                                        last={index === elements.length - 1}
                                        target={{ id, path, type }}
                                    />
                                ))}
                            </React.Fragment>
                        )}
                    </ConnectedElement>
                </ElementRoot>
            </ColumnContainer>
        </ElementAnimation>
    );
});

export default compose(
    connect(
        (state, props) => {
            const element = getElement(state, props.element.id);
            return {
                // $FlowFixMe
                element: { ...element, elements: element.elements.map(id => getElement(state, id)) }
            };
        },
        { dropElement, togglePlugin }
    ),
    withHandlers({
        togglePlugin: ({ togglePlugin, element: { id, path, type } }) => () => {
            togglePlugin({
                name: "sb-toolbar-add-element",
                params: { id, path, type }
            });
        },
        dropElement: ({ dropElement, element: { id, path, type } }) => (source: Object) => {
            dropElement({ source, target: { id, path, type, position: null } });
        }
    })
)(Column);