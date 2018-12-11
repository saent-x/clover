import cheerio = require("cheerio");
import IPageParser from "./interfaces/ipage-parser";
import PageType from "./page-type"
import {parseToMb} from "./util";

const sessionParser: IPageParser = (function () {
    return {
        pageType: PageType.session,

        parse: function (html: string) {
            const $ = cheerio.load(html);
            const id = parseSessionId($);
            const quotaType = parseNodeValue($, "Bandwidth Quota Schedule:");

            let _total = parseNodeValue($, "Group Allowed Bandwidth:");
            if (!_total || _total === "-") {
                _total = "3.00 GB";
            }
            const total = parseToMb(_total);

            let _upload = parseNodeValue($, "Upload:");
            if (!_upload || _upload === "-") {
                _upload = "0 MB";
            }
            const upload = parseToMb(_upload);

            let _download = parseNodeValue($, "Download:");
            if (!_download || _download === "-") {
                _download = "0 MB";
            }
            const download = parseToMb(_download);

            let _used = parseNodeValue($, "Total Bandwidth:");
            if (!_used || _used === "-") {
                _used = "0 MB";
            }
            const used = parseToMb(_used);

            return {id, quotaType, total, upload, download, used};
        }
    };

    function parseNodeValue($: any, key: string): string {
        /* Todo: re-write this block, it's a tad messy */
        const values = Array.from($("td.para1"))
            .map(function (node: any) {
                return node.children[0]
            })
            .filter(function (node: any) {
                const sanitize = function (value: string) {
                    value.toLocaleLowerCase().trim();
                };
                return node && node.data ? sanitize(key) === sanitize(node.data) : false;
            })
            .map(function (node: any) {
                let currentNode = node.parent;
                /* keep moving until we hit an adjacent sibling */
                do {
                    currentNode = currentNode.next;
                } while (currentNode.type != "tag");

                return currentNode.children[0].data;
            });

        return values.length > 0 ? values[0] : null;
    }

    function parseSessionId($: any): Number {
        const content = $("meta").last()[0].attribs.content;
        return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
    }
})();

const parsers: IPageParser[] = [sessionParser];

export default class PageParser {
    static getParser(pageType: PageType): IPageParser {
        return parsers.find(parser => parser.pageType === pageType);
    }
}