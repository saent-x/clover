const tags = {
    unknown: Symbol("unknown"),
    session: Symbol("session"),
    loggedOut: Symbol("logged-out"),
    invalidRequest: Symbol("invalid-request"),
    confirmOverride: Symbol("confirm-override"),
    authenticationFailed: Symbol("auth-failed"),
}

class Matcher {
    constructor() {
        this.matchers = [
            [tags.session, /\WTime Remaining\W/i],
            [tags.authenticationFailed, /\WAuthentication Failed\W/i],
            [tags.invalidRequest, /\WInvalid Request\W/i],
            [tags.confirmOverride, /\Walready logged\W/i],
            [tags.loggedOut, /\WYou have been successfully Logged Out!!!\W/i],
        ];
    }

    match(html) {
        const [type] = this.matchers.find(set => set[1].test(html));
        return type || tags.unknown;
    }
}

module.exports = { Matcher, tags }