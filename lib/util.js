const path = require("path");
const fs = require("fs");

module.exports = {
    /* Finds and returns the first element to match a given predicate */
    first(array, predicate) {
        for (const elem of array) {
            if (predicate(elem)) {
                return elem;
            }
        }
    },

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
    }
}