import { Agent } from "https";
import fetch from "cross-fetch";
import PageParser from "./page-parser";
import PageTypeResolver from "./page-type-resolver";
import PageType from "./page-type";

export default class Api {
	private url: String = "https://192.168.1.30/cgi-bin/user_session.ggi";

	async __makeRequest__(params: Object): Promise<{ pageType: PageType, data: Object }> {
		let query = require("querystring").stringify(params);
		let options = {
			method: "GET",
			/* The server does not send a signed certificate so if `rejectUnauthorized` is not set
			 * to false, all calls will fail. This may likely change in the future. */
			agent: new Agent({
				rejectUnauthorized: false
			})
		};
		const result = await fetch(this.url + "?" + query, options);
		const pageContent = await result.text();
		const pageType = PageTypeResolver.resolveType(pageContent);

		if (pageType !== PageType.unknown) {
			const parseResult = PageParser.getParser(pageType)
				.parse(pageContent);
			return { pageType, data: parseResult };
		}
		else
			throw new Error("unable to identify response from server");
	}

	async confirmOverride(username: string, password: string) {
		if (!username && !password) {
			throw Error("invalid username and password");
		}

		let params = {
			user: username,
			passwd: password,
			userdelete: "yes"
		};

		const result = await this.__makeRequest__(params);

		if (result.pageType === PageType.session) {
			return result.data;
		} else {
			// TO-DO: Replace crappy error message with something more descriptive
			throw new Error("an unknown error occurred");
		}
	}

	async login(username: string, password: string, override) {
		if (!username && !password) {
			throw Error("invalid username and password");
		}
		const fetchParams = {
			user: username,
			passwd: password
		};
		const result = await this.__makeRequest__(fetchParams);

		if (result.pageType === PageType.session) {
			return result.data;
		}

		switch (result.pageType) {
			case PageType.confirmOverride:
				/* To-do: pass the ip of the already logged in device to 'override' callback
				 as a parameter, so that who's consuming it can perhaps print a useful
				 message or prompt */
				if (
					typeof override === "function" &&
					(await override(/* pass some meta */))
				) {
					return await this.confirmOverride(username, password);
				}
				throw new Error("Another user is logged in with this account");

			case PageType.authenticationFailed:
				throw new Error(
					"Authentication failed, username or password incorrect"
				);

			default:
				throw new Error("An unknown error occurred during login");
		}
	}

	async refresh(id: number) {
		if (!id) {
			throw new Error("invalid session id");
		}
		const fetchParams = {
			gi: id
		};

		const result = await this.__makeRequest__(fetchParams);

		if (result.pageType === PageType.session) {
			return result.data;
		} else {
			throw new Error("An error occurred while fetching data");
		}
	}

	async logout(id: number) {
		if (!id) {
			throw new Error("invalid session id");
		}
		let fetchParams = {
			gi: id,
			logout: 1
		};

        /* no checks required, even if the call fails, silently return */
        await this.__makeRequest__(fetchParams);
	}
};
