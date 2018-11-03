const { parse, pageTags } = require("../lib/parser");
const { loadMockPage } = require("../lib/util");

describe('identify pages', () => {
    test("identify confirm-override page", () => {
        return loadMockPage("confirm-override").then(page => {
            expect(parse(page).type)
                .toBe(pageTags.confirmOverride);
        })
    })
    test("identify auth-failed page", () => {
        return loadMockPage("auth-failed").then(page => {
            expect(parse(page).type)
                .toBe(pageTags.authFailed);
        })
    })
    test("identify session page", () => {
        return loadMockPage("session").then(page => {
            expect(parse(page).type)
                .toBe(pageTags.session);
        })
    })
})
