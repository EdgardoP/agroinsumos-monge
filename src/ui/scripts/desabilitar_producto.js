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
  await ipcRenderer.invoke("desabilitar_lote", id);
  //   let filasElementos = document.getElementsByClassName("filasElementos");
  //   for (let index = 0; index < filasElementos.length; index++) {
  // let filasDatos = {};
  // let filasLote = [];
  // let idP = filasElementos[index].children[1].innerHTML.trim();
  // let nombreP = filasElementos[index].children[2].innerHTML.trim();
  // let descripcionP = filasElementos[index].children[3].innerHTML.trim();
  // let presentacionP = filasElementos[index].children[4].innerHTML.trim();
  // let fechaVencimientoP = filasElementos[index].children[5].innerHTML.trim();
  // let valorCompra = filasElementos[index].children[6].innerHTML.trim();
  // let valorVenta = filasElementos[index].children[7].innerHTML.trim();
  // let cantidadP = filasElementos[index].children[8].innerHTML.trim();
  // let fechaHoy = obtenerFecha("YYYY/MM/DD");

  // filasLote = {
  //   lote_producto_fk: idP,
  //   lote_cantidad: cantidadP,
  //   lote_valor_unitario_compra: valorCompra,
  //   lote_valor_unitario_venta: valorVenta,
  //   lote_presentacion: presentacionP,
  //   lote_ultima_actualizacion: fechaHoy,
  //   lote_fecha_vencimiento: fechaVencimientoP,
  // };
  //   }
};
