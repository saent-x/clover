const Api = require("./Api");
const { syncSetInterval } = require("./util");
const Emittery = require("emittery");

const api = new Api();

module.exports = class Session extends Emittery {
  constructor(id, interval) {
    super();

    if (!id) {
      throw new Error("invalid session id");
    }
    
    /* if no update interval is specified, use a default of 5s; */
    interval = interval || 5000;

    this.sessionActive = true;

    const fetchStats = async () => {
      if (!this.sessionActive) {
        return;
      }
      const data = await api.refresh(id).catch(e => this.destroy(e));
      this.emit("refresh", data);
    };

    this.updateHandle = syncSetInterval(fetchStats, interval);
  }

  destroy(e) {
    this.updateHandle.clear();
    this.sessionActive = false;
    this.emit("close", e);
  }
};
