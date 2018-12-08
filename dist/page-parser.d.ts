import IPageParser from "./interfaces/ipage-parser";
import PageType from "./page-type";
export default class PageParser {
    static getParser(pageType: PageType): IPageParser;
}
