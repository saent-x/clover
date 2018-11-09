const path = require("path");
const fs = require("fs");

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

    syncSetInterval(callback, interval) {
        /* setup the update timer */
        let lastUpdateTime = new Date().getTime();

        const update = () => {
            const timeSinceLast = new Date().getTime() - lastUpdateTime;
            if (timeSinceLast < interval) {
                return setTimeout(update, timeSinceLast - interval);
            }
            /* this may take an ideterminate amount of time */
            callback();
            /* update lastUpdateTime */
            lastUpdateTime = new Date().getTime();
            setTimeout(update, interval);
        }

        return setTimeout(update, interval);

    }
}