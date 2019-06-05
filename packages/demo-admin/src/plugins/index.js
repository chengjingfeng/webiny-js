// @flow
import { fileUploadPlugin, imagePlugin } from "webiny-app/plugins";
import adminPlugins from "webiny-admin/plugins";
import securityPlugins from "webiny-app-security/admin/plugins";
import siteBuilderPlugins from "webiny-app-site-builder/admin/plugins";
import cookiePolicyPlugins from "webiny-app-cookie-policy/admin";
import googleTagManagerPlugins from "webiny-app-google-tag-manager/admin";
import typeformPlugins from "webiny-app-typeform/admin";
import mailchimpPlugins from "webiny-app-mailchimp/admin";
import createBugsnag from "./bugsnag";

const plugins = [
    fileUploadPlugin({}),
    imagePlugin,
    adminPlugins,
    securityPlugins,
    siteBuilderPlugins,
    cookiePolicyPlugins,
    googleTagManagerPlugins,
    typeformPlugins,
    mailchimpPlugins,
    {
        name: "sb-editor-redux-middleware-bugsnag",
        type: "sb-editor-redux-middleware",
        actions: ["Activate element"],
        middleware: createBugsnag()
    }
];

export default plugins;
