const cheerio = require("cheerio");
const { first } = require("./util");


module.exports = (function () {
    /* symbols map for easily identifying pages */
    const pageTags = {
        session: Symbol("session"),
        authFailed: Symbol("auth-failed"),
        invalidRequest: Symbol("invalid-request"),
        confirmOverride: Symbol("confirm-override"),
    }

    /* this was intentionally put here to avoid it cluttering the API 
     * as it only has internal use whereas the `pageTags` object will be exported*/
    const unknown = Symbol("unknown");

    /* initialise matchers */
    const matchers = {
        [pageTags.session]: /\WTime Remaining\W/gi,
        [pageTags.authFailed]: /\WAuthentication Failed\W/gi,
        [pageTags.invalidRequest]: /\WInvalid Request\W/gi,
        [pageTags.confirmOverride]: /\Walready logged\W/gi
    }

    /* initialise parsers */
    const parsers = {
        [pageTags.session]: (html) => {
            /* parse session data here */
        }
    }

    function parse(html) {
        const type = first(Object.getOwnPropertySymbols(matchers),
            (tag) => matchers[tag].test(html)) || unknown;
        const data = parsers[type] ? parsers[type](html) : null;
        return { type, data }
    }

    /* return just `parse` and tac on other props to it */
    parse.tags = pageTags;
    return parse;
})();