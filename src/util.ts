export function syncSetInterval(callback: any, interval: number, delay: number) {
    let clearRequested: boolean;

    const update = async () => {
        if (clearRequested) {
            return;
        }
        await callback();
        setTimeout(update, interval);
    };

    setTimeout(update, delay || 0);

    return {
        clear: () => (clearRequested = true)
    };
}

export function parseToMb(value: string): number {
    let { magnitude, type } = parseMagnitudeAndType(value);

    if (type === "kb") {
        magnitude = magnitude / 1024;
    }
    else if (type == "gb") {
        magnitude = magnitude * 1024;
    }

    return magnitude;
}

export function parseToGb(value: string): number {
    let { magnitude, type } = parseMagnitudeAndType(value);

    if (type === "mb") {
        magnitude = magnitude / 1024;
    }
    else if (type === "kb") {
        magnitude = magnitude / (1024 * 1024);
    }

    return magnitude;
}

export function parseMagnitudeAndType(value: string): { type: string, magnitude: number } {
    // convert to lowercase and remove all whitespaces to make parsing easy
    value = value.toLocaleLowerCase();
    value = value.replace(/\s/g, '');

    const type = ["kb", "mb", "gb"].find(t => value.includes(t));
    if(!type){
        throw new Error("unknown or invalid data type encountered");
    }
    /* since, all values have two character suffixes like mb, gb, kb etc. we can
    /* easily parse the value by stripping off the last two characters */
    const magnitude = Number.parseFloat(value.substr(0, value.length - 2));
    return {type, magnitude};
}
