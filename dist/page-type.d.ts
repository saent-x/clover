declare enum PageType {
    unknown = 0,
    session = 1,
    loggedOut = 2,
    invalidRequest = 3,
    confirmOverride = 4,
    authenticationFailed = 5,
    maxSessionsReached = 6
}
export default PageType;
