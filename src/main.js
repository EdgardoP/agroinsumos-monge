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

ipcMain.handle("obtenerHistorialProductos", (event, obj) => {
  obtenerHistorialProductos(obj);
});

const obtenerHistorialProductos = (obj) => {
  console.log(obj);
  const { proveedor } = obj;
  const { color } = obj;
  const { presentacion } = obj;
  const { categoria } = obj;
  db.query(
    `call historial_de_productos('${proveedor}','${presentacion}','${color}','${categoria}')`,
    (error, results, productos) => {
      if (error) {
        console.log(error);
      } else {
        ventanaPrincipal.webContents.send("historial_de_productos", results);
      }
    }
  );
};

ipcMain.handle("nuevoProducto", (event, obj, objLote) => {
  nuevoProducto(obj, objLote);
});

const nuevoProducto = (obj, objLote) => {
  const query = "INSERT INTO productos SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Error", "No se ha podido realizar la accion");
      ventanaPrincipal.webContents.send("producto_id", -1);
    } else {
      let lote_producto_fk = {
        lote_cantidad: 0,
        lote_producto_fk: results.insertId,
      };
      let datosLote = Object.assign(objLote, lote_producto_fk);
      nuevoLote(datosLote);
      notificacion("Transaccion exitosa", "Se ha ingresado un nuevo producto");
      ventanaPrincipal.webContents.send("producto_id", results.insertId);
    }
  });
};

//Lotes

ipcMain.handle("nuevoLote", (event, obj) => {
  nuevoLote(obj);
});

const nuevoLote = (obj) => {
  console.log(obj);
  const query = "INSERT INTO lotes SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      notificacion("Transaccion exitosa", "Se ha ingresado un nuevo Lote");
      ventanaPrincipal.webContents.send("lote_id", results.insertId);
    }
  });
};

ipcMain.handle("modificarMultiplesLotes", (event, obj) => {
  modificarMultiplesLotes(obj);
});

const modificarMultiplesLotes = (obj) => {
  console.log(obj);
  let querys = "";
  obj.forEach((element) => {
    querys += `UPDATE lotes SET lote_cantidad = ${element.lote_cantidad} WHERE lote_id = ${element.lote_id} ; `;
  });
  console.log(querys);
  db.query(querys, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
  });
};

ipcMain.handle("modificarLote", (event, obj) => {
  modificarLote(obj);
});

const modificarLote = (obj) => {
  const { lote_id } = obj;
  const { lote_cantidad } = obj;
  const query = "UPDATE lotes SET lote_cantidad = ? where lote_id = ?";
  db.query(query, lote_cantidad, lote_id, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      notificacion("Transaccion exitosa", "Se ha modificado el lote");
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

//Categorias
ipcMain.handle("obtenerCategorias", (event) => {
  obtenerCategorias();
});

const obtenerCategorias = () => {
  db.query("call lista_de_categorias", (error, results, categorias) => {
    if (error) {
      console.log("No se cargaron las categorias");
    } else {
      ventanaPrincipal.webContents.send("lista_de_categorias", results);
    }
  });
};

//entradas

ipcMain.handle("insertarMultiplesEntradas", (event, obj) => {
  insertarMultiplesEntradas(obj);
});

const insertarMultiplesEntradas = (obj) => {
  console.log(obj);
  const query =
    "INSERT INTO entradas (entradas_fecha, entradas_lote_fk, entrada_stock_antiguo, entrada_cantidad_ingresar, entrada_tipo_pago, entrada_otros_gastos, entrada_usuario_fk) VALUES ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      notificacion(
        "Transaccion Exitosa",
        "Se han ingresado los productos correctamente"
      );
      console.log(results);
    }
  });
};

module.exports = {
  crearLogin,
};
