//@flow
import React from "react";
import { ReactComponent as InvertColorsIcon } from "webiny-app-site-builder/editor/assets/icons/invert_colors.svg";
import Settings from "./Settings";
import Action from "../components/Action";

export default {
    name: "sb-page-element-settings-background",
    type: "sb-page-element-settings",
    renderAction() {
        return <Action plugin={this.name} tooltip={"Background"} icon={<InvertColorsIcon />} />;
    },
    renderMenu({ options }: Object) {
        return <Settings options={options} />;
    }
};