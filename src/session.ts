import Api from "./Api";
import { syncSetInterval } from "./util";

// Emittery does not seem to support ES6 imports as of this time.
// I will try to open a issue at https://github.com/sindresorhus/emittery as regards this.
const Emittery = require("emittery");

const api = new Api();

export default class Session extends Emittery {
    hasActiveSession: boolean;
    
    constructor(id: number, interval: number) {
        super();

        if (!id) {
            throw new Error("invalid session id");
        }
        /* if no update interval is specified, use a default of 5s; */
        interval = interval || 5000;

        this.hasActiveSession = true;

        const fetchStats = async () => {
            if (!this.sessionActive) {
                return;
            }
            const data = await api.refresh(id).catch(e => this.destroy(e));
            this.emit("refresh", data);
        };
        // I'll decide whether or not to add some delay later
        this.updateHandle = syncSetInterval(fetchStats, interval, 0);
    }

    destroy(e: Error) {
        this.updateHandle.clear();
        this.sessionActive = false;
        this.emit("close", e);
    }
};