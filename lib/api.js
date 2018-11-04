const { parse, pageTags } = require("./parser.js");
const fetch = require("node-fetch");

module.exports = class Api {
    constructor(url) {
        url = url || 'https://https://192.168.1.30/cgi-bin/user_session.ggi';
        this.makeRequest = function (request) {
            const { URLSearchParams } = require('url');

            const params = new URLSearchParams();
            Object.getOwnPropertyNames(paramys)
                .forEach(k => request.append(k, request[k]))

            return fetch(url, { method: 'POST', body: request });
        }
    }

    login(username, password) {
        return new Promise((reject, resolve) => {
            if (!username && !password) {
                throw Error("invalid username and password");
            }

            const params = {
                user: username,
                passwd: password
            }

            return this.makeRequest(params).then(html => {
                const { data, type } = parse(html);
                if (type === pageTags.session) {
                    resolve(data);
                }

                if (type === pageTags.confirmOverride) {

                }
            })
        });
    }

    logout() {

    }
}