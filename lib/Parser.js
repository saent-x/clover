const { Matcher, tags } = require("./Matcher");
const cheerio = require("cheerio");

function getSessionId($) {
  const content = $("meta").last()[0].attribs.content;

  return Number.parseInt(content.slice(content.lastIndexOf("=") + 1));
}

function getAdjacentSiblingValue($, key) {
  /* Todo: re-write this block, it's a tad messy */
  let query = Array.from($("td.para1"))
    .map(node => node.children[0])
    .filter(node => {
      const sanitize = value => value.toLocaleLowerCase().trim();

      return node && node.data ? sanitize(key) === sanitize(node.data) : false;
    })
    .map(node => {
      let currentNode = node.parent;
      /* keep moving untill we hit an adjacent sibling */
      do {
        currentNode = currentNode.next;
      } while (currentNode.type != "tag");

      return currentNode.children[0].data;
    });

  return query.length > 0 ? query[0] : null;
}

const sessionParser = html => {
  const $ = cheerio.load(html);

  const id = getSessionId($);
  const quotaType = getAdjacentSiblingValue($, "Bandwidth Quota Schedule:");
  const total =
    getAdjacentSiblingValue($, "Group Allowed Bandwidth:") || "3.00 GB";
  const upload = getAdjacentSiblingValue($, "Upload:") || "0 MB";
  const download = getAdjacentSiblingValue($, "Download:") || "0 MB";
  const used = getAdjacentSiblingValue($, "Total Bandwidth:") || "0 MB";

  return { id, quotaType, total, upload, download, used };
};

const parsers = [{ tag: tags.session, parse: sessionParser }];

const matcher = new Matcher();

class Parser {
  parse(html) {
    const type = matcher.match(html);
    const parser = parsers.find(p => p.tag === type);

    if (!parser) {
      return { type, data: null };
    }

    let data = null;
    const { parse } = parser;

    if (parse && typeof parse === "function") {
      data = parse(html);
    }

    return { type, data };
  }
}

module.exports = Parser;
