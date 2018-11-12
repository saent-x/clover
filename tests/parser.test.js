const test = require("ava");
const Parser = require("../lib/Parser");
const { loadMockPage } = require("../lib/util");
const { tags } = require("../lib/Matcher");

test("parse correct session id", async t => {
  const page = await loadMockPage("session");

  const parser = new Parser();
  const result = parser.parse(page);

  t.is(result.data.id, 52438975);
});

test("identify confirm-override page", async t => {
  const page = await loadMockPage("confirm-override");

  const parser = new Parser();
  const result = parser.parse(page);

  t.is(result.type, tags.confirmOverride);
});

test("identify auth-failed page", async t => {
  const page = await loadMockPage("auth-failed");

  const parser = new Parser();
  const result = parser.parse(page);

  t.is(result.type, tags.authenticationFailed);
});

test("identify session page", async t => {
  const page = await loadMockPage("session");

  const parser = new Parser();
  const result = parser.parse(page);

  t.is(result.type, tags.session);
});
