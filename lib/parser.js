const { Matcher, tags } = require("./Matcher");
const cheerio = require("cheerio");

module.exports = class Parser {
    constructor() {

        const sessionParser = (html) => {
            const $ = cheerio.load(html);
            const parseValue = (key) => {
                let query = Array
                    .from($("td.para1"))
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
            const parseId = () => {
                const content = $("meta").last()[0].attribs.content;
                return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
            }

            const id = parseId();
            const quotaType = parseValue("Bandwidth Quota Schedule:");
            const total = parseValue("Group Allowed Bandwidth:") || "3.00 GB"; /* this is a hack */
            const upload = parseValue("Upload:") || "0 MB";
            const download = parseValue("Download:") || "0 MB";
            const used = parseValue("Total Bandwidth:") || "0 MB";

            return { id, quotaType, total, upload, download, used }
        }

        this.matcher = new Matcher();
        this.parsers = [[tags.session, sessionParser]]
    }

    parse(html) {
        const type = this.matcher.match(html);
        const set = this.parsers.find(set => set[0] === type)
        const parser = set ? set[1] : null;
        let data = null;

        if (parser) {
            data = parser ? parser(html) : null;
        }

        return { type, data }
    }
}