"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const cross_fetch_1 = require("cross-fetch");
const page_parser_1 = require("./page-parser");
const page_type_resolver_1 = require("./page-type-resolver");
const page_type_1 = require("./page-type");
class Api {
    constructor() {
        this.url = "https://192.168.1.30/cgi-bin/user_session.ggi";
    }
    __makeRequest__(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = require("querystring").stringify(params);
            let options = {
                method: "GET",
                /* The server does not send a signed certificate so if `rejectUnauthorized` is not set
                 * to false, all calls will fail. This may likely change in the future. */
                agent: new https_1.Agent({
                    rejectUnauthorized: false
                })
            };
            const result = yield cross_fetch_1.default(this.url + "?" + query, options);
            const pageContent = yield result.text();
            const pageType = page_type_resolver_1.default.resolvePage(pageContent);
            if (pageType !== page_type_1.default.unknown) {
                const parseResult = page_parser_1.default.getParser(pageType)
                    .parse(pageContent);
                return { pageType, data: parseResult };
            }
            else
                throw new Error("unable to identify response from server");
        });
    }
    confirmOverride(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username && !password) {
                throw Error("invalid username and password");
            }
            let params = {
                user: username,
                passwd: password,
                userdelete: "yes"
            };
            const result = yield this.__makeRequest__(params);
            if (result.pageType === page_type_1.default.session) {
                return result.data;
            }
            else {
                // TO-DO: Replace crappy error message with something more descriptive
                throw new Error("an unknown error occurred");
            }
        });
    }
    login(username, password, override) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username && !password) {
                throw Error("invalid username and password");
            }
            const fetchParams = {
                user: username,
                passwd: password
            };
            const result = yield this.__makeRequest__(fetchParams);
            if (result.pageType === page_type_1.default.session) {
                return result.data;
            }
            switch (result.pageType) {
                case page_type_1.default.confirmOverride:
                    /* To-do: pass the ip of the already logged in device to 'override' callback
                     as a parameter, so that who's consumig it can perhaps print a useful
                     message or prompt */
                    if (typeof override === "function" &&
                        (yield override( /* pass some meta */))) {
                        return yield this.confirmOverride(username, password);
                    }
                    throw new Error("Another user is logged in with this account");
                case page_type_1.default.authenticationFailed:
                    throw new Error("Authentication failed, username or password incorrect");
                default:
                    throw new Error("An unknown error occurred during login");
            }
        });
    }
    refresh(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error("invalid session id");
            }
            const fetchParams = {
                gi: id
            };
            const result = yield this.__makeRequest__(fetchParams);
            if (result.pageType === page_type_1.default.session) {
                return result.data;
            }
            else {
                throw new Error("An error ocurred while refreshing");
            }
        });
    }
    logout(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error("invalid session id");
            }
            let fetchParams = {
                gi: id,
                logout: 1
            };
            yield this.__makeRequest__(fetchParams);
            /* no checks required, even if the call fails, silently return */
        });
    }
}
exports.default = Api;
;
