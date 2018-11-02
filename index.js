const cheerio = require("cheerio");

function CreateMarker(tag, matcher) {
    if (!tag) {
        throw new Error("Cannot create matcher with invalid tag");
    }
    return {
        tag,
        matcher,
        /* test a string using the specified matcher */
        test: function (html) {
            return this.matcher.test(html);
        }
    }
}

const getParser = (type) => {
    parsers.forEach(parser => {
        if (parser.for === type) {
            return parser.parse;
        }
    });
    throw new Error("No parser found for page with type " + type);
}


/* setup an array of markers used to isdentify pages received from the
 * server */
const markers = [
    CreateMarker("session", /\test/gi),
    CreateMarker("auth-failed", /\WAuthentication Failed\W/gi),
    CreateMarker("invalid-request", /\WInvalid Request\W/gi),
    CreateMarker("confirm-override", /\Walready logged\W/gi)
]

/* when a parse fails to parse, it will return null or undefined as 
 * opposed to throwing an Error. This behaviour may change in the future */
const parsers = [
    {
        for: "session",
        parse: (html) => {
            /* parsing logic here */
        },

        for: "confirm-override",
        parse: (html) => {
            /* parsing logic here */
        }
    }
]

function parse(html) {
    if (!html) {
        return null;
    }

    const type = identify(html);
    return getParser(type)();
}

function identify(html) {
    for (marker of markers) {
        if (marker.test(html)) {
            return marker.tag;
        }
    }
}

module.exports = {
    identify,
    parse
}

