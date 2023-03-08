const { ipcRenderer } = require("electron");

let productoId = document.getElementById("productoId");
let loteId = document.getElementById("loteId");
let productoNombre = document.getElementById("productoNombre");
let productoDescripcion = document.getElementById("productoDescripcion");
let productoFechaVencimiento = document.getElementById(
  "productoFechaVencimiento"
);
let productoPresentacion = document.getElementById("productoPresentacion");
let productoValorUnitarioCompra = document.getElementById(
  "productoValorUnitarioCompra"
);
let productoValorUnitarioVenta = document.getElementById(
  "productoValorUnitarioVenta"
);
let productoCantidad = document.getElementById("productoCantidad");
let cantidadRestar = document.getElementById("cantidadRestar");
let nuevaPresentacion = document.getElementById("nuevaPresentacion");
let cantidadDerivado = document.getElementById("cantidadDerivado");
let derivadoValorCompra = document.getElementById("derivadoValorCompra");
let derivadoValorVenta = document.getElementById("derivadoValorVenta");
let tablaEntradas = document.getElementById("tablaEntradas");

document.addEventListener("DOMContentLoaded", function () {
  obtenerNombreProductos();
  autocomplete(productoNombre, listaDeProductosNombre);
  autocomplete(productoId, listaDeProductosId);
  limpiar();
  productoNombre.focus();
});

const activarInput = (input) => {
  input.parentNode.style.boxShadow = "rgba(255, 0, 0, 0.563) 3px 2px 5px";
};

const limpiar = () => {
  quitarColorError();
  productoId.value = "";
  productoNombre.value = "";
  loteId.value = "";
  productoDescripcion.value = "";
  productoFechaVencimiento.value = "";
  productoPresentacion.value = "-1";
  productoValorUnitarioCompra.value = "";
  productoValorUnitarioVenta.value = "";
  productoCantidad.value = "";
  productoNombre.focus();
  cantidadInicial = "";
  cantidadRestar.value = "";
  nuevaPresentacion.value = -1;
  cantidadDerivado.value = "";
  derivadoValorCompra.value = "";
  derivadoValorVenta.value = "";
  productoCantidad.parentNode.style.backgroundColor = "";
  cantidadDerivado.parentNode.style.backgroundColor = "grey";
  derivadoValorCompra.parentNode.style.backgroundColor = "grey";
  derivadoValorVenta.parentNode.style.backgroundColor = "grey";
  cantidadRestar.parentNode.style.backgroundColor = "grey";
  nuevaPresentacion.parentNode.style.backgroundColor = "grey";
};

const quitarColorError = () => {
  cantidadRestar.parentNode.style.boxShadow = "none";
  cantidadDerivado.parentNode.style.boxShadow = "none";
  nuevaPresentacion.parentNode.style.boxShadow = "none";
  derivadoValorCompra.parentNode.style.boxShadow = "none";
  derivadoValorVenta.parentNode.style.boxShadow = "none";
};
const validar = () => {
  if (
    productoNombre.value != "" &&
    cantidadRestar.value > 0 &&
    cantidadDerivado.value > 0 &&
    nuevaPresentacion.value != "-1" &&
    derivadoValorCompra.value > 0 &&
    derivadoValorVenta.value > 0
  ) {
    agregarFilasDerivados();
    quitarColorError();
  } else {
    if (productoNombre.value == "") {
      productoNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoNombre.parentNode.style.boxShadow = "none";
    }
    if (cantidadRestar.value <= 0) {
      cantidadRestar.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      cantidadRestar.parentNode.style.boxShadow = "none";
    }
    if (cantidadDerivado.value <= 0) {
      cantidadDerivado.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      cantidadDerivado.parentNode.style.boxShadow = "none";
    }
    if (nuevaPresentacion.value == "-1") {
      nuevaPresentacion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      nuevaPresentacion.parentNode.style.boxShadow = "none";
    }
    if (derivadoValorCompra.value <= 0) {
      derivadoValorCompra.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      derivadoValorCompra.parentNode.style.boxShadow = "none";
    }
    if (derivadoValorVenta.value <= 0) {
      derivadoValorVenta.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      derivadoValorVenta.parentNode.style.boxShadow = "none";
    }
  }
};

const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
};

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

const restarCantidad = (param) => {
  if (param === "") {
    productoCantidad.value = cantidadInicial;
  } else {
    derivadoValorCompra.value = "";
    let stockRestar = parseInt(param);
    if (stockRestar > cantidadInicial) {
      productoCantidad.parentNode.style.backgroundColor = "red";
      cantidadDerivado.parentNode.style.backgroundColor = "grey";
      derivadoValorCompra.parentNode.style.backgroundColor = "grey";
      derivadoValorVenta.parentNode.style.backgroundColor = "grey";
      nuevaPresentacion.parentNode.style.backgroundColor = "grey";
      cantidadDerivado.disabled = true;
      nuevaPresentacion.disabled = true;
      derivadoValorCompra.disabled = true;
      derivadoValorVenta.disabled = true;
    } else {
      quitarColorError();
      productoCantidad.parentNode.style.backgroundColor = "#A2C663";
      cantidadRestar.parentNode.style.backgroundColor = "#A2C663";
      cantidadDerivado.parentNode.style.backgroundColor = "";
      derivadoValorCompra.parentNode.style.backgroundColor = "";
      derivadoValorVenta.parentNode.style.backgroundColor = "";
      nuevaPresentacion.parentNode.style.backgroundColor = "";
      cantidadRestar.disabled = false;
      cantidadDerivado.disabled = false;
      nuevaPresentacion.disabled = false;
      derivadoValorCompra.disabled = false;
      derivadoValorVenta.disabled = false;
      let resta = cantidadInicial - stockRestar;
      productoCantidad.value = resta;
    }
  }
};
function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
}

const evaluarStock = (param) => {
  let cantidad = parseInt(param);
  console.log(cantidad);
  if (cantidad <= 0) {
    productoCantidad.parentNode.style.backgroundColor = "red";
    cantidadDerivado.parentNode.style.backgroundColor = "grey";
    derivadoValorCompra.parentNode.style.backgroundColor = "grey";
    derivadoValorVenta.parentNode.style.backgroundColor = "grey";
    cantidadRestar.parentNode.style.backgroundColor = "grey";
    nuevaPresentacion.parentNode.style.backgroundColor = "grey";
    cantidadRestar.disabled = true;
    cantidadDerivado.disabled = true;
    nuevaPresentacion.disabled = true;
    derivadoValorCompra.disabled = true;
    derivadoValorVenta.disabled = true;
  } else {
    productoCantidad.parentNode.style.backgroundColor = "#A2C663";
    cantidadDerivado.parentNode.style.backgroundColor = "";
    derivadoValorCompra.parentNode.style.backgroundColor = "";
    derivadoValorVenta.parentNode.style.backgroundColor = "";
    cantidadRestar.parentNode.style.backgroundColor = "#A2C663";
    nuevaPresentacion.parentNode.style.backgroundColor = "";
    cantidadDerivado.disabled = false;
    derivadoValorCompra.disabled = false;
    derivadoValorVenta.disabled = false;
    cantidadRestar.disabled = false;
    nuevaPresentacion.disabled = false;
  }
};
const calcularValorCompra = (param) => {
  if (param != "") {
    let valorCompraProducto = parseInt(productoValorUnitarioCompra.value);
    let valorInversion = parseInt(cantidadRestar.value) * valorCompraProducto;
    let cantidad = parseInt(cantidadDerivado.value);
    let nuevoValorCompraProducto = valorInversion / cantidad;
    derivadoValorCompra.value = nuevoValorCompraProducto.toFixed(2);
  } else {
    derivadoValorCompra.value = "";
  }
};

const obtenerNombreProductos = async () => {
  await ipcRenderer.invoke("obtenerNombreProductos");
};

let listaDeProductosRaw = [];
let listaDeProductosNombre = [];
let listaDeProductosId = [];

ipcRenderer.on("lista_de_productos", (event, results) => {
  listaDeProductosRaw = results[0];
  console.log(listaDeProductosRaw);
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

let cantidadInicial = 0;
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
          productoId.value = listaDeProductosRaw[indice].producto_id;
          productoNombre.value = listaDeProductosRaw[indice].producto_nombre;
          loteId.value = listaDeProductosRaw[indice].lote_id;
          productoDescripcion.value =
            listaDeProductosRaw[indice].producto_descripcion;
          productoFechaVencimiento.value = `${convertirFecha(
            listaDeProductosRaw[indice].lote_fecha_vencimiento
          )}`;
          productoPresentacion.value =
            listaDeProductosRaw[indice].lote_presentacion;
          productoValorUnitarioCompra.value =
            listaDeProductosRaw[indice].lote_valor_unitario_compra;
          productoValorUnitarioVenta.value =
            listaDeProductosRaw[indice].lote_valor_unitario_venta;
          productoCantidad.value = listaDeProductosRaw[indice].lote_cantidad;
          cantidadInicial = listaDeProductosRaw[indice].lote_cantidad;
          closeAllLists();
          productoCantidad.focus();
          cantidadRestar.focus();
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

const nuevoDerivado = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  if (filasElementos.length > 0) {
    for (let index = 0; index < filasElementos.length; index++) {
      let filasNuevoLote = {};
      let filasModificarLote = {};
      let idLote = filasElementos[index].children[1].innerHTML.trim();
      let idProducto = filasElementos[index].children[2].innerHTML.trim();
      let nombreP = filasElementos[index].children[3].innerHTML.trim();
      let presentacionP = filasElementos[index].children[4].innerHTML.trim();
      let restarCant = filasElementos[index].children[5].innerHTML.trim();
      let nuevaCantidad = filasElementos[index].children[6].innerHTML.trim();
      let nuevoValorComp = filasElementos[index].children[7].innerHTML.trim();
      let nuevoValorVent = filasElementos[index].children[8].innerHTML.trim();
      let nuevaPresentacion =
        filasElementos[index].children[9].innerHTML.trim();
      let fechaVencimientoP =
        filasElementos[index].children[10].innerHTML.trim();
      let fechaHoy = obtenerFecha("YYYY/MM/DD");
      filasNuevoLote = {
        lote_producto_fk: idProducto,
        lote_cantidad: nuevaCantidad,
        lote_valor_unitario_compra: nuevoValorComp,
        lote_valor_unitario_venta: nuevoValorVent,
        lote_presentacion: nuevaPresentacion,
        lote_ultima_actualizacion: fechaHoy,
        lote_fecha_vencimiento: fechaVencimientoP,
        lote_estado: "Activo",
      };
      let elemento = listaDeProductosRaw.find(
        (element) => element.lote_id == idLote
      );
      let cantidadRest = parseInt(restarCant);
      let cantidadProd = parseInt(elemento.lote_cantidad);
      let cantidadModificada = parseInt(cantidadProd - cantidadRest);
      console.log(`Soy la cantidad Modificada ${cantidadModificada}`);
      filasModificarLote = {
        lote_id: idLote,
        lote_cantidad: cantidadModificada,
      };

      await ipcRenderer.invoke("modificarLote", filasModificarLote);
      await ipcRenderer.invoke("nuevoLote", filasNuevoLote);
      location.reload();
    }
  } else {
    console.log("No has agregado nada aun");
    tablaEntradas.parentNode.parentNode.classList.add("tablaTransicion");
    tablaEntradas.parentNode.parentNode.style.backgroundColor = "#d0393996";
    setTimeout(() => {
      tablaEntradas.parentNode.parentNode.style.backgroundColor = "#fff";
    }, "1000");
  }
};

const modificarFila = () => {
  cantidadDerivado.disabled = false;
  derivadoValorCompra.disabled = false;
  derivadoValorVenta.disabled = false;
  cantidadRestar.disabled = false;
  nuevaPresentacion.disabled = false;
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  let busqueda = index.children[1].innerHTML;
  let elementoTabla = listaDeProductosRaw.find(
    (element) => element.lote_id == busqueda
  );
  console.log(elementoTabla);
  productoId.value = elementoTabla.producto_id;
  productoNombre.value = elementoTabla.producto_nombre;
  loteId.value = elementoTabla.lote_id;
  productoDescripcion.value = elementoTabla.producto_descripcion;
  productoFechaVencimiento.value = convertirFecha(
    elementoTabla.lote_fecha_vencimiento
  );
  productoPresentacion.value = elementoTabla.lote_presentacion;
  productoValorUnitarioCompra.value = elementoTabla.lote_valor_unitario_compra;
  productoValorUnitarioVenta.value = elementoTabla.lote_valor_unitario_venta;
  productoCantidad.value = elementoTabla.lote_cantidad;
  cantidadRestar.value = index.children[5].innerHTML.trim();
  cantidadDerivado.value = index.children[6].innerHTML.trim();
  nuevaPresentacion.value = index.children[9].innerHTML.trim();
  derivadoValorCompra.value = index.children[7].innerHTML.trim();
  derivadoValorVenta.value = index.children[8].innerHTML.trim();

  index.remove();
  agregarColorFilas(filasElementos);
};

let cantidad_filas_ingresadas = 0;
const agregarFilasDerivados = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  cantidad_filas_ingresadas++;
  let valorLote = loteId.value;
  let contarStock = 0;
  let stockAntiguo = cantidadInicial;
  let BANDERA = false;
  let CREAR = true;
  for (let index = 0; index < filasElementos.length; index++) {
    let VALOR_LOTE_LISTA = filasElementos[index].children[1].innerHTML;
    let cantidadRestaLista = parseInt(
      filasElementos[index].children[5].innerHTML
    );
    if (valorLote === VALOR_LOTE_LISTA) {
      BANDERA = true;
      contarStock += cantidadRestaLista;
      console.log(contarStock);
    }
  }
  if (BANDERA === true) {
    contarStock += parseInt(cantidadRestar.value);
    console.log(contarStock);
    if (contarStock > stockAntiguo) {
      CREAR = false;
      location.href = "#modal_advertencia";
    }
  }
  let plantilla = "";
  if (CREAR === true) {
    plantilla += `
      <tr class = "filasElementos">
          <td style="min-width: 20px; max-width: 20px; width: 20px">${cantidad_filas_ingresadas}</td>
          <td style="min-width: 80px; max-width: 80px; width: 80px">${loteId.value}</td>
          <td style="min-width: 100px; max-width: 100px; width: 100px">
              ${productoId.value}
          </td>
          <td style="min-width: 200px; max-width: 200px; width: 200px">
              ${productoNombre.value}
          </td>
          <td style="min-width: 100px; max-width: 100px; width: 100px">
              ${productoPresentacion.value}
          </td>
          <td style="min-width: 60px; max-width: 60px; width: 60px">
              ${cantidadRestar.value}
          </td>
          <td style="min-width: 130px; max-width: 130px; width: 130px">
              ${cantidadDerivado.value}
          </td>
          <td style="min-width: 200px; max-width: 200px; width: 200px">
              ${derivadoValorCompra.value}
          </td>
          <td style="min-width: 200px; max-width: 200px; width: 200px">
              ${derivadoValorVenta.value}
          </td>
          <td style="min-width: 140px; max-width: 140px; width: 140px">
              ${nuevaPresentacion.value}
          </td>
          <td style="min-width: 130px; max-width: 130px; width: 130px">
              ${productoFechaVencimiento.value}
          </td>
          <td style="min-width: 130px; max-width: 130px; width: 130px">
              <div>
                  <button id = ${cantidad_filas_ingresadas} 
                      onclick="modificarFila();event.preventDefault()"
                      class="accionesBoton colorSecundario">
                      <img id = ${cantidad_filas_ingresadas}
                      src="icons/edit-button.png" alt="" />
                      
                  </button>
                  <button 
                      id = ${cantidad_filas_ingresadas} 
                      onclick="eliminarFila();event.preventDefault()"
                      class="btnEliminarFila accionesBoton colorRojo">
                      <img id = ${cantidad_filas_ingresadas} src="icons/cancel.png" alt="" />
                  </button>
              </div>
          </td>
      </tr>
    `;
  }

  tablaEntradas.innerHTML += plantilla;
  agregarColorFilas(filasElementos);
  limpiar();
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
