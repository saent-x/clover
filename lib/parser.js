const cheerio = require("cheerio");

function parse(html) {
    const matcher = matchers.find(matcher => {
        return (typeof (matcher.test) === "function" && matcher.test(html))
    });
    const type = matcher && matcher.for ? matcher.for : pageTags.unknown;
    const parser = parsers.find(parser => parser.for === type);
    const data = parser ? parser.parse(html) : null;
    return { type, data };
}

/* symbol map for easily identifying pages */
const pageTags = {
    session: Symbol("session"),
    authFailed: Symbol("auth-failed"),
    invalidRequest: Symbol("invalid-request"),
    confirmOverride: Symbol("confirm-override"),
    loggedOut: Symbol("logged-out"),
    unknown: Symbol("unknown")
}

function createMatcher(regex, pageType) {
    return {
        for: pageType,
        test: (html) => {
            const match = regex.test(html);
            /* reset after */
            return match;
        }
    }
}

function createParser(parse, pageType) {
    return { for: pageType, parse }
}

/* initialise matchers */
const matchers = [];
matchers.push(createMatcher(/\WTime Remaining\W/i, pageTags.session));
matchers.push(createMatcher(/\WAuthentication Failed\W/i, pageTags.authFailed));
matchers.push(createMatcher(/\WInvalid Request\W/i, pageTags.invalidRequest));
matchers.push(createMatcher(/\Walready logged\W/i, pageTags.confirmOverride));
matchers.push(createMatcher(/\WYou have been successfully Logged Out!!!\W/i, pageTags.loggedOut));

/* initialise parsers */
const parsers = [];
parsers.push(createParser(sessionParser, pageTags.session));

function parseValue($, key) {
    let query = Array.from($("td.para1"))
        .map(node => node.children[0])
        .filter(node => {
            const sanitize = (value) => value.toLocaleLowerCase().trim();
            return node && node.data ? sanitize(key) === sanitize(node.data) : false;
        })
        .map(node => {
            let currentNode = node.parent;
            /* keep moving untill we hit an adjacent sibling */
            do {
                currentNode = currentNode.next;
            } while (currentNode.type != "tag")
            return currentNode.children[0].data;
        });

    return query.length > 0 ? query[0] : null;
}

function parseSessionId($) {
    const content = $("meta").last()[0].attribs.content;
    return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
}

function sessionParser(html) {
    const $ = cheerio.load(html);
    /* Sometimes, at the begining of the month, when the data has just been reset,
     * some, if not all of these fields will be empty. Checks have to be a linient as possible */
    return {
        id: parseSessionId($),
        quotaType: parseValue($, "Bandwidth Quota Schedule:"),
        total: parseValue($, "Group Allowed Bandwidth:"),
        download: parseValue($, "Download:"),
        upload: parseValue($, "Upload:"),
        used: parseValue($, "Total Bandwidth:"),
    }
}

/* exported objects */
module.exports = {
    parse,
    pageTags
};
