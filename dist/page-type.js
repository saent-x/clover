"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PageType;
(function (PageType) {
    PageType[PageType["unknown"] = 0] = "unknown";
    PageType[PageType["session"] = 1] = "session";
    PageType[PageType["loggedOut"] = 2] = "loggedOut";
    PageType[PageType["invalidRequest"] = 3] = "invalidRequest";
    PageType[PageType["confirmOverride"] = 4] = "confirmOverride";
    PageType[PageType["authenticationFailed"] = 5] = "authenticationFailed";
    PageType[PageType["maxSessionsReached"] = 6] = "maxSessionsReached";
})(PageType || (PageType = {}));
;
exports.default = PageType;
