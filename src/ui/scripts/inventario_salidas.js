const { ipcRenderer } = require("electron");

//Inputs del dashboard entradas
let btnAsociarCliente = document.getElementById("btnAsociarCliente");
let salidaProductoNombre = document.getElementById("salida_producto_nombre");
let salidaProductoDescripcion = document.getElementById(
  "salida_producto_descripcion"
);
let salidaLotePresentacion = document.getElementById(
  "salida_lote_presentacion"
);
let salidaId = document.getElementById("salida_id");
let salidaFecha = document.getElementById("salida_fecha");
let salidaLoteFk = document.getElementById("salida_lote_fk");
let salidaLoteProductoFk = document.getElementById("salida_lote_producto_fk");
let salidaStockActual = document.getElementById("salida_stock_actual");
let salidaCantidad = document.getElementById("salida_cantidad");
let salidaTipoPago = document.getElementById("salida_tipo_pago");
let salidaValorUnitarioVenta = document.getElementById(
  "salida_valor_unitario_venta"
);
let salidaFechaVencimiento = document.getElementById(
  "salida_lote_fecha_vencimiento"
);

let clienteNombre = document.getElementById("cliente_nombre");
let clienteApellido = document.getElementById("cliente_apellido");
let clienteReferencia = document.getElementById("cliente_referencia");
let clienteEstado = document.getElementById("cliente_estado");
let tablaSalidas = document.getElementById("tablaSalidas");
let listaClientes = document.getElementById("lista_clientes");
let clienteSalida = document.getElementById("cliente_salida");

let idDocumento;
document.addEventListener("DOMContentLoaded", function () {
  idDocumento = Math.random() * (9999 - 1) + 1;
  salidaId.value = idDocumento;
  obtenerNombreProductos();
  salidaFecha.value = obtenerFecha("YYYY/MM/DD");
  autocomplete(salidaProductoNombre, listaDeProductosNombre);
  autocomplete(salidaLoteProductoFk, listaDeProductosId);
  obtenerClientes();
  salidaProductoNombre.focus();
});

function soloLetras(obj) {
  obj.value = obj.value.replace(/[0-9]/g, "");
}

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9,.]/g, "");
}
//Funcion para obtener la fecha del sistema
const obtenerFecha = (formato) => {
  let nuevaFecha = Date.now();
  const fechaHoy = new Date(nuevaFecha);
  let fechaActualIso = fechaHoy.toISOString();
  let fechaParse = new Date(fechaActualIso),
    mes = ("0" + (fechaParse.getMonth() + 1)).slice(-2),
    dia = ("0" + fechaParse.getDate()).slice(-2);
  let fechaAnioMesDia = (fechaOrdenada = [
    fechaParse.getFullYear(),
    mes,
    dia,
  ].join("-"));
  let fechaDiaMesAnio = (fechaOrdenada = [
    dia,
    mes,
    fechaParse.getFullYear(),
  ].join("-"));
  return formato === "YYYY/MM/DD" ? fechaAnioMesDia : fechaDiaMesAnio;
};

const convertirFecha = (fecha) => {
  let fechaParse = new Date(fecha),
    mes = ("0" + (fechaParse.getMonth() + 1)).slice(-2),
    dia = ("0" + fechaParse.getDate()).slice(-2);
  let fechaAnioMesDia = (fechaOrdenada = [
    fechaParse.getFullYear(),
    mes,
    dia,
  ].join("-"));
  return fechaAnioMesDia;
};

//Funcion para eliminar las filas
const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
  salidaProductoNombre.focus();
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  let busqueda = index.children[2].innerHTML;
  let cantidadSalida = index.children[6].innerHTML;
  let tipoPago = index.children[8].innerHTML;
  // console.log(busqueda);
  let elementoTabla = listaDeProductosRaw.find(
    (element) => element.lote_id == busqueda
  );
  console.log(elementoTabla);
  salidaLoteFk.value = elementoTabla.lote_id;
  salidaLoteProductoFk.value = elementoTabla.producto_id;
  salidaProductoNombre.value = elementoTabla.producto_nombre;
  salidaProductoDescripcion.value = elementoTabla.producto_descripcion;
  salidaLotePresentacion.value = elementoTabla.lote_presentacion;
  salidaStockActual.value = elementoTabla.lote_cantidad;
  salidaValorUnitarioVenta.value = elementoTabla.lote_valor_unitario_venta;
  salidaCantidad.value = cantidadSalida;
  salidaTipoPago.value = tipoPago;
  salidaFechaVencimiento.value = convertirFecha(
    elementoTabla.lote_fecha_vencimiento
  );
  index.remove();
  agregarColorFilas(filasElementos);
};
//Funcion para obtener los nombres de los productos de la base de datos
const obtenerNombreProductos = async () => {
  await ipcRenderer.invoke("obtenerNombreProductos");
};

let listaDeProductosRaw = [];
let listaDeProductosNombre = [];
let listaDeProductosId = [];

ipcRenderer.on("lista_de_productos", (event, results) => {
  listaDeProductosRaw = results[0];
  listaDeProductosRaw.forEach((element, index) => {
    listaDeProductosId.push(
      element.producto_id +
        " " +
        element.producto_nombre +
        " " +
        element.lote_presentacion +
        " L." +
        element.lote_valor_unitario_venta +
        " Stock: " +
        element.lote_cantidad
    );
    listaDeProductosNombre.push(
      element.producto_nombre +
        " " +
        element.lote_presentacion +
        " L." +
        element.lote_valor_unitario_venta +
        " Stock: " +
        element.lote_cantidad
    );
  });
});

//Funcion para agregar un nuevo producto
const confirmarEntradas = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let valoresModificar = [];
  let loteModificar = {};
  let datosHistorialCliente = {};
  let salidas = [];
  let nuevoHistorialCliente = [];

  for (let index = 0; index < filasElementos.length; index++) {
    let datosSalidas = [];
    if (filasElementos[index].children[8].innerHTML === "Credito") {
      let cantidadProducto = parseInt(
        filasElementos[index].children[6].innerHTML
      );
      let cantidadPrecioVenta = parseInt(
        filasElementos[index].children[5].innerHTML
      );
      let totalVenta = cantidadProducto * cantidadPrecioVenta;
      datosHistorialCliente = {
        historial_cliente_fk: clienteSalida.value,
        historial_cliente_fecha: salidaFecha.value,
        historial_cliente_detalle: `${filasElementos[index].children[3].innerHTML} ${filasElementos[index].children[4].innerHTML} ${filasElementos[index].children[6].innerHTML} x ${filasElementos[index].children[5].innerHTML}`,
        historial_cliente_aportacion: totalVenta,
        historial_cliente_tipo_pago:
          filasElementos[index].children[8].innerHTML,
        historial_cliente_usuario_fk: 1,
      };
      nuevoHistorialCliente.push(datosHistorialCliente);
      await ipcRenderer.invoke(
        "insertarHistorialCliente",
        datosHistorialCliente
      );
    }
    let usuario = 1;
    datosSalidas.push(salidaFecha.value);
    datosSalidas.push(filasElementos[index].children[2].innerHTML);
    datosSalidas.push(filasElementos[index].children[6].innerHTML);
    datosSalidas.push(filasElementos[index].children[8].innerHTML);
    datosSalidas.push(usuario);
    datosSalidas.push(idDocumento);
    salidas.push(datosSalidas);
    loteModificar = {
      lote_cantidad: parseInt(filasElementos[index].children[6].innerHTML) * -1,
      lote_id: filasElementos[index].children[2].innerHTML,
    };
    console.log(loteModificar);
    valoresModificar.push(loteModificar);
  }
  if (valoresModificar.length > 0 && salidas.length > 0) {
    await ipcRenderer.invoke("modificarMultiplesLotes", valoresModificar);
    await ipcRenderer.invoke("insertarMultiplesSalidas", salidas);

    listaDeProductosRaw = [];
    listaDeProductosNombre = [];
    listaDeProductosId = [];
    obtenerNombreProductos();
    autocomplete(salidaProductoNombre, listaDeProductosNombre);
    autocomplete(salidaLoteProductoFk, listaDeProductosId);
    window.location.reload();
  } else {
    console.log("No has agregado nada aun");
    tablaSalidas.parentNode.parentNode.classList.add("tablaTransicion");
    tablaSalidas.parentNode.parentNode.style.backgroundColor = "#d0393996";
    setTimeout(() => {
      tablaSalidas.parentNode.parentNode.style.backgroundColor = "#fff";
    }, "1000");
  }
};

const validarCliente = () => {
  if (
    clienteNombre.value != "" &&
    clienteApellido.value != "" &&
    clienteReferencia.value != ""
  ) {
    nuevoCliente();
  } else {
    if (clienteNombre.value == "") {
      clienteNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteNombre.parentNode.style.boxShadow = "none";
    }
    if (clienteApellido.value == "") {
      clienteApellido.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteApellido.parentNode.style.boxShadow = "none";
    }
    if (clienteReferencia.value == "") {
      clienteReferencia.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteReferencia.parentNode.style.boxShadow = "none";
    }
  }
};

const validar = () => {
  if (
    salidaLoteProductoFk.value != "" &&
    salidaProductoNombre.value != "" &&
    salidaStockActual.value > 0 &&
    salidaCantidad.value > 0 &&
    salidaTipoPago.value != "-1"
  ) {
    if (salidaTipoPago.value == "Credito") {
      clienteSalida.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
      btnAsociarCliente.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 10px 10px";
      if (clienteSalida.value != "0") {
        salidaTipoPago.parentNode.style.boxShadow = "none";
        btnAsociarCliente.style.boxShadow = "none";
        agregarSalidaLista();
      }
    } else {
      salidaTipoPago.parentNode.style.boxShadow = "none";
      btnAsociarCliente.style.boxShadow = "none";
      agregarSalidaLista();
    }
  } else {
    if (salidaLoteProductoFk.value == "") {
      salidaLoteProductoFk.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      salidaLoteProductoFk.parentNode.style.boxShadow = "none";
    }
    if (salidaProductoNombre.value == "") {
      salidaProductoNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      salidaProductoNombre.parentNode.style.boxShadow = "none";
    }
    if (salidaStockActual.value <= 0) {
      salidaStockActual.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      salidaStockActual.parentNode.style.boxShadow = "none";
    }
    if (salidaCantidad.value <= 0 || salidaCantidad.value == "") {
      salidaCantidad.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      salidaCantidad.parentNode.style.boxShadow = "none";
    }
    if (salidaTipoPago.value == "-1") {
      salidaTipoPago.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      salidaTipoPago.parentNode.style.boxShadow = "none";
    }
  }
};

const quitarColorError = () => {
  clienteNombre.parentNode.style.boxShadow = "none";
  clienteApellido.parentNode.style.boxShadow = "none";
  clienteReferencia.parentNode.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
  btnAsociarCliente.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
  salidaLoteProductoFk.parentNode.style.boxShadow = "none";
  salidaProductoNombre.parentNode.style.boxShadow = "none";
  salidaStockActual.parentNode.style.boxShadow = "none";
  salidaCantidad.parentNode.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
};

let cantidad_filas_ingresadas = 0;

const agregarSalidaLista = () => {
  quitarColorError();
  salidaLoteProductoFk.parentNode.style.boxShadow = "none";
  salidaProductoNombre.parentNode.style.boxShadow = "none";
  salidaStockActual.parentNode.style.boxShadow = "none";
  salidaCantidad.parentNode.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
  salidaTipoPago.parentNode.style.boxShadow = "none";
  btnAsociarCliente.style.boxShadow = "none";
  clienteSalida.parentNode.style.boxShadow = "none";
  // console.log(filasElementos[0]);

  cantidad_filas_ingresadas++;
  let plantilla = "";
  let elementoTabla = listaDeProductosRaw.find(
    (element) => element.lote_id == salidaLoteFk.value
  );
  // console.log(elementoTabla);
  let idProveedor = elementoTabla.proveedor_id;
  let stockAntiguo = parseInt(salidaStockActual.value);
  let valorUnitVenta = parseInt(salidaValorUnitarioVenta.value);
  let nuevaSalida = parseInt(salidaCantidad.value);
  let subtotal = nuevaSalida * valorUnitVenta;
  let filasElementos = document.getElementsByClassName("filasElementos");
  let valorLote = salidaLoteFk.value;
  let sumaCantidades;
  // let cantidadSalidaLista;
  let BANDERA = false;
  let CREAR = true;
  let contarStock = 0;
  let tipoPago = salidaTipoPago.value;
  for (let index = 0; index < filasElementos.length; index++) {
    let VALOR_LOTE_LISTA = filasElementos[index].children[2].innerHTML;
    let VALOR_TIPO_PAGO = filasElementos[index].children[8].innerHTML;
    let cantidadSalidaLista = parseInt(
      filasElementos[index].children[6].innerHTML
    );
    if (valorLote === VALOR_LOTE_LISTA) {
      BANDERA = true;
      contarStock += cantidadSalidaLista;
      console.log(contarStock);
    }
  }
  if (BANDERA === true) {
    contarStock += nuevaSalida;
    console.log(contarStock);
    if (contarStock > stockAntiguo) {
      CREAR = false;
      location.href = "#modal_advertencia";
    }
  }
  if (CREAR === true) {
    plantilla += `
    <tr id = "${idProveedor}" class = "filasElementos">
      <td style="min-width: 20px; max-width: 20px; width: 20px;">${cantidad_filas_ingresadas}</td>
      <td style="min-width: 80px; max-width: 80px; width: 80px">${elementoTabla.producto_id}</td>
      <td style="min-width: 60px; max-width: 60px; width: 60px">${elementoTabla.lote_id}</td>
      <td style="min-width: 200px; max-width: 200px; width: 200px">${elementoTabla.producto_nombre}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${elementoTabla.lote_presentacion}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${elementoTabla.lote_valor_unitario_venta}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${nuevaSalida}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${stockAntiguo}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${tipoPago}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">${subtotal}</td>
      <td style="min-width: 120px; max-width: 120px; width: 120px">
            <div>
              <button 
              tabindex="-1"
              id = ${cantidad_filas_ingresadas}
                onclick="modificarFila();event.preventDefault()"
                class="accionesBoton colorSecundario">
                <img id = ${cantidad_filas_ingresadas}
                src="icons/edit-button.png" alt="" />

              </button>
              <button
              tabindex="-1"  
              id = ${cantidad_filas_ingresadas}
                onclick="eliminarFila();event.preventDefault()"
                class="btnEliminarFila accionesBoton colorRojo">
                <img id = ${cantidad_filas_ingresadas} src="icons/cancel.png" alt="" />
              </button>
            </div>
      </td>
    </tr>`;
    tablaSalidas.innerHTML += plantilla;
    limpiarTextos();
    let filasElementos = document.getElementsByClassName("filasElementos");
    agregarColorFilas(filasElementos);
  }
  // limpiarTextos();
};

const agregarColorFilas = (filas) => {
  for (let index = 0; index < filas.length; index++) {
    filas[index].classList.remove("filasColor");
  }

  for (let index = 0; index < filas.length; index++) {
    if (index % 2 == 0) {
      filas[index].classList.add("filasColor");
    }
  }
};

//Funcion de autompletado
function autocomplete(inp, arr) {
  let focusActual;
  inp.addEventListener("input", function (e) {
    let contenedorItems;
    let items;
    let i;
    let val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    focusActual = -1;
    contenedorItems = document.createElement("div");
    contenedorItems.setAttribute("id", this.id + "lista-autocompletado");
    contenedorItems.setAttribute("class", "items-autocompletado");
    this.parentNode.appendChild(contenedorItems);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        items = document.createElement("div");
        items.innerHTML =
          "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        items.innerHTML += arr[i].substr(val.length);
        items.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        //Añadir el atributo id segun el indice que tiene en la lista de productos
        items.setAttribute("id", i);
        items.addEventListener("click", function (e) {
          //capturo el indice con la variable e, mediante target.id
          let indice = e.target.id;
          if (listaDeProductosRaw[indice].lote_cantidad === 0) {
            window.location.href = "#modal_lote_vacio";
            limpiarTextos();
            salidaProductoNombre.focus();
          } else {
            salidaLoteProductoFk.value =
              listaDeProductosRaw[indice].producto_id;
            salidaLoteFk.value = listaDeProductosRaw[indice].lote_id;
            salidaProductoDescripcion.value =
              listaDeProductosRaw[indice].producto_descripcion;
            salidaLotePresentacion.value =
              listaDeProductosRaw[indice].lote_presentacion;
            salidaStockActual.value = listaDeProductosRaw[indice].lote_cantidad;
            salidaFechaVencimiento.value = `${convertirFecha(
              listaDeProductosRaw[indice].lote_fecha_vencimiento
            )}`;
            salidaValorUnitarioVenta.value = parseInt(
              listaDeProductosRaw[indice].lote_valor_unitario_venta
            ).toFixed(2);
            salidaProductoNombre.value =
              listaDeProductosRaw[indice].producto_nombre;
            closeAllLists();
            salidaCantidad.focus();
          }
        });
        contenedorItems.appendChild(items);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "lista-autocompletado");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      focusActual++;
      addActive(x);
    } else if (e.keyCode == 38) {
      focusActual--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (focusActual > -1) {
        if (x) x[focusActual].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (focusActual >= x.length) focusActual = 0;
    if (focusActual < 0) focusActual = x.length - 1;
    x[focusActual].classList.add("autompletado-activo");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autompletado-activo");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("items-autocompletado");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const obtenerClientes = async () => {
  await ipcRenderer.invoke("obtenerClientes");
};

let listaDeClientesRaw = [];
ipcRenderer.on("lista_de_clientes", (event, results) => {
  console.log(results);
  let plantilla = "";
  listaDeClientesRaw = results;
  listaDeClientesRaw.forEach((element) => {
    plantilla += `<option value = ${element.cliente_id} > ${element.cliente_nombre} ${element.cliente_apellido} ${element.cliente_referencia}</option>`;
  });
  let nullOption = `<option value = 0>Ninguno</option>`;
  listaClientes.innerHTML = nullOption + plantilla;
  clienteSalida.innerHTML = nullOption + plantilla;
});

const limpiarTextos = () => {
  quitarColorError();
  salidaProductoNombre.focus();
  salidaLoteProductoFk.value = "";
  salidaLoteFk.value = "";
  salidaProductoNombre.value = "";
  salidaProductoDescripcion.value = "";
  salidaLotePresentacion.value = "";
  salidaStockActual.value = "";
  salidaValorUnitarioVenta.value = "";
  salidaCantidad.value = "";
  salidaTipoPago.value = "-1";
  salidaFechaVencimiento.value = "";
};

const nuevoCliente = async () => {
  location.href = "#modal_asociar_cliente";
  let fecha = salidaFecha.value;
  const obj = {
    cliente_nombre: clienteNombre.value,
    cliente_apellido: clienteApellido.value,
    cliente_referencia: clienteReferencia.value,
    cliente_estado: "Activo",
  };
  await ipcRenderer.invoke("nuevoCliente", obj, fecha);
  listaDeClientesRaw = [];
  obtenerClientes();
};

const copiarNombreCliente = () => {
  clienteSalida.value = listaClientes.value;
};
