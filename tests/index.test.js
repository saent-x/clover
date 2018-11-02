const {identify, parse} = require("../index");
const fs = require("fs");
const path = require("path");

function loadMockPage(name) {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, "./mock-pages/", name + ".html");
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

describe('identify pages', () => {

    test("identify confirm-override page", () => {
        return loadMockPage("confirm-override").then(page => {
            expect(identify(page)).toBe("confirm-override");
        })
    })
})

