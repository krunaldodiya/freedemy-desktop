const electron = require("electron");
const app = electron.remote.app;
const userData = app.getPath("home");
const filename = `${userData}/db/freedemy.db`;

const Datastore = require("nedb");
const db = new Datastore({
  filename,
  autoload: true
});

export default db;
