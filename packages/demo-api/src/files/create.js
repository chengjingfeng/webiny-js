// @flow
import uniqueId from "uniqid";
import mime from "mime-types";
import sanitizeFilename from "sanitize-filename";

const create = async (options: Object) => {
    const { name } = options;

    if (!name) {
        return {
            code: "FILE_UPLOAD_FAILED",
            data: {
                message: `File "name" missing.`
            }
        };
    }

    const contentType = mime.lookup(name);
    if (!contentType) {
        return {
            code: "FILE_UPLOAD_FAILED",
            data: {
                message: `File's content type could not be resolved.`
            }
        };
    }

    let key = sanitizeFilename(name);
    if (key) {
        key = uniqueId() + "_" + key;
    }

    // Replace all whitespace.
    key = key.replace(/\s/g, "");

    return {
        code: "FILE_UPLOAD_SUCCESS",
        data: {
            file: {
                name,
                src: "/files/" + name
            },
            s3: {
                url: "/files/upload",
                fields: {
                    "Content-Type": "image/jpeg",
                    key
                }
            }
        }
    };
};

export default create;
