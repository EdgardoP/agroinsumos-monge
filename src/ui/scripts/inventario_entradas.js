const { ipcRenderer } = require("electron");

let productoNombre = document.getElementById("producto_nombre");
let productoDescripcion = document.getElementById("producto_descripcion");
let productoProveedorId = document.getElementById("producto_proveedor_fk");
let producto_proveedor_fk = document.getElementById("producto_proveedor_fk");
let productoColor = document.getElementById("producto_color");
let productoCategoriaFk = document.getElementById("producto_categoria_fk");
let lotePresentacion = document.getElementById("lote_presentacion");
let valorUnitarioCompra = document.getElementById("lote_valor_unitario_compra");
let valorUnitarioVenta = document.getElementById("lote_valor_unitario_venta");
let entradaId = document.getElementById("entrada_id");
let entradaFecha = document.getElementById("entrada_fecha");
let entradaLoteFk = document.getElementById("entrada_lote_fk");
let loteProductoFk = document.getElementById("lote_producto_fk");
let stockActual = document.getElementById("stock_actual");
let entradaCantidadIngresar = document.getElementById(
  "entrada_cantidad_ingresar"
);
let entradaOtrosGastos = document.getElementById("entrada_otros_gastos");
let entradaTipoPago = document.getElementById("entrada_tipo_pago");

document.addEventListener("DOMContentLoaded", function () {
  obtenerNombreProductos();
  obtenerProveedores();
  entradaFecha.value = obtenerFecha("YYYY/MM/DD");
  autocomplete(productoNombre, listaDeProductosNombre);
  autocomplete(loteProductoFk, listaDeProductosId);
  productoNombre.focus();
});

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

const obtenerProveedores = async () => {
  await ipcRenderer.invoke("obtenerProveedores");
};

let listaDeProveedoresRaw = [];
ipcRenderer.on("lista_de_proveedores", (event, results) => {
  let plantilla = "";
  listaDeProveedoresRaw = results[0];
  listaDeProveedoresRaw.forEach((element) => {
    plantilla += `<option value = ${element.proveedor_id} > ${element.proveedor_nombre}</option>`;
  });
  let nullOption = `<option value = 0>Seleccione</option>`;
  producto_proveedor_fk.innerHTML = nullOption + plantilla;
  console.log(listaDeProveedoresRaw);
});

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
          loteProductoFk.value = listaDeProductosRaw[indice].producto_id;
          entradaLoteFk.value = listaDeProductosRaw[indice].lote_id;
          productoDescripcion.value =
            listaDeProductosRaw[indice].producto_descripcion;
          lotePresentacion.value =
            listaDeProductosRaw[indice].lote_presentacion;
          stockActual.value = listaDeProductosRaw[indice].lote_cantidad;
          valorUnitarioCompra.value =
            listaDeProductosRaw[indice].lote_valor_unitario_compra;
          valorUnitarioVenta.value =
            listaDeProductosRaw[indice].lote_valor_unitario_venta;
          productoNombre.value = listaDeProductosRaw[indice].producto_nombre;
          entradaCantidadIngresar.focus();
          closeAllLists();
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
