const fs = require("fs");
const path = require("path");
const parse = require("../lib/parser");
const { loadMockPage } = require("../lib/util");

const pageType = parse.tags;

describe('identify pages', () => {
    test("identify confirm-override page", () => {
        return loadMockPage("confirm-override").then(page => {
            expect(parse(page).type)
                .toBe(pageType.confirmOverride);
        })
    })

    test("identify auth-failed page", () => {
        return loadMockPage("auth-failed").then(page => {
            expect(parse(page).type)
                .toBe(pageType.authFailed);
        })
    })
})

