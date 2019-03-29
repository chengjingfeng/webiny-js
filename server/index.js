const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

require("@babel/register")({
    configFile: path.resolve(__dirname + "/../babel.config.js"),
    only: [/packages|independent/]
});

const functions = [
    {
        root: path.join(process.cwd(), "packages/demo-api"),
        handler: "/src/handler.js",
        path: "/function/api",
        method: "POST"
    },
    {
        root: path.join(process.cwd(), "packages/demo-api"),
        handler: "/src/downloadFile.js",
        path: "/files/:key",
        method: "GET"
    },
    {
        root: path.join(process.cwd(), "packages/demo-api"),
        handler: "/src/uploadFileRequest.js",
        path: "/files",
        method: "POST"
    },
    {
        root: path.join(process.cwd(), "packages/demo-api"),
        handler: "/src/uploadFile.js",
        path: "/files/upload",
        method: "POST"
    }
];

const requestToEvent = req => {
    const event = {
        headers: req.headers,
        path: req.path,
        resource: req.path,
        httpMethod: req.method,
        queryStringParameters: req.query
    };

    if (event.headers["content-type"] === "application/json") {
        event.body = JSON.stringify(req.body);
    }

    return event;
};

app.use(bodyParser.json());

app.all("*", async (req, res, next) => {
    if (req.method !== "OPTIONS") {
        return next();
    }

    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    })
        .status(200)
        .send();
});

functions.forEach(fn => {
    app[fn.method.toLowerCase()](fn.path, async function(req, res) {
        const { handler } = require(path.join(fn.root, fn.handler));

        const event = requestToEvent(req);
        const result = await handler(event, { req });
        res.set(result.headers);
        res.status(result.statusCode).send(result.body);
    });
});

const port = 9000;
app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Webiny API listening on ${port} :)`);
});
