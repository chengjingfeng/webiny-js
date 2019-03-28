/*eslint-disable */
const busboy = require("busboy");
var fs = require("fs");

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type"
};

export default (event, context) => {
    let contentType = event.headers["Content-Type"] || event.headers["content-type"];
    let bb = new busboy({ headers: { "content-type": contentType } });

    bb.on("file", function(fieldname, file /*, filename, encoding, mimetype*/) {
        const pwd: string = (process.env.PWD: any);
        const paths = {
            url: `/files/`,
            folder: `${pwd}/static/`
        };

        const saveTo = paths.folder + "test.png";
        file.pipe(fs.createWriteStream(saveTo, { encoding: "utf8" }));
    })
        .on("field", (fieldname, val) => console.log("Field [%s]: value: %j", fieldname, val))
        .on("finish", () => {
            console.log("Done parsing form!");
            context.succeed({ statusCode: 200, body: "all done", headers });
        })
        .on("error", err => {
            console.log("failed", err);
            context.fail({ statusCode: 500, body: err, headers });
        });

    bb.end(event.body);
};
