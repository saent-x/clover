import PageType from "../page-type";

export default interface IPageMatcher {
    pageType: PageType;
    isMatch(html: string) : boolean;
}