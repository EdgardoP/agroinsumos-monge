const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const ejse = require("ejs-electron");
const db = require("./database");
let ventanaLogin;
let ventanaPrincipal;
let ventanaEntrada;
let ventanaSalida;
let ventanaLiquidacionDiaria;
let ventanaRecuperacionesDiaria;
let ventanaVentasMesuales;
let ventanaContabilizarProductos;
let ventanaMostrarPlanilla;

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

function crearVerEntrada() {
  ventanaEntrada = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaEntrada.loadFile("src/ui/documento_historial_entrada.ejs");
}

function crearVerSalida() {
  ventanaSalida = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaSalida.loadFile("src/ui/documento_historial_salida.ejs");
}

function crearVerLiquidacionDiaria() {
  ventanaLiquidacionDiaria = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaLiquidacionDiaria.loadFile("src/ui/liquidacion_diaria_resumen.ejs");
}

function crearVerRecuperacionesDiaria() {
  ventanaRecuperacionesDiaria = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaRecuperacionesDiaria.loadFile("src/ui/recuperaciones_diaria.ejs");
}

function crearVentasMensuales() {
  ventanaVentasMesuales = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaVentasMesuales.loadFile("src/ui/ventas_mensuales.ejs");
}

function crearVentanaContabilizarProductos() {
  ventanaContabilizarProductos = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaContabilizarProductos.loadFile(
    "src/ui/ventana_contabilizar_productos.ejs"
  );
}

function crearVentanaMostrarPlanilla() {
  ventanaMostrarPlanilla = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaMostrarPlanilla.loadFile("src/ui/ventanaMostrarPlanilla.ejs");
}

let ventanaMostrarGastos;
function CrearVentanaMostrarGastosCaja() {
  ventanaMostrarGastos = new BrowserWindow({
    width: 1280,
    height: 1400,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ventanaMostrarGastos.loadFile("src/ui/gastos_caja_ventana.ejs");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // console.log(BrowserWindow.getFocusedWindow());
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

ipcMain.handle("cerrarVentana", (event) => {
  ventanaPrincipal.close();
});

ipcMain.handle("cerrarVentanaLogin", (event) => {
  ventanaLogin.close();
});

ipcMain.handle("maximizarVentana", (event) => {
  ventanaPrincipal.maximize();
});

ipcMain.handle("minimizarVentana", (event) => {
  ventanaPrincipal.minimize();
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
ipcMain.handle("obtenerInformacionProductos", (event) => {
  obtenerInformacionProductos();
});

const obtenerInformacionProductos = (obj) => {
  db.query("SELECT * FROM productos", (error, results, productos) => {
    if (error) {
      // console.log("No se cargaron los productos");
    } else {
      ventanaPrincipal.webContents.send("informacion_productos", results);
    }
  });
};

ipcMain.handle("modificarProducto", (event, obj) => {
  modificarProducto(obj);
});

const modificarProducto = (obj) => {
  const { producto_id } = obj;
  const { producto_nombre } = obj;
  const { producto_descripcion } = obj;
  const { producto_color } = obj;
  const { producto_categoria } = obj;

  let query = `UPDATE productos SET producto_nombre = '${producto_nombre}', producto_descripcion = '${producto_descripcion}', producto_color = '${producto_color}', producto_categoria_fk = '${producto_categoria}' WHERE producto_id = '${producto_id}'`;
  db.query(query, (error, results, productos) => {
    if (error) {
      console.log(error);
      notificacion(
        "Ha ocurrido un error",
        "No se ha podido actualizar este producto"
      );
    } else {
      console.log(results);
      notificacion("Actualizacion Exitosa", "Se ha modificado un producto");
    }
  });
};

ipcMain.handle("obtenerNombreProductos", (event) => {
  listaProductos();
});

const listaProductos = (obj) => {
  db.query("call lista_de_productos()", (error, results, productos) => {
    if (error) {
      notificacion(
        "Ha ocurrido un error",
        "No se ha podido cargar los productos este producto"
      );
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
        // console.log(error);
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
      // console.log(error);
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

ipcMain.handle("nuevoProductoMultiple", (event, obj, objLote) => {
  nuevoProductoMultiple(obj, objLote);
});

const nuevoProductoMultiple = (obj, objLote) => {
  const query = "INSERT INTO productos SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Error", "No se ha podido realizar la accion");
      // ventanaPrincipal.webContents.send("producto_id", -1);
    } else {
      let lote_producto_fk = {
        lote_producto_fk: results.insertId,
      };
      let datosLote = Object.assign(objLote, lote_producto_fk);
      nuevoLote(datosLote);
      notificacion("Transaccion exitosa", "Se ha ingresado un nuevo producto");
      // ventanaPrincipal.webContents.send("producto_id", results.insertId);
    }
  });
};

//Lotes

ipcMain.handle("contabilizarProductos", (event, obj) => {
  contabilizarProductos(obj);
});

const contabilizarProductos = (obj) => {
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
        crearVentanaContabilizarProductos();
        ventanaContabilizarProductos.webContents.once(
          "did-finish-load",
          function () {
            ventanaContabilizarProductos.webContents.send(
              "listado_de_productos",
              results
            );
          }
        );
        ventanaContabilizarProductos.show();
      }
    }
  );
};

ipcMain.handle("nuevoLote", (event, obj, cod) => {
  nuevoLote(obj, cod);
});

const nuevoLote = (obj, cod) => {
  // console.log(obj);
  const query = "INSERT INTO lotes SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(cod);
      if (cod === undefined) {
        notificacion("Transaccion exitosa", "Se ha ingresado un nuevo Lote");
      }
      ventanaPrincipal.webContents.send("lote_id", results.insertId);
      console.log(results);
    }
  });
};

ipcMain.handle("modificarMultiplesLotes", (event, obj) => {
  modificarMultiplesLotes(obj);
});

const modificarMultiplesLotes = (obj) => {
  // console.log(obj);
  let querys = "";
  obj.forEach((element, index, array) => {
    // console.log(index);
    querys += `call sumar_cantidad_lotes(${element.lote_id},${element.lote_cantidad});`;
  });
  console.log(querys);
  db.query(querys, (error, results, fields) => {
    if (error) {
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
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
  // console.log(obj);
  const query = "UPDATE lotes SET lote_cantidad = ? where lote_id = ?";
  db.query(query, [lote_cantidad, lote_id], (error, results, fields) => {
    if (error) {
      // console.log(error);
    } else {
      notificacion("Transaccion exitosa", "Se ha modificado el lote");
    }
  });
};

ipcMain.handle("desabilitar_lote", (event, id) => {
  desabilitarLote(id);
});
const desabilitarLote = (id) => {
  const query = `UPDATE lotes SET lote_estado = 'Inactivo' where lote_id = ${id}`;
  db.query(query, id, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(query);
      notificacion("Transaccion exitosa", "Se ha Deshabilitado el lote");
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
      // console.log("No se cargaron los proveedores");
    } else {
      ventanaPrincipal.webContents.send("lista_de_proveedores", results);
      // console.log(results);
    }
  });
};

ipcMain.handle("documentosHistorialProveedores", (event, obj) => {
  documentosHistorialProveedores();
});

const documentosHistorialProveedores = () => {
  db.query("SELECT * FROM proveedores", (error, results, historial) => {
    if (error) {
      // console.log(error);
    } else {
      results.forEach((element) => {
        db.query(
          `call documentos_historial_proveedores(${element.proveedor_id})`,
          (err, res, hist) => {
            if (err) {
              // console.log(err);
            } else {
              // console.log(res);
              ventanaPrincipal.webContents.send(
                "documentos_historial_proveedores",
                res
              );
            }
          }
        );
      });
      // console.log(results);
    }
  });
};
// console.log();
ipcMain.handle("historial_proveedor", (event, id, fechaInicial, fechaFinal) => {
  historialProveedor(id, fechaInicial, fechaFinal);
});

const historialProveedor = (id, fechaInicial, fechaFinal) => {
  let query = `call historial_proveedor(?,?,?)`;
  db.query(query, [id, fechaInicial, fechaFinal], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.once("did-finish-load", function () {
        ventanaPrincipal.webContents.send("historial_cuentas", results, id);
      });
      // console.log(results);
    }
  });
};

ipcMain.handle("nuevoProveedor", (event, obj, fecha) => {
  nuevoProveedor(obj, fecha);
});

const nuevoProveedor = (obj, fecha) => {
  const query = "INSERT INTO proveedores SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      let idProveedor = results.insertId;
      let objInicializar = {
        historial_proveedor_fk: idProveedor,
        historial_proveedor_fecha: fecha,
        historial_proveedor_detalle: "Proveedor Agregado Exitosamente",
        historial_proveedor_saldo_anterior: 0,
        historial_proveedor_aportacion: 0,
        historial_proveedor_saldo_nuevo: 0,
        historial_proveedor_tipo_aportacion: 0,
      };
      insertarAportacionProveedor(objInicializar);
      notificacion("Transaccion exitosa", "Se ha ingresado un nuevo Proveedor");
    }
  });
};

ipcMain.handle("modificarProveedor", (event, obj) => {
  modificarProveedor(obj);
});

const modificarProveedor = (obj) => {
  const { proveedor_id } = obj;
  const { proveedor_nombre } = obj;
  const { proveedor_numero } = obj;
  let query = ` UPDATE proveedores SET proveedor_nombre = '${proveedor_nombre}', proveedor_numero = '${proveedor_numero}' WHERE proveedor_id = ${proveedor_id};`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      notificacion("Proceso Exitoso", "Se ha modificado un proveedor");
    }
  });
};

ipcMain.handle("insertarAportacionProveedor", (event, obj) => {
  insertarAportacionProveedor(obj);
});

const insertarAportacionProveedor = (obj) => {
  // console.log(obj);
  const query = "INSERT INTO historial_proveedores SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
      console.log(error);
    } else {
      notificacion(
        "Transaccion exitosa",
        "Se ha ingresado una nueva aportacion"
      );
    }
  });
};

ipcMain.handle("insertarHistorialProveedor", (event, obj) => {
  insertarHistorialProveedor(obj);
});

const insertarHistorialProveedor = (obj) => {
  const { historial_proveedor_fk } = obj;
  const { historial_proveedor_fecha } = obj;
  const { historial_proveedor_detalle } = obj;
  const { historial_proveedor_aportacion } = obj;
  const { historial_proveedor_tipo_pago } = obj;
  console.log(obj);
  let query = `call insertar_historial_proveedor(?,?,?,?,?)`;
  db.query(
    query,
    [
      historial_proveedor_fk,
      historial_proveedor_aportacion,
      historial_proveedor_fecha,
      historial_proveedor_detalle,
      historial_proveedor_tipo_pago,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        notificacion("Transaccion Fallida", "Ha ocurrido un error");
      } else {
        console.log("/////////////////////////////////////////////////////");
        console.log(results);
        notificacion(
          "Transaccion Exitosa",
          "Se ha ingresado una nueva aportacion"
        );
      }
    }
  );
};
//Categorias
ipcMain.handle("obtenerCategorias", (event) => {
  obtenerCategorias();
});

const obtenerCategorias = () => {
  db.query("call lista_de_categorias", (error, results, categorias) => {
    if (error) {
      // console.log("No se cargaron las categorias");
    } else {
      ventanaPrincipal.webContents.send("lista_de_categorias", results);
    }
  });
};

ipcMain.handle("nuevaCategoria", (event, obj) => {
  nuevaCategoria(obj);
});

const nuevaCategoria = (obj) => {
  const query = "INSERT INTO categorias SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      // console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      notificacion("Transaccion exitosa", "Se ha ingresado un nueva Categoria");
    }
  });
};

ipcMain.handle("modificarCategoria", (event, obj) => {
  modificarCategoria(obj);
});

const modificarCategoria = (obj) => {
  const { categoria_id } = obj;
  const { categoria_nombre } = obj;
  const { categoria_descripcion } = obj;
  let query = ` UPDATE categorias SET categoria_nombre = '${categoria_nombre}', categoria_descripcion = '${categoria_descripcion}' WHERE categoria_id = ${categoria_id};`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      notificacion("Transaccion exitosa", "Se ha modificado una Categoria");
    }
  });
};

ipcMain.handle("eliminarCategoria", (event, id) => {
  eliminarCategoria(id);
});

const eliminarCategoria = (id) => {
  let query = `DELETE FROM categorias WHERE categoria_id = ${id};`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion(
        "Transaccion Fallida",
        "Esta categoria posee productos registrados"
      );
    } else {
      console.log(results);
      notificacion("Transaccion exitosa", "Se ha eliminado una Categoria");
    }
  });
};

//entradas

ipcMain.handle("insertarMultiplesEntradas", (event, obj) => {
  insertarMultiplesEntradas(obj);
});

const insertarMultiplesEntradas = (obj) => {
  console.log(obj);
  console.log(obj[0][7]);
  const entrada_num_serie = obj[0][7];
  // console.log(entrada_num_serie);
  const query =
    "INSERT INTO entradas (entradas_fecha, entradas_lote_fk, entrada_stock_antiguo, entrada_cantidad_ingresar, entrada_tipo_pago, entrada_otros_gastos, entrada_usuario_fk, entrada_num_serie) VALUES ?";
  db.query(query, [obj], (error, results, fields) => {
    if (error) {
      // console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      notificacion(
        "Transaccion Exitosa",
        "Se han ingresado los productos correctamente"
      );
      console.log(entrada_num_serie);
      historialEntradas(entrada_num_serie);
      // console.log(results);
    }
  });
};

ipcMain.handle(
  "cargar_historial_entradas",
  (event, fechaInicio, fechaFinal) => {
    cargarHistorialEntradas(fechaInicio, fechaFinal);
  }
);

const cargarHistorialEntradas = (fechaInicial, fechaFinal) => {
  const query = "call historial_entradas(?,?)";
  db.query(query, [fechaInicial, fechaFinal], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.send("historial_entradas", results);
    }
  });
};

ipcMain.handle("historial_entradas", (event, id) => {
  historialEntradas(id);
});

const historialEntradas = (id) => {
  const query = "call documento_entrada_historial(?)";
  db.query(query, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("No existe este Registro", "Intentalo de nuevo");
    } else {
      crearVerEntrada();
      ventanaEntrada.webContents.once("did-finish-load", function () {
        ventanaEntrada.webContents.send(
          "documento_historial_entrada",
          results,
          id
        );
      });
      ventanaEntrada.show();
    }
  });
};

//////////////Salidas

ipcMain.handle("cargar_historial_salidas", (event, fechaInicio, fechaFinal) => {
  cargar_historial_salidas(fechaInicio, fechaFinal);
});

const cargar_historial_salidas = (fechaInicio, fechaFinal) => {
  const query = "call historial_salidas(?,?)";
  db.query(query, [fechaInicio, fechaFinal], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.send("historial_salidas", results);
    }
  });
};
ipcMain.handle("historial_salidas", (event, id) => {
  historialSalidas(id);
});

const historialSalidas = (id) => {
  const query = "call documento_historial_salidas(?)";
  db.query(query, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      crearVerSalida();
      ventanaSalida.webContents.once("did-finish-load", function () {
        ventanaSalida.webContents.send(
          "documento_historial_salida",
          results,
          id
        );
      });
      ventanaSalida.show();
    }
  });
};

ipcMain.handle("insertarMultiplesSalidas", (event, obj) => {
  insertarMultiplesSalidas(obj);
});

const insertarMultiplesSalidas = (obj) => {
  console.log(obj);
  const salida_num_serie = obj[0][5];
  const query =
    "INSERT INTO salidas (salida_fecha, salida_lote_fk, salida_cantidad, salida_tipo_pago, salida_usuario_fk, salida_num_serie) VALUES ?";
  db.query(query, [obj], (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      notificacion(
        "Transaccion Exitosa",
        "Se han ingresado los productos correctamente"
      );
      historialSalidas(salida_num_serie);
      // console.log(results);
    }
  });
};

ipcMain.handle("ventasMensualesContado", (event, anio, mes) => {
  ventasMensualesContado(anio, mes);
});

const ventasMensualesContado = (anio, mes) => {
  let query = `call ventas_mensuales_contado(${anio},${mes})`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      crearVentasMensuales();
      ventanaVentasMesuales.webContents.once("did-finish-load", function () {
        ventanaVentasMesuales.webContents.send(
          "ventas_mensuales_contado",
          results,
          anio,
          mes
        );
      });
      ventanaVentasMesuales.show();
    }
  });
};

ipcMain.handle("ventasMensualesCredito", (event, anio, mes) => {
  ventasMensualesCredito(anio, mes);
});

const ventasMensualesCredito = (anio, mes) => {
  let query = `call ventas_mensuales_credito(${anio},${mes})`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaVentasMesuales.webContents.once("did-finish-load", function () {
        ventanaVentasMesuales.webContents.send(
          "ventas_mensuales_credito",
          results,
          anio,
          mes
        );
      });
    }
  });
};

ipcMain.handle("ventasDelDia", (event, fecha) => {
  ventasDelDia(fecha);
});

const ventasDelDia = (fecha) => {
  let query = `call ventasDelDia('${fecha}')`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      crearVerLiquidacionDiaria();
      ventanaLiquidacionDiaria.webContents.once("did-finish-load", function () {
        ventanaLiquidacionDiaria.webContents.send(
          "ventas_del_dia",
          results,
          fecha
        );
      });
      ventanaLiquidacionDiaria.show();
    }
  });
};

ipcMain.handle("aportacionesDelDia", (event, fecha) => {
  aportacionesDelDia(fecha);
});

const aportacionesDelDia = (fecha) => {
  let query = `call aportacionesDelDia('${fecha}')`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      // ventanaPrincipal.webContents.send("aportaciones_del_dia", results);
      ventanaLiquidacionDiaria.webContents.once("did-finish-load", function () {
        ventanaLiquidacionDiaria.webContents.send(
          "aportaciones_del_dia",
          results
        );
      });
      ventanaLiquidacionDiaria.show();
    }
  });
};

ipcMain.handle("salidasDelDia", (event, fecha) => {
  salidasDelDia(fecha);
});

const salidasDelDia = (fecha) => {
  let query = `call salidas_del_dia('${fecha}')`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      ventanaLiquidacionDiaria.webContents.once("did-finish-load", function () {
        ventanaLiquidacionDiaria.webContents.send("salidas_del_dia", results);
      });
      ventanaLiquidacionDiaria.show();
    }
  });
};

//Clientes

//Cargar Clientes

ipcMain.handle("insertarHistorialCliente", (event, obj) => {
  insertarHistorialCliente(obj);
});

const insertarHistorialCliente = (obj) => {
  const { historial_cliente_fk } = obj;
  const { historial_cliente_fecha } = obj;
  const { historial_cliente_detalle } = obj;
  const { historial_cliente_aportacion } = obj;
  const { historial_cliente_tipo_pago } = obj;
  const { historial_cliente_usuario_fk } = obj;
  let query = `call insertar_historial_cliente(?,?,?,?,?,?)`;
  db.query(
    query,
    [
      historial_cliente_fk,
      historial_cliente_aportacion,
      historial_cliente_fecha,
      historial_cliente_detalle,
      historial_cliente_tipo_pago,
      historial_cliente_usuario_fk,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        notificacion("Transaccion Fallida", "Ha ocurrido un error");
      } else {
        console.log(results);
        notificacion(
          "Transaccion Exitosa",
          "Se ha ingresado una nueva aportacion"
        );
      }
    }
  );
};

ipcMain.handle("obtenerClientes", (event) => {
  obtenerClientes();
});

const obtenerClientes = () => {
  db.query("SELECT * FROM Clientes", (error, results, proveedores) => {
    if (error) {
      console.log("No se cargaron los proveedores");
    } else {
      ventanaPrincipal.webContents.send("lista_de_clientes", results);
      console.log(results);
    }
  });
};

ipcMain.handle("modificarCliente", (event, obj) => {
  modificarCliente(obj);
});

const modificarCliente = (obj) => {
  const { cliente_id } = obj;
  const { cliente_nombre } = obj;
  const { cliente_apellido } = obj;
  const { cliente_referencia } = obj;
  let query = `UPDATE clientes SET cliente_nombre = '${cliente_nombre}', cliente_apellido = '${cliente_apellido}', cliente_referencia = '${cliente_referencia}' WHERE cliente_id = ${cliente_id}`;
  db.query(query, (error, results, proveedores) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      notificacion("Transaccion Exitosa", "Se ha modificado un cliente");
    }
  });
};

//Nuevo Cliente

ipcMain.handle("nuevoCliente", (event, obj, fecha) => {
  nuevoCliente(obj, fecha);
});

const nuevoCliente = (obj, fecha) => {
  const query = "INSERT INTO clientes SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      console.log(results);
      let idCliente = results.insertId;
      let objInicializar = {
        historial_cliente_fk: idCliente,
        historial_cliente_fecha: fecha,
        historial_cliente_detalle: "Cliente Agregado Exitosamente",
        historial_cliente_saldo_anterior: 0,
        historial_cliente_aportacion: 0,
        historial_cliente_saldo_nuevo: 0,
        historial_cliente_tipo_aportacion: "0",
        historial_cliente_usuario_fk: 1,
      };
      insertarAportacionCliente(objInicializar);
      notificacion("Transaccion exitosa", "Se ha ingresado un nuevo Cliente");
    }
  });
};

ipcMain.handle("insertarAportacionCliente", (event, obj) => {
  insertarAportacionCliente(obj);
});

const insertarAportacionCliente = (obj) => {
  // console.log(obj);
  const query = "INSERT INTO historial_clientes SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      notificacion(
        "Transaccion exitosa",
        "Se ha ingresado una nueva aportacion a los clientes"
      );
    }
  });
};

ipcMain.handle("recuperacionesClientesDia", (event, fecha) => {
  recuperacionesClientesDia(fecha);
});

const recuperacionesClientesDia = (fecha) => {
  let query = `call recuperaciones_clientes_dia('${fecha}')`;
  db.query(query, (error, results, filas) => {
    if (error) {
      console.log(error);
    } else {
      crearVerRecuperacionesDiaria();
      ventanaRecuperacionesDiaria.webContents.once(
        "did-finish-load",
        function () {
          ventanaRecuperacionesDiaria.webContents.send(
            "recuperaciones_clientes",
            results,
            fecha
          );
        }
      );
      ventanaRecuperacionesDiaria.show();
    }
  });
};

ipcMain.handle("documentosHistorialClientes", (event, obj) => {
  documentosHistorialClientes();
});

const documentosHistorialClientes = () => {
  db.query("SELECT * FROM clientes", (error, results, historial) => {
    if (error) {
      console.log(error);
    } else {
      results.forEach((element) => {
        db.query(
          `call documentos_historial_clientes(${element.cliente_id})`,
          (err, res, hist) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res);
              ventanaPrincipal.webContents.send(
                "documentos_historial_clientes",
                res
              );
            }
          }
        );
      });
      // console.log(results);
    }
  });
};

ipcMain.handle("historial_clientes", (event, id, fechaInicial, fechaFinal) => {
  historialClientes(id, fechaInicial, fechaFinal);
});

const historialClientes = (id, fechaInicial, fechaFinal) => {
  let query = `call historial_clientes(?,?,?)`;
  db.query(query, [id, fechaInicial, fechaFinal], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.once("did-finish-load", function () {
        ventanaPrincipal.webContents.send(
          "historial_cuentas_clientes",
          results,
          id
        );
      });
      // console.log(results);
    }
  });
};

ipcMain.handle("historial_gastos_caja", (event) => {
  historial_gastos_caja();
});

const historial_gastos_caja = () => {
  let query = `call historial_gastos_caja()`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.once("did-finish-load", function () {
        ventanaPrincipal.webContents.send("historial_gastos_caja", results);
      });
      // console.log(results);
    }
  });
};

//Planillas
ipcMain.handle("historial_planillas", (event) => {
  historial_planillas();
});

const historial_planillas = () => {
  let query = `call historial_planillas`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaPrincipal.webContents.once("did-finish-load", function () {
        ventanaPrincipal.webContents.send("historial_planillas", results);
      });
      // console.log(results);
    }
  });
};

ipcMain.handle("insertar_nueva_planilla", (event, obj) => {
  insertarNuevaPlanilla(obj);
});

const insertarNuevaPlanilla = (obj) => {
  // console.log(obj);
  const query = "INSERT INTO planillas SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      notificacion("Transaccion exitosa", "Se ha ingresado una nueva planilla");
    }
  });
};

ipcMain.handle("insertar_nuevo_gasto", (event, obj) => {
  insertar_nuevo_gasto(obj);
});

const insertar_nuevo_gasto = (obj) => {
  // console.log(obj);
  const query = "INSERT INTO gastos_caja SET ?";
  db.query(query, obj, (error, results, fields) => {
    if (error) {
      console.log(error);
      notificacion("Transaccion Fallida", "Ha ocurrido un error");
    } else {
      notificacion(
        "Transaccion exitosa",
        "Se ha ingresado un nuevo Gasto de Caja"
      );
    }
  });
};

ipcMain.handle("mostrar_planilla_documento", (event, id) => {
  mostrar_planilla_documento(id);
});

const mostrar_planilla_documento = (id) => {
  const query = "call mostrar_planilla_documento(?)";
  db.query(query, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      crearVentanaMostrarPlanilla();
      ventanaMostrarPlanilla.webContents.once("did-finish-load", function () {
        ventanaMostrarPlanilla.webContents.send(
          "documento_planilla",
          results,
          id
        );
      });
      ventanaMostrarPlanilla.show();
    }
  });
};

ipcMain.handle("mostrar_gastos_caja_documento", (event, id) => {
  mostrar_gastos_caja_documento(id);
});

const mostrar_gastos_caja_documento = (id) => {
  const query = "call mostrar_gastos_caja_documento(?)";
  db.query(query, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      CrearVentanaMostrarGastosCaja();
      ventanaMostrarGastos.webContents.once("did-finish-load", function () {
        ventanaMostrarGastos.webContents.send("documento_gastos", results, id);
      });
      ventanaMostrarGastos.show();
    }
  });
};

ipcMain.handle("salariosDelMes", (event, anio, mes) => {
  salariosDelMes(anio, mes);
});

const salariosDelMes = (anio, mes) => {
  let query = `call salariosDelMes(${anio},${mes})`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaVentasMesuales.webContents.once("did-finish-load", function () {
        ventanaVentasMesuales.webContents.send(
          "salariosDelMes",
          results,
          anio,
          mes
        );
      });
    }
  });
};

ipcMain.handle("gastosDelMes", (event, anio, mes) => {
  gastosDelMes(anio, mes);
});

const gastosDelMes = (anio, mes) => {
  let query = `call gastosDelMes(${anio},${mes})`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      ventanaVentasMesuales.webContents.once("did-finish-load", function () {
        ventanaVentasMesuales.webContents.send(
          "gastosDelMes",
          results,
          anio,
          mes
        );
      });
    }
  });
};

module.exports = {
  crearLogin,
};
