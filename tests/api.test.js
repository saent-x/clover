const Api = require("../lib/api");
const { loadMockPage } = require("../lib/util");

function getMockApi(page) {
    let api = new Api({});
    api.makeRequest = function (params) {
        return loadMockPage(page);
    }
    return api;
}

test("proving ground stuff", () => {
    expect(1 + 1).toBe(2);
})