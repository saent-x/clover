"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const page_type_1 = require("./page-type");
const parse_util_1 = require("./parse-util");
const sessionParser = (function () {
    function parseSessionId($) {
        const content = $("meta").last()[0].attribs.content;
        return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
    }
    return {
        pageType: page_type_1.default.session,
        parse: function (html) {
            // load and resuse cheerio context
            const $ = cheerio.load(html);
            const id = parseSessionId($);
            const quotaType = parse_util_1.parseAdjacentSiblingValue($, "Bandwidth Quota Schedule:");
            const total = parse_util_1.parseAdjacentSiblingValue($, "Group Allowed Bandwidth:") || "3.00 GB";
            const upload = parse_util_1.parseAdjacentSiblingValue($, "Upload:") || "0 MB";
            const download = parse_util_1.parseAdjacentSiblingValue($, "Download:") || "0 MB";
            const used = parse_util_1.parseAdjacentSiblingValue($, "Total Bandwidth:") || "0 MB";
            return { id, quotaType, total, upload, download, used };
        }
    };
})();
const parsers = [sessionParser];
class PageParser {
    static getParser(pageType) {
        return parsers.find(parser => parser.pageType === pageType);
    }
}
exports.default = PageParser;
