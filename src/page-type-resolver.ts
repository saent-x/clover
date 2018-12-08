import PageType from "./page-type";
import IPageMatcher from "./interfaces/ipage-matcher";

function createMatcher(pageType: PageType, regex: RegExp): IPageMatcher {
	const matcher: IPageMatcher = {
		pageType: pageType,
		isMatch: function (html: string): boolean { return regex.test(html); }
	}
	return matcher;
}

const pageMatchers: Array<IPageMatcher> = [
	createMatcher(PageType.session, /\WTime Remaining\W/i),
	createMatcher(PageType.authenticationFailed, /\WAuthentication Failed\W/i),
	createMatcher(PageType.invalidRequest, /\WInvalid Request\W/i),
	createMatcher(PageType.confirmOverride, /\Walready logged\W/i),
	createMatcher(PageType.loggedOut, /\WYou have been successfully Logged Out!!!\W/i),
	createMatcher(PageType.maxSessionsReached, /\WThe no of UserSense session of User:\W/i)
]

export default class PageTypeResolver {
	/**
	 * Resolves static html to a PageType instance.
	 */
	static resolvePage(pageContent: string): PageType {
		if (!pageContent) {
			throw new Error("page must be valid html markup");
		}
		const pageMatcher = pageMatchers.find(resolver => resolver.isMatch(pageContent));
		if (pageMatcher) {
			return pageMatcher.pageType;
		}
		else {
			return PageType.unknown;
		}
	}
}
