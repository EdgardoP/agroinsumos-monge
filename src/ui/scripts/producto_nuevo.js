// const { ipcRenderer } = require("electron");

let productoNombre = document.getElementById("productoNombre");
let productoDescripcion = document.getElementById("productoDescripcion");
let productoProveedor = document.getElementById("productoProveedor");
let productoColor = document.getElementById("productoColor");
let productoCategoria = document.getElementById("productoCategoria");
let lotePresentacion = document.getElementById("lotePresentacion");
let productoFechaVencimiento = document.getElementById(
  "productoFechaVencimiento"
);
let loteValorUnitarioCompra = document.getElementById(
  "loteValorUnitarioCompra"
);
let loteValorUnitarioVenta = document.getElementById("loteValorUnitarioVenta");
let loteCantidad = document.getElementById("loteCantidad");
let tablaEntradas = document.getElementById("tablaEntradas");

document.addEventListener("DOMContentLoaded", function () {
  productoNombre.focus();
  obtenerCategorias();
  obtenerProveedores();
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

function soloLetras(obj) {
  obj.value = obj.value.replace(/[0-9]/g, "");
}

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
}

const quitarColorError = () => {
  productoNombre.parentNode.style.boxShadow = "none";
  productoDescripcion.parentNode.style.boxShadow = "none";
  productoProveedor.parentNode.style.boxShadow = "none";
  productoColor.parentNode.style.boxShadow = "none";
  productoCategoria.parentNode.style.boxShadow = "none";
  lotePresentacion.parentNode.style.boxShadow = "none";
  productoFechaVencimiento.parentNode.style.boxShadow = "none";
  loteValorUnitarioCompra.parentNode.style.boxShadow = "none";
  loteValorUnitarioVenta.parentNode.style.boxShadow = "none";
  loteCantidad.parentNode.style.boxShadow = "none";
};
const validarNuevoProducto = () => {
  if (
    productoNombre.value != "" &&
    productoDescripcion.value != "" &&
    productoProveedor.value != "0" &&
    productoColor.value != "0" &&
    productoCategoria.value != "0" &&
    lotePresentacion.value != "-1" &&
    productoFechaVencimiento.value != "" &&
    loteValorUnitarioCompra.value != "" &&
    loteValorUnitarioVenta.value != "" &&
    loteCantidad.value != ""
  ) {
    agregarFilasProductos();
  } else {
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

    if (productoProveedor.value == "0") {
      productoProveedor.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoProveedor.parentNode.style.boxShadow = "none";
    }
    if (productoColor.value == "0") {
      productoColor.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoColor.parentNode.style.boxShadow = "none";
    }
    if (productoCategoria.value == "0") {
      productoCategoria.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoCategoria.parentNode.style.boxShadow = "none";
    }
    if (lotePresentacion.value == "-1") {
      lotePresentacion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      lotePresentacion.parentNode.style.boxShadow = "none";
    }
    if (productoFechaVencimiento.value == "") {
      productoFechaVencimiento.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoFechaVencimiento.parentNode.style.boxShadow = "none";
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
  productoCategoria.innerHTML = nullOption + plantilla;
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
  productoProveedor.innerHTML = nullOption + plantilla;
});

let cantidad_filas_ingresadas = 0;
const agregarFilasProductos = async () => {
  cantidad_filas_ingresadas++;
  let plantilla = "";
  plantilla += `
  <tr class = "filasElementos">
  <td style="min-width: 20px; max-width: 20px; width: 20px">${cantidad_filas_ingresadas}</td>
<td style="min-width: 200px; max-width: 200px; width: 200px">
    ${productoNombre.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${lotePresentacion.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${productoDescripcion.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${convertirFecha(productoFechaVencimiento.value)}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${productoCategoria.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${productoColor.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${productoProveedor.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${loteValorUnitarioCompra.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${loteValorUnitarioVenta.value}
  </td>
  <td style="min-width: 130px; max-width: 130px; width: 130px">
    ${loteCantidad.value}
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
</tr>`;
  tablaEntradas.innerHTML += plantilla;
  limpiarTextos();
};

const limpiarTextos = () => {
  quitarColorError();
  productoNombre.value = "";
  productoDescripcion.value = "";
  productoProveedor.value = "0";
  productoColor.value = "0";
  productoCategoria.value = "0";
  lotePresentacion.value = "-1";
  productoFechaVencimiento.value = "";
  loteValorUnitarioCompra.value = "";
  loteValorUnitarioVenta.value = "";
  loteCantidad.value = "";
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  //   console.log(index);
  let nombreP = index.children[1].innerHTML.trim();
  let presentacionP = index.children[2].innerHTML.trim();
  let descripcionP = index.children[3].innerHTML.trim();
  let fechaVencimientoP = index.children[4].innerHTML.trim();
  let categoriaP = index.children[5].innerHTML.trim();
  let colorP = index.children[6].innerHTML.trim();
  let proveedorP = index.children[7].innerHTML.trim();
  let valorCompra = index.children[8].innerHTML.trim();
  let valorVenta = index.children[9].innerHTML.trim();
  let cantidadP = index.children[10].innerHTML.trim();
  productoNombre.value = nombreP;
  productoDescripcion.value = descripcionP;
  productoProveedor.value = proveedorP;
  productoColor.value = colorP;
  productoCategoria.value = categoriaP;
  lotePresentacion.value = presentacionP;
  productoFechaVencimiento.value = fechaVencimientoP;
  loteValorUnitarioCompra.value = valorCompra;
  loteValorUnitarioVenta.value = valorVenta;
  loteCantidad.value = cantidadP;
  index.remove();
};

const nuevoProducto = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  if (filasElementos.length === 0) {
    console.log("No has agregado nada aun");
    tablaEntradas.parentNode.parentNode.classList.add("tablaTransicion");
    tablaEntradas.parentNode.parentNode.style.backgroundColor = "#d0393996";
    setTimeout(() => {
      tablaEntradas.parentNode.parentNode.style.backgroundColor = "#fff";
    }, "1000");
  } else {
    for (let index = 0; index < filasElementos.length; index++) {
      let filasDatos = {};
      let datos = [];
      let filasLote = [];
      let lote = [];
      let nombreP = filasElementos[index].children[1].innerHTML.trim();
      let presentacionP = filasElementos[index].children[2].innerHTML.trim();
      let descripcionP = filasElementos[index].children[3].innerHTML.trim();
      let fechaVencimientoP =
        filasElementos[index].children[4].innerHTML.trim();
      let categoriaP = filasElementos[index].children[5].innerHTML.trim();
      let colorP = filasElementos[index].children[6].innerHTML.trim();
      let proveedorP = filasElementos[index].children[7].innerHTML.trim();
      let valorCompra = filasElementos[index].children[8].innerHTML.trim();
      let valorVenta = filasElementos[index].children[9].innerHTML.trim();
      let cantidadP = filasElementos[index].children[10].innerHTML.trim();
      let fechaHoy = obtenerFecha("YYYY/MM/DD");
      filasDatos = {
        producto_nombre: nombreP,
        producto_descripcion: descripcionP,
        producto_proveedor_fk: proveedorP,
        producto_color: colorP,
        producto_categoria_fk: categoriaP,
      };
      filasLote = {
        lote_cantidad: cantidadP,
        lote_valor_unitario_compra: valorCompra,
        lote_valor_unitario_venta: valorVenta,
        lote_presentacion: presentacionP,
        lote_ultima_actualizacion: fechaHoy,
        lote_fecha_vencimiento: fechaVencimientoP,
        lote_estado: "Activo",
      };
      await ipcRenderer.invoke("nuevoProductoMultiple", filasDatos, filasLote);
    }
  }
};

const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
};
