const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

const functions = [
    {
        root: path.join(process.cwd(), "packages/demo-api"),
        handler: "/src/handler.js",
        path: "/function/api"
    }
];

const requestToEvent = req => {
    return {
        headers: req.headers,
        path: req.path,
        resource: req.path,
        httpMethod: req.method,
        queryStringParameters: req.query,
        body: JSON.stringify(req.body)
    };
};

app.use(cors());
app.use(bodyParser.json());

app.all("*", async (req, res) => {
    const fn = functions.find(fn => fn.path === req.path);

    if (!fn) {
        res.json({ data: "NOT_FOUND" });
        return;
    }

    require("@babel/register")({
        configFile: path.resolve(__dirname + "/../babel.config.js"),
        only: [/packages|independent/]
    });

    const { handler } = require(path.join(fn.root, fn.handler));

    const event = requestToEvent(req);
    const result = await handler(event, {});

    res.set(result.headers);
    res.status(result.statusCode).send(result.body);
});

const port = 9000;
app.listen(port, () => {
    console.log(`Listening on ${port} :)`);
});
