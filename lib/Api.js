const { Agent } = require("https");
const fetch = require("cross-fetch");
const Parser = require("./Parser");
const { tags } = require("./Matcher");

module.exports = class Api {
  constructor() {
    this.url = "https://192.168.1.30/cgi-bin/user_session.ggi";
    this.parser = new Parser();
  }

  __makeRequest__(params) {
    let query = require("querystring").stringify(params);
    let options = {
      method: "GET",
      /* The server does not send a signed certificate so if `rejectUnauthorized` is not set
       * to false, all calls will fail. This may likely change in the future. */
      agent: new Agent({ rejectUnauthorized: false })
    };
    return fetch(this.url + "?" + query, options)
      .then(result => result.text())
      .then(html => {
        let meta = this.parser.parse(html);
        if (meta.type === tags.unknown) {
          throw new Error("unable to identify response from server");
        }
        return meta;
      });
  }

  async confirmOverride(username, password) {
    /* sanity check just in case there's no client side validation */
    if (!username && !password) {
      throw Error("invalid username and password");
    }
    let params = {
      user: username,
      passwd: password,
      userdelete: "yes"
    };
    const { type, data } = await this.__makeRequest__(params);
    if (type === tags.session) {
      return data;
    } else {
      throw new Error("an unknown error occurred");
    }
  }

  async login(username, password, override) {
    if (!username && !password) {
      throw Error("invalid username and password");
    }
    let params = {
      user: username,
      passwd: password
    };
    const { type, data } = await this.__makeRequest__(params);

    if (type === tags.session) {
      return data;
    }

    switch (type) {
      case tags.confirmOverride:
        /* To-do: pass the ip of the already logged in device as meta to override cb */
        if (
          typeof override === "function" &&
          (await override(/* pass some meta */))
        ) {
          return await this.confirmOverride(username, password);
        }
        throw new Error("Another user is logged in with this account");

      case tags.authenticationFailed:
        throw new Error(
          "Authentication failed, username or password incorrect"
        );

      default:
        throw new Error("An unknown error occurred during login");
    }
  }

  async refresh(id) {
    if (!id) {
      throw new Error("invalid session id");
    }

    let params = {
      gi: id
    };

    const { type, data } = await this.__makeRequest__(params);

    if (type === tags.session) {
      return data;
    } else {
      throw new Error("An error ocurred while refreshing");
    }
  }

  async logout(id) {
    if (!id) {
      throw new Error("invalid session id");
    }
    let params = {
      gi: id,
      logout: 1
    };

    const { type, data } = await this.__makeRequest__(params);
    /* no checks required, even if the call fails, silently return */
  }
};
