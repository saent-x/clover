const Api = require("./api");
const { syncSetInterval } = require("./util");
const { EventEmitter } = require("events");

const api = new Api();

module.exports = class Session extends EventEmitter {
    constructor(id, options) {
        super();
        if (!id) {
            throw new Error("invalid session id");
        }
        options = options || {};
        const logoutOnDestroy = options.logoutOnDestory;
        const updateInterval = options.updateInterval || 5000; /* 5s */

        /* setup the update timer */
        let lastUpdateTime = new Date().getTime();

        const update = async () => {
            if (this._closed_) {
                /* if destrouy was called before any pending updates are fufilled - silently return*/
                return;
            }
            const data = await api.refresh(id).catch(e => this.destroy(e));
            this.emit("refresh", data);
        }
        this.handle = syncSetInterval(update, updateInterval);
    }

    destroy(e) {
        if (this.handle) {
            clearInterval(this.handle);
            if (this.logoutOnDestroy) {
                api.logout();
            }
        }
        this.emit("close", e);
    }

}