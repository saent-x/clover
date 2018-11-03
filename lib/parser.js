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
            const $ = cheerio.load(html);

            const parseValue = (key) => {
                const value = Array.from($("td.para1"))
                    .map(e => e.children[0])
                    /* remove empty nodes and find the td, with the `tag`*/
                    .filter(e => {
                        const sanitize = (value) => value.toLocaleLowerCase().trim();

                        if (e && e.data) {
                            return sanitize(key) === sanitize(e.data);
                        }
                    })
                    /* navigate from that `td` to it's adjacent sibling which contains
                     * the value */
                    .map(e => {
                        let node = e.parent;
                        /* keep moving till you we hit the adjacent sibling */
                        do {
                            node = node.next;
                        } while (node.type != "tag")
                        return node.children[0].data;
                    })[0];
                return value;
            }

            /* NOTE: sometimes, at the begining of the month, when the data has just been reset,
             * some, if not all of these fields will be empty */
            return {
                quotaType: parseValue("Bandwidth Quota Schedule:"),
                total: parseValue("Group Allowed Bandwidth:"),
                download: parseValue("Download:"),
                upload: parseValue("Upload:"),
                used: parseValue("Total Bandwidth:"),
            }
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