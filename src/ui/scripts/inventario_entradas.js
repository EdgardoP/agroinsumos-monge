const { ipcRenderer } = require("electron");

//Inputs del dashboard entradas
let entradaProductoNombre = document.getElementById("entrada_producto_nombre");
let entradaProductoDescripcion = document.getElementById(
  "entrada_producto_descripcion"
);
let entradaLotePresentacion = document.getElementById(
  "entrada_lote_presentacion"
);
let entradaId = document.getElementById("entrada_id");
let entradaFecha = document.getElementById("entrada_fecha");
let entradaLoteFk = document.getElementById("entrada_lote_fk");
let entradaLoteProductoFk = document.getElementById("entrada_lote_producto_fk");
let entradaStockActual = document.getElementById("entrada_stock_actual");
let entradaCantidadIngresar = document.getElementById(
  "entrada_cantidad_ingresar"
);
let entradaOtrosGastos = document.getElementById("entrada_otros_gastos");
let entradaTipoPago = document.getElementById("entrada_tipo_pago");
let entradaValorUnitarioCompra = document.getElementById(
  "entrada_valor_unitario_compra"
);
let entradaValorUnitarioVenta = document.getElementById(
  "entrada_valor_unitario_venta"
);

//Inputs del Modal ingresar Nuevo Producto
let productoNombre = document.getElementById("producto_nombre");
let productoDescripcion = document.getElementById("producto_descripcion");
let productoProveedorFk = document.getElementById("producto_proveedor_fk");
let productoCategoriaFk = document.getElementById("producto_categoria_fk");
let productoColor = document.getElementById("producto_color");
let productoPresentacion = document.getElementById("producto_presentacion");
let producto_valor_unitario_compra = document.getElementById(
  "producto_valor_unitario_compra"
);
let producto_valor_unitario_venta = document.getElementById(
  "producto_valor_unitario_venta"
);
let productoFechaVencimiento = document.getElementById(
  "producto_fecha_vencimiento"
);

let tablaEntradas = document.getElementById("tablaEntradas");
//Inputs para el modal de agregar Nuevo Proveedor
//Inputs para el modal de agregar Nueva Categoria

document.addEventListener("DOMContentLoaded", function () {
  obtenerNombreProductos();
  obtenerProveedores();
  obtenerCategorias();
  entradaFecha.value = obtenerFecha("YYYY/MM/DD");
  autocomplete(entradaProductoNombre, listaDeProductosNombre);
  autocomplete(entradaLoteProductoFk, listaDeProductosId);
  entradaProductoNombre.focus();
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

//Funcion para eliminar las filas
const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  let busqueda = index.children[2].innerHTML;
  let cantidadIngresar = index.children[6].innerHTML;
  let otrosGastos = index.children[9].innerHTML;
  let tipoPago = index.children[10].innerHTML;
  // console.log(busqueda);
  let elementoTabla = listaDeProductosRaw.find(
    (element) => element.lote_id == busqueda
  );
  console.log(elementoTabla);
  entradaLoteFk.value = elementoTabla.lote_id;
  entradaLoteProductoFk.value = elementoTabla.producto_id;
  entradaProductoNombre.value = elementoTabla.producto_nombre;
  entradaProductoDescripcion.value = elementoTabla.producto_descripcion;
  entradaLotePresentacion.value = elementoTabla.lote_presentacion;
  entradaStockActual.value = elementoTabla.lote_cantidad;
  entradaValorUnitarioCompra.value = elementoTabla.lote_valor_unitario_compra;
  entradaValorUnitarioVenta.value = elementoTabla.lote_valor_unitario_venta;
  entradaCantidadIngresar.value = cantidadIngresar;
  entradaOtrosGastos.value = otrosGastos;
  entradaTipoPago.value = tipoPago;
  index.remove();
};
//Funcion para cargar las categorias de la base de datos
const obtenerCategorias = async () => {
  await ipcRenderer.invoke("obtenerCategorias");
};

let listaDeCategoriasRaw = [];
ipcRenderer.on("lista_de_categorias", (event, results) => {
  let plantilla = "";
  listaDeCategoriasRaw = results[0];
  listaDeCategoriasRaw.forEach((element) => {
    plantilla += `<option value = ${element.categoria_id} > ${element.categoria_nombre}</option>`;
  });
  let nullOption = `<option value = 0>Seleccione</option>`;
  productoCategoriaFk.innerHTML = nullOption + plantilla;
});

//Funcion para obtener los nombres de los productos de la base de datos
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
  productoProveedorFk.innerHTML = nullOption + plantilla;
  console.log(listaDeProveedoresRaw);
});

//Funcion para agregar un nuevo producto
const nuevoProducto = async () => {
  location.href = "#";
  const obj = {
    producto_nombre: productoNombre.value,
    producto_descripcion: productoDescripcion.value,
    producto_proveedor_fk: productoProveedorFk.value,
    producto_categoria_fk: productoCategoriaFk.value,
    producto_color: productoColor.value,
  };
  const objLote = {
    lote_presentacion: productoPresentacion.value,
    lote_valor_unitario_compra: producto_valor_unitario_compra.value,
    lote_valor_unitario_venta: producto_valor_unitario_venta.value,
    lote_ultima_actualizacion: entradaFecha.value,
    lote_fecha_vencimiento: entradaFecha.value,
  };
  await ipcRenderer.invoke("nuevoProducto", obj, objLote);
  ipcRenderer.on("producto_id", (event, id) => {
    entradaLoteProductoFk.value = `${id}`;
  });
  ipcRenderer.on("lote_id", (event, id) => {
    entradaLoteFk.value = `${id}`;
    if (id != -1) {
      entradaProductoNombre.value = `${productoNombre.value}`;
      entradaLoteProductoFk.value = `${id}`;
      entradaProductoDescripcion.value = `${productoDescripcion.value}`;
      entradaLotePresentacion.value = `${productoPresentacion.value}`;
      entradaStockActual.value = `${0}`;
      entradaValorUnitarioCompra.value = `${producto_valor_unitario_compra.value}`;
      entradaValorUnitarioVenta.value = `${producto_valor_unitario_venta.value}`;
    }
    entradaCantidadIngresar.focus();
    console.log("ReseteoProductos");
    listaDeProductosRaw = [];
    listaDeProductosNombre = [];
    listaDeProductosId = [];
    obtenerNombreProductos();
    autocomplete(entradaProductoNombre, listaDeProductosNombre);
    autocomplete(entradaLoteProductoFk, listaDeProductosId);
    console.log("ReseteoProductosTerminado");
  });
};

const confirmarEntradas = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let valoresModificar = [];
  let loteModificar = {};
  let entradas = [];

  for (let index = 0; index < filasElementos.length; index++) {
    let datosEntradas = [];
    datosEntradas.push(entradaFecha.value);
    datosEntradas.push(filasElementos[index].children[2].innerHTML);
    datosEntradas.push(filasElementos[index].children[7].innerHTML);
    datosEntradas.push(filasElementos[index].children[6].innerHTML);
    datosEntradas.push(filasElementos[index].children[10].innerHTML);
    datosEntradas.push(filasElementos[index].children[9].innerHTML);
    datosEntradas.push(1);
    entradas.push([datosEntradas]);
    loteModificar = {
      lote_cantidad: filasElementos[index].children[8].innerHTML,
      lote_id: filasElementos[index].children[2].innerHTML,
    };
    valoresModificar.push(loteModificar);
  }
  console.log(entradas);
  console.log(valoresModificar);
  await ipcRenderer.invoke("modificarMultiplesLotes", valoresModificar);
  await ipcRenderer.invoke("insertarMultiplesEntradas", entradas);
};

let cantidad_filas_ingresadas = 0;
const agregarEntradaLista = () => {
  cantidad_filas_ingresadas++;
  let plantilla = "";
  let elementoTabla = listaDeProductosRaw.find(
    (element) => element.lote_id == entradaLoteFk.value
  );
  let stockAntiguo = parseInt(entradaStockActual.value);
  let nuevoIngreso = parseFloat(entradaCantidadIngresar.value);
  let nuevoStock = stockAntiguo + nuevoIngreso;
  let otrosGastos = parseInt(entradaOtrosGastos.value);
  let valorUnitCompra = parseInt(entradaValorUnitarioCompra.value);
  let subtotal = nuevoIngreso * valorUnitCompra + otrosGastos;
  console.log(elementoTabla);
  plantilla += `
  <tr class = "filasElementos">
    <td style="min-width: 20px; max-width: 20px; width: 20px;">${cantidad_filas_ingresadas}</td>
    <td style="min-width: 80px; max-width: 80px; width: 80px">${elementoTabla.producto_id}</td>
    <td style="min-width: 60px; max-width: 60px; width: 60px">${elementoTabla.lote_id}</td>
    <td style="min-width: 200px; max-width: 200px; width: 200px">${elementoTabla.producto_nombre}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${elementoTabla.lote_presentacion}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${elementoTabla.lote_valor_unitario_compra}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${nuevoIngreso}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${stockAntiguo}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${nuevoStock}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${otrosGastos}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${entradaTipoPago.value}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${subtotal}</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">
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
  </tr>`;
  tablaEntradas.innerHTML += plantilla;
  limpiarTextos();
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
          entradaLoteProductoFk.value = listaDeProductosRaw[indice].producto_id;
          entradaLoteFk.value = listaDeProductosRaw[indice].lote_id;
          entradaProductoDescripcion.value =
            listaDeProductosRaw[indice].producto_descripcion;
          entradaLotePresentacion.value =
            listaDeProductosRaw[indice].lote_presentacion;
          entradaStockActual.value = listaDeProductosRaw[indice].lote_cantidad;
          entradaValorUnitarioCompra.value =
            listaDeProductosRaw[indice].lote_valor_unitario_compra;
          entradaValorUnitarioVenta.value =
            listaDeProductosRaw[indice].lote_valor_unitario_venta;
          entradaProductoNombre.value =
            listaDeProductosRaw[indice].producto_nombre;
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

const limpiarTextos = () => {
  entradaProductoNombre.focus();
  entradaLoteProductoFk.value = "";
  entradaLoteFk.value = "";
  entradaProductoNombre.value = "";
  entradaProductoDescripcion.value = "";
  entradaLotePresentacion.value = "";
  entradaStockActual.value = "";
  entradaValorUnitarioCompra.value = "";
  entradaValorUnitarioVenta.value = "";
  entradaCantidadIngresar.value = "";
  entradaOtrosGastos.value = "";
  entradaTipoPago.value = "-1";
};
