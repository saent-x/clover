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

        const update = async () => {
            if (this._closed_) {
                /* silently return if destroy was called before any pending updates are fufilled*/
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
        this._closed_ = true;
        this.emit("close", e);
    }

}