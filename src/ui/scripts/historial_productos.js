// const { ipcRenderer } = require("electron");

let nombreProveedor = document.getElementById("proveedor_nombre");
let productoColor = document.getElementById("producto_color");
let lotePresentacion = document.getElementById("lote_presentacion");
let categoriaNombre = document.getElementById("categoria_nombre");
let tablaEntradas = document.getElementById("tablaEntradas");
let buscarProducto = document.getElementById("buscarProducto");

document.addEventListener("DOMContentLoaded", function () {
  let objFiltro = {
    proveedor: "%",
    color: "%",
    presentacion: "%",
    categoria: "%",
  };
  obtenerProveedores();
  obtenerCategorias();
  obtenerHistorialProductos(objFiltro);
  obtenerNombreProductos();
  autocomplete(buscarProducto, listaDeProductosNombre);
});

//Funcion convertir la fecha
const convertirFecha = (fecha) => {
  let fechaParse = new Date(fecha),
    mes = ("0" + (fechaParse.getMonth() + 1)).slice(-2),
    dia = ("0" + fechaParse.getDate()).slice(-2);
  let fechaDiaMesAnio = (fechaOrdenada = [
    dia,
    mes,
    fechaParse.getFullYear(),
  ].join("/"));
  return fechaDiaMesAnio;
};

let objFiltro = {
  proveedor: "%",
  color: "%",
  presentacion: "%",
  categoria: "%",
};

const filtroProductos = (parametro, seleccion) => {
  while (tablaEntradas.firstChild) {
    tablaEntradas.removeChild(tablaEntradas.firstChild);
  }
  switch (parametro) {
    case "proveedor":
      if (seleccion) {
        objFiltro.proveedor = seleccion;
      }
      break;

    case "color":
      if (seleccion) {
        objFiltro.color = seleccion;
      }

      break;

    case "presentacion":
      if (seleccion) {
        objFiltro.presentacion = seleccion;
      }

      break;

    case "categoria":
      if (seleccion) {
        objFiltro.categoria = seleccion;
      }
      break;

    default:
      console.log("Error en el filtro");
      break;
  }
  obtenerHistorialProductos(objFiltro);
};

const buscarListaProducto = () => {
  let valor = buscarProducto.value;
  let filasTabla = document.getElementsByClassName("filas");
  // console.log(filasTabla);
  for (let index = 0; index < filasTabla.length; index++) {
    let claseFilas = filasTabla[index].className;
    let valorEnFila = claseFilas.split(" ");
    let regex = new RegExp(valor, "i");
    let busqueda = valorEnFila.filter((element) => regex.test(element));
    if (busqueda.length > 0) {
      filasTabla[index].style.display = "";
    } else {
      filasTabla[index].style.display = "none";
    }
    console.log(busqueda);
  }
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

const contabilizarProductos = async () => {
  await ipcRenderer.invoke("contabilizarProductos", objFiltro);
};

const obtenerHistorialProductos = async (objFiltro) => {
  await ipcRenderer.invoke("obtenerHistorialProductos", objFiltro);
};

ipcRenderer.on("historial_de_productos", (event, results) => {
  let productos = results[0];
  let plantilla = "";
  productos.forEach((element) => {
    plantilla += `
    <tr class = 'filas ${element.producto_nombre} filasElementos' >
    <td style="min-width: 60px; max-width: 60px; width: 60px">${
      element.producto_id
    }</td>
    <td style="min-width: 60px; max-width: 60px; width: 60px">${
      element.lote_id
    }</td>
    <td style="min-width: 250px; max-width: 250px; width: 250px">${
      element.producto_nombre
    }
    </td>
    <td style="min-width: 150px; max-width: 150px; width: 150px">
      ${element.producto_descripcion}
    </td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">${
      element.producto_color
    }</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">
      ${element.lote_presentacion}
    </td>
    <td style="min-width: 60px; max-width: 60px; width: 60px">${
      element.lote_cantidad
    }</td>
    <td style="min-width: 90px; max-width: 90px; width: 90px">
    L.${element.lote_valor_unitario_compra}
    </td>
    <td style="min-width: 90px; max-width: 90px; width: 90px">L.${
      element.lote_valor_unitario_venta
    }</td>
    <td style="min-width: 180px; max-width: 180px; width: 180px">${
      element.categoria_nombre
    }</td>
    <td style="min-width: 120px; max-width: 120px; width: 120px">
      ${element.proveedor_nombre}
    </td>
    <td style="min-width: 150px; max-width: 150px; width: 150px">
      ${convertirFecha(element.lote_fecha_vencimiento)}
    </td>
  </tr>`;
    tablaEntradas.innerHTML = plantilla;
  });
  let filasElementos = document.getElementsByClassName("filasElementos");
  for (let index = 0; index < filasElementos.length; index++) {
    let cantidad = parseInt(filasElementos[index].children[6].innerHTML);
    agregarColorFilas(filasElementos, filasElementos[index], cantidad);
  }
  console.log(results);
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
  let nullOption = `<option value = '%'>Seleccione</option>`;
  nombreProveedor.innerHTML = nullOption + plantilla;
  console.log(listaDeProveedoresRaw);
});

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
  let nullOption = `<option value = '%'>Seleccione</option>`;
  categoriaNombre.innerHTML = nullOption + plantilla;
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
          let indice = e.target.id;
          buscarProducto.value = listaDeProductosRaw[indice].producto_nombre;
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

const agregarColorFilas = (filas, fila, cantidad) => {
  console.log(cantidad);
  for (let index = 0; index < filas.length; index++) {
    if (index % 2 == 0) {
      filas[index].classList.add("filasColor");
    }
  }

  if (cantidad <= 0) {
    fila.children[6].classList.add("filasColorAgotado");
  }

  if (cantidad <= 10 && cantidad > 0) {
    fila.children[6].classList.add("filasColorPocasExistencias");
  }
};
