import PageType from "../page-type";

export default interface IPageParser {
    pageType: PageType;
    parse(html: string) : Object;
}