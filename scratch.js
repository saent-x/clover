const { Api, Session } = require("./index");
const chalk = require("chalk").default;
const { syncSetInterval } = require("./lib/util.js");
const { loadMockPage } = require("./lib/util");
const Parser = require("./lib/Parser");

async function test() {
  const api = new Api();
  const username = "au00042";
  const password = "pass2011";

  console.log("logging in...");
  try {
    const { id } = await api.login(username, password, async () => {
      console.log("overriding login");
      return true;
    });

    console.log(`logged in as ${chalk.green(username)}`);

    const session = new Session(id);

    session.on("refresh", data => {
      console.log(
        `[${chalk.green(new Date().toLocaleTimeString())}] used: ${chalk.yellow(
          data.used
        )} | upload: ${chalk.cyan(data.upload)} | download | ${chalk.blueBright(
          data.download
        )}`
      );
    });

    session.on("close", e => {
      if (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function delay(max) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, Math.random() * max * 1000);
  });
}

function test2() {
  const handle = syncSetInterval(async () => {
    await delay(5);
    console.log(`fired at: ${new Date().getSeconds()}`);
  }, 2000);

  setTimeout(() => {
    handle.clear();
  }, 10000);
}

// test();

async function myFunc() {
  const parser = new Parser();
  const page = await loadMockPage("session");

  console.log(parser.parse(page));
}

myFunc();
