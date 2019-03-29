const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs-extra");
const app = express();
const getPackages = require("get-yarn-workspaces");

require("@babel/register")({
    configFile: path.resolve(__dirname + "/../babel.config.js"),
    only: [/packages|independent/]
});

// Find all Webiny apps in the project (packages containing .webiny file)
const functions = getPackages(process.cwd())
    .filter(pkg => fs.existsSync(pkg + "/.webiny"))
    .map(root => {
        const json = JSON.parse(fs.readFileSync(root + "/.webiny", "utf8"));
        json.handler = "/src/handler.js";
        json.root = root;
        return json;
    });

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
