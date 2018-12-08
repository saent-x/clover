declare const Emittery: any;
export default class Session extends Emittery {
    hasActiveSession: boolean;
    constructor(id: number, interval: number);
    destroy(e: Error): void;
}
export {};
