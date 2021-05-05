import qs from "querystring";
import multipart from "multiparty"

class BodyParser {
    #types = {
        "application/json": this.#json,
        "application/x-www-form-urlencoded": this.#XWwwFormUrlencoded,
        "multipart/form-data": this.#formData
    };

    constructor(request) {
        const contentType = request.headers['content-type'],
            [ type ] = contentType.split(";");
        return new Promise((resolve, reject) => {
            if(!type || !this.#types.hasOwnProperty(type)) {
                return reject("Unsupported content-type");
            } else {
                this.#types[type].call(this, request)
                    .then(({ fields, files }) => resolve({ data: fields, files: files || null }))
                    .catch(e => {
                        console.log(e);
                        reject(e)
                    });
            }
        });
    }

    async #json(request) {
        try {
            const body = await this.#loadBody(request);
            return { fields: JSON.parse(body) };
        } catch (e) {
            throw new Error(e);
        }

    }

    async #XWwwFormUrlencoded(request) {
        try {
            const body = await this.#loadBody(request);
            return { fields: qs.parse(body, "&") };
        } catch (e) {
            throw new Error(e);
        }
    };

    #formData(request) {
        const form = new multipart.Form();
        return new Promise((resolve, reject) => {
            request.useOrigin((req) => {
                form.parse(req, (err, fields, files) => {
                    if(err) reject(err);
                    else resolve({ fields, files });
                });
            });
        });
    }

    #loadBody(request) {
        const body = [];
        return new Promise((resolve) => {
            request.on("data", (chunk) => body.push(chunk))
                .on("end", () => resolve(Buffer.concat(body).toString()));
        });
    }
}

export default BodyParser;