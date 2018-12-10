import Api from "./Api";
import { syncSetInterval } from "./util";
import Emittery = require("emittery");

const api = new Api();

export default class Session extends Emittery {
    hasActiveSession: boolean;
    updateHandle: any;

    constructor(id: number, interval: number) {
        super();

        if (!id) {
            throw new Error("invalid session id");
        }
        /* if no update interval is specified, use a default of 5s; */
        interval = interval || 5000;

        this.hasActiveSession = true;

        const fetchStats = async () => {
            if (!this.hasActiveSession) {
                return;
            }
            const data = await api.refresh(id).catch(e => this.destroy(e));
            await this.emit("refresh", data);
        };
        // I'll decide whether or not to add some delay later
        this.updateHandle = syncSetInterval(fetchStats, interval, 0);
    }

    async destroy(e: Error) {
        this.updateHandle.clear();
        // set this to false so that another call to destroy will fail silently
        this.hasActiveSession = false;
        await this.emit("close", e);
    }
};