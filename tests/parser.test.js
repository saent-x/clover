const { parse, pageTags } = require("../lib/parser");
const { loadMockPage } = require("../lib/util");

test("parse correct session id", async () => {
    const page = await loadMockPage("session");
    expect(parse(page).data.Id).toBe(52438975);
});

describe('identify pages', async () => {
    test("identify confirm-override page", () => {
        const page = await loadMockPage("confirm-override");
        expect(parse(page).type).toBe(pageTags.confirmOverride);
    });

    test("identify auth-failed page", async () => {
        const page = await loadMockPage("auth-failed");
        expect(parse(page).type).toBe(pageTags.authFailed);
    });

    test("identify session page", async () => {
        const page = await loadMockPage("session");
        expect(parse(page).type).toBe(pageTags.session);
    })
});

