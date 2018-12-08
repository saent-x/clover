"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_type_1 = require("./page-type");
function createMatcher(pageType, regex) {
    const matcher = {
        pageType: pageType,
        isMatch: function (html) { return regex.test(html); }
    };
    return matcher;
}
const matchers = [
    createMatcher(page_type_1.default.session, /\WTime Remaining\W/i),
    createMatcher(page_type_1.default.authenticationFailed, /\WAuthentication Failed\W/i),
    createMatcher(page_type_1.default.invalidRequest, /\WInvalid Request\W/i),
    createMatcher(page_type_1.default.confirmOverride, /\Walready logged\W/i),
    createMatcher(page_type_1.default.loggedOut, /\WYou have been successfully Logged Out!!!\W/i),
    createMatcher(page_type_1.default.maxSessionsReached, /\WThe no of UserSense session of User:\W/i)
];
exports.default = matchers;
