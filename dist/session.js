"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("./Api");
const util_1 = require("./util");
// Emittery does not seem to support ES6 imports as of this time.
// I will try to open a issue at https://github.com/sindresorhus/emittery as regards this.
const Emittery = require("emittery");
const api = new Api_1.default();
class Session extends Emittery {
    constructor(id, interval) {
        super();
        if (!id) {
            throw new Error("invalid session id");
        }
        /* if no update interval is specified, use a default of 5s; */
        interval = interval || 5000;
        this.hasActiveSession = true;
        const fetchStats = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sessionActive) {
                return;
            }
            const data = yield api.refresh(id).catch(e => this.destroy(e));
            this.emit("refresh", data);
        });
        // I'll decide whether or not to add some delay later
        this.updateHandle = util_1.syncSetInterval(fetchStats, interval, 0);
    }
    destroy(e) {
        this.updateHandle.clear();
        this.sessionActive = false;
        this.emit("close", e);
    }
}
exports.default = Session;
;
