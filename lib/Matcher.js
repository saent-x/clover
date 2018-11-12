const tags = {
  unknown: Symbol("unknown"),
  session: Symbol("session"),
  loggedOut: Symbol("logged-out"),
  invalidRequest: Symbol("invalid-request"),
  confirmOverride: Symbol("confirm-override"),
  authenticationFailed: Symbol("auth-failed")
};

class Matcher {
  constructor() {
    this.matchers = [
      [tags.session, /\WTime Remaining\W/i],
      [tags.authenticationFailed, /\WAuthentication Failed\W/i],
      [tags.invalidRequest, /\WInvalid Request\W/i],
      [tags.confirmOverride, /\Walready logged\W/i],
      [tags.loggedOut, /\WYou have been successfully Logged Out!!!\W/i]
    ];
  }

  match(html) {
    let match;

    for (const [tag, regex] of this.matchers) {
      if (regex.test(html)) match = tag;
    }

    return match || tags.unknown;
  }
}

module.exports = { Matcher, tags };
