const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

module.exports = {
    loadMockPage(name) {
        return new Promise((resolve, reject) => {
            const filePath = path.resolve(__dirname, "../tests/mock-pages/", name + ".html");
            fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },

    syncSetInterval(callback, interval, delay) {
        let clearRequested;

        const update = async () => {
            if (clearRequested)
                return;
            await callback();
            handle = setTimeout(update, interval);
        }

        /* start the interval */
        setTimeout(update, delay || 0);

        return {
            clear: () => clearRequested = true
        }
    }
} 