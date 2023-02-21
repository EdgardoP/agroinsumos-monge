const { ipcRenderer } = require("electron");

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
  for (let index = 0; index < filasElementos.length; index++) {
    let filasDatos = {};
    let datos = [];
    let filasLote = [];
    let lote = [];
    let nombreP = filasElementos[index].children[1].innerHTML.trim();
    let presentacionP = filasElementos[index].children[2].innerHTML.trim();
    let descripcionP = filasElementos[index].children[3].innerHTML.trim();
    let fechaVencimientoP = filasElementos[index].children[4].innerHTML.trim();
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
    };
    await ipcRenderer.invoke("nuevoProductoMultiple", filasDatos, filasLote);
  }
};

const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
};
