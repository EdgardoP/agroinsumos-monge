const { BrowserWindow } = require("electron");

let ventanaLogin;

function crearLogin() {
  ventanaLogin = new BrowserWindow({
    width: 1000,
    height: 500,
    frame: false,
    maximizable: false,
    minHeight: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  ventanaLogin.loadFile("src/ui/login.html");
}

module.exports = {
  crearLogin,
};
