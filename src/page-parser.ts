import cheerio = require("cheerio");
import IPageParser from "./interfaces/ipage-parser";
import PageType from "./page-type"
import { parseAdjacentSiblingValue } from "./parse-util";

const sessionParser: IPageParser = (function () {
    function parseSessionId($: any): Number {
        const content = $("meta").last()[0].attribs.content;
        return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
    }

    return {
        pageType: PageType.session,

        parse: function (html: string) {
            // load and resuse cheerio context
            const $ = cheerio.load(html);
            const id = parseSessionId($);
            const quotaType = parseAdjacentSiblingValue($, "Bandwidth Quota Schedule:");
            const total = parseAdjacentSiblingValue($, "Group Allowed Bandwidth:") || "3.00 GB";
            const upload = parseAdjacentSiblingValue($, "Upload:") || "0 MB";
            const download = parseAdjacentSiblingValue($, "Download:") || "0 MB";
            const used = parseAdjacentSiblingValue($, "Total Bandwidth:") || "0 MB";

            return { id, quotaType, total, upload, download, used };
        }
    }
})();

const parsers: IPageParser[] = [sessionParser];

export default class PageParser {
    static getParser(pageType: PageType): IPageParser {
        return parsers.find(parser => parser.pageType === pageType);
    }
}