const { ipcRenderer } = require("electron");

let idProducto = document.getElementById("idProducto");
let productoNombre = document.getElementById("productoNombre");
let productoDescripcion = document.getElementById("productoDescripcion");
let lotePresentacion = document.getElementById("lotePresentacion");

let productoFechaVencimiento = document.getElementById(
  "productoFechaVencimiento"
);
let loteValorUnitarioCompra = document.getElementById(
  "loteValorUnitarioCompra"
);
let loteValorUnitarioVenta = document.getElementById("loteValorUnitarioVenta");
let loteCantidad = document.getElementById("loteCantidad");
let idLote = document.getElementById("id_lote");

let tablaEntradas = document.getElementById("tablaEntradas");

document.addEventListener("DOMContentLoaded", function () {
  obtenerNombreProductos();
  autocomplete(productoNombre, listaDeProductosNombre);
  autocomplete(idProducto, listaDeProductosId);
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

const limpiarTextos = () => {
  idProducto.value = "";
  productoNombre.value = "";
  productoDescripcion.value = "";
  lotePresentacion.value = "-1";
  productoFechaVencimiento.value = "";
  loteValorUnitarioCompra.value = "";
  loteValorUnitarioVenta.value = "";
  loteCantidad.value = "";
  productoNombre.focus();
};

const obtenerNombreProductos = async () => {
  await ipcRenderer.invoke("obtenerNombreProductos");
};

let listaDeProductosRaw = [];
let listaDeProductosNombre = [];
let listaDeProductosId = [];

ipcRenderer.on("lista_de_productos", (event, results) => {
  listaDeProductosRaw = results[0];
  // console.log(listaDeProductosRaw);
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
          productoNombre.value = listaDeProductosRaw[indice].producto_nombre;
          idProducto.value = listaDeProductosRaw[indice].producto_id;
          productoDescripcion.value =
            listaDeProductosRaw[indice].producto_descripcion;
          lotePresentacion.value =
            listaDeProductosRaw[indice].lote_presentacion;
          loteValorUnitarioCompra.value =
            listaDeProductosRaw[indice].lote_valor_unitario_compra;
          loteValorUnitarioVenta.value =
            listaDeProductosRaw[indice].lote_valor_unitario_venta;
          loteCantidad.value = listaDeProductosRaw[indice].lote_cantidad;
          idLote.value = listaDeProductosRaw[indice].lote_id;
          loteValorUnitarioCompra.focus();
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

const deshabilitarProducto = async () => {
  let id = idLote.value;
  if (
    id != "" &&
    idProducto.value != "" &&
    productoNombre.value != "" &&
    productoDescripcion.value != "" &&
    lotePresentacion.value != "" &&
    lotePresentacion.value != "-1" &&
    loteValorUnitarioCompra.value != "" &&
    loteValorUnitarioVenta.value != "" &&
    loteCantidad.value != ""
  ) {
    await ipcRenderer.invoke("desabilitar_lote", id);
    location.reload();
  } else {
    if (idProducto.value == "") {
      idProducto.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      idProducto.parentNode.style.boxShadow = "none";
    }
    if (idLote.value == "") {
      idLote.parentNode.style.boxShadow = "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      idLote.parentNode.style.boxShadow = "none";
    }
    if (productoNombre.value == "") {
      productoNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoNombre.parentNode.style.boxShadow = "none";
    }
    if (productoDescripcion.value == "") {
      productoDescripcion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoDescripcion.parentNode.style.boxShadow = "none";
    }
    if (lotePresentacion.value == "") {
      lotePresentacion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      lotePresentacion.parentNode.style.boxShadow = "none";
    }
    if (lotePresentacion.value == "-1") {
      lotePresentacion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      lotePresentacion.parentNode.style.boxShadow = "none";
    }
    if (loteValorUnitarioCompra.value == "") {
      loteValorUnitarioCompra.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      loteValorUnitarioCompra.parentNode.style.boxShadow = "none";
    }
    if (loteValorUnitarioVenta.value == "") {
      loteValorUnitarioVenta.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      loteValorUnitarioVenta.parentNode.style.boxShadow = "none";
    }
    if (loteCantidad.value == "") {
      loteCantidad.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      loteCantidad.parentNode.style.boxShadow = "none";
    }
  }
};
