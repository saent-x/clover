const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

function loadMockPage(name) {
  const filePath = path.resolve(
    __dirname,
    "../tests/mock-pages/",
    name + ".html"
  );
  const readFile = promisify(fs.readFile);
  return readFile(filePath, { encoding: "utf-8" });
}

function syncSetInterval(callback, interval, delay) {
  let clearRequested;

  const update = async () => {
    if (clearRequested) return;

    await callback();

    handle = setTimeout(update, interval);
  };

  /* start the interval */
  setTimeout(update, delay || 0);

  return {
    clear: () => (clearRequested = true)
  };
}

module.exports = { loadMockPage, syncSetInterval };
