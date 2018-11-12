const test = require("ava");
const Parser = require("../lib/Parser");
const { loadMockPage } = require("../lib/util");
const { tags } = require("../lib/Matcher");

test("parse correct session id", async t => {
  const parser = new Parser();
  const page = await loadMockPage("session");
  t.is(parser.parse(page).data.id, 52438975);
});

test("identify confirm-override page", async t => {
  const parser = new Parser();
  const page = await loadMockPage("confirm-override");
  t.is(parser.parse(page).type, tags.confirmOverride);
});

test("identify auth-failed page", async t => {
  const parser = new Parser();
  const page = await loadMockPage("auth-failed");
  t.is(parser.parse(page).type, tags.authenticationFailed);
});

test("identify session page", async t => {
  const parser = new Parser();
  const page = await loadMockPage("session");
  t.is(parser.parse(page).type, tags.session);
});
