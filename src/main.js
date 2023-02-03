const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const ejse = require("ejs-electron");
const db = require("./database");
let ventanaLogin;
let ventanaPrincipal;

function crearLogin() {
  ventanaLogin = new BrowserWindow({
    width: 1000,
    height: 500,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaLogin.loadFile("src/ui/login.html");
}

function crearPrincipal() {
  ventanaPrincipal = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaPrincipal.loadFile("src/ui/index.ejs");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log(BrowserWindow.getFocusedWindow());
    createWindow();
  }
});

if (process.platform === "win32") {
  app.setAppUserModelId(app.name);
}

app.disableHardwareAcceleration();

const notificacion = (titulo, mensaje) => {
  new Notification({
    title: titulo,
    body: mensaje,
  }).show();
};

ipcMain.handle("iniciarSesion", (event, obj) => {
  iniciarSesion(obj);
});

// Login

const iniciarSesion = (obj) => {
  const { usuario_nombre, usuario_contraseña } = obj;
  const query =
    "SELECT * FROM usuarios WHERE usuario_nombre = ? and usuario_contraseña = ?;";
  db.query(
    query,
    [usuario_nombre, usuario_contraseña],
    (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        crearPrincipal();
        ventanaPrincipal.show();
        ventanaLogin.close();
        notificacion("Inicio de Sesion", "Bienvenid@");
      } else {
        notificacion("Inicio de Sesion", "No se ha encontrado este usuario");
      }
    }
  );
};

// Productos
ipcMain.handle("obtenerNombreProductos", (event) => {
  listaProductos();
});

const listaProductos = (obj) => {
  db.query("call lista_de_productos()", (error, results, productos) => {
    if (error) {
      console.log("No se cargaron los productos");
    } else {
      ventanaPrincipal.webContents.send("lista_de_productos", results);
    }
  });
};

//Proveedores
ipcMain.handle("obtenerProveedores", (event) => {
  obtenerProveedores();
});

const obtenerProveedores = () => {
  db.query("call obtener_proveedores()", (error, results, proveedores) => {
    if (error) {
      console.log("No se cargaron los proveedores");
    } else {
      ventanaPrincipal.webContents.send("lista_de_proveedores", results);
    }
  });
};

module.exports = {
  crearLogin,
};
