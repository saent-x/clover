const { parse, pageTags } = require("./parser.js");
const { Agent } = require("https");
const { EventEmitter } = require("events");
const fetch = require("cross-fetch");

module.exports = class Api extends EventEmitter {
    constructor() {
        this.url = 'https://192.168.1.30/cgi-bin/user_session.ggi';
    }

    makeRequest(params) {
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
        const { type, data } = await this.makeRequest(params);
        if (type === pageTags.session) {
            return data;
        }
        else {
            throw new Error("an error occurred");
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
        const { type, data } = await this.makeRequest(params);
        if (type === pageTags.session) {
            return data;
        }
        if (type === pageTags.confirmOverride) {
            if (typeof (override) === "function" && override(/* pass some meta */)) {
                return this.confirmOverride(username, password);
            }
            throw new Error(`another user is logged in with this account on ip: xx.xx.xx.xx `);
        }
        if (type === pageTags.authFailed) {
            throw new Error("authentication failed");
        }
        else {
            throw new Error(`an error ocurred. expected ${pageTags.session} recieved: ${type}`);
        }
    }

    refresh(id) {

    }

    logout(id) {

    }
}