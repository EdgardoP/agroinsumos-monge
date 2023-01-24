const { crearLogin } = require("./main");
const { app } = require("electron");

app.whenReady().then(crearLogin);
