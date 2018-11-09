const { parse, pageTags } = require("./parser.js");
const { Agent } = require("https");
const fetch = require("cross-fetch");

module.exports = class Api {
    constructor() {
        this.url = 'https://192.168.1.30/cgi-bin/user_session.ggi';
    }

    __makeRequest__(params) {
        let query = require('querystring').stringify(params);
        let options = {
            method: 'GET',
            /* The server does not send a signed certificate so if `rejectUnauthorized` is not set
             * to false, all calls will fail. This may likely change in the future. */
            agent: new Agent({ rejectUnauthorized: false })
        }
        return fetch(this.url + "?" + query, options)
            .then(result => result.text())
            .then(html => {
                if (!html) {
                    throw new Error("unable to get response from server");
                }
                let meta = parse(html);
                if (!meta) {
                    throw new Error("unable to parse response from server");
                }
                return meta;
            })
    }

    async confirmOverride(username, password) {
        if (!username && !password) {
            throw Error("invalid username and password");
        }
        let params = {
            user: username,
            passwd: password,
            userdelete: "yes",
        }
        const { type, data } = await this.__makeRequest__(params);
        if (type === pageTags.session) {
            return data;
        }
        else {
            throw new Error("an unknown error occurred");
        }
    }

    async login(username, password, override) {
        if (!username && !password) {
            throw Error("invalid username and password");
        }
        let params = {
            user: username,
            passwd: password
        }
        const { type, data } = await this.__makeRequest__(params);
        if (type === pageTags.session) {
            return data;
        }
        if (type === pageTags.confirmOverride) {
            if (typeof (override) === "function" && override(/* pass some meta */)) {
                return this.confirmOverride(username, password);
            }
            throw new Error("another user is logged in with this account");
        }
        if (type === pageTags.authFailed) {
            throw new Error("authentication failed");
        }
        else {
            const e = Error(`an error ocurred. expected ${pageTags.session} recieved: ${type}`);
            e.expected = pageTags.session;
            e.receieved = type;
        }
    }

    async refresh(id) {
        if (!id) {
            throw new Error("invalid session id");
        }
        let params = {
            gi: id,
        }
        const { type, data } = await this.__makeRequest__(params);
        if (type === pageTags.session) {
            return data;
        }
        else {
            throw new Error("An error ocurred while refreshing");
        }
    }

    async logout(id) {
        if (!id) {
            throw new Error("invalid session id");
        }
        let params = {
            gi: id,
            logout: 1
        }

        const { type, data } = await this.__makeRequest__(params);
        /* no checks required, even if the call failed, silently return */
    }
}