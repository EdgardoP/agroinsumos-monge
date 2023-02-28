const { ipcRenderer } = require("electron");

// let productoNombre = document.getElementById("productoNombre");
// let productoDescripcion = document.getElementById("productoDescripcion");
// let productoProveedor = document.getElementById("productoProveedor");
// let productoColor = document.getElementById("productoColor");
// let productoCategoria = document.getElementById("productoCategoria");
// let lotePresentacion = document.getElementById("lotePresentacion");
// let productoFechaVencimiento = document.getElementById(
//   "productoFechaVencimiento"
// );
// let loteValorUnitarioCompra = document.getElementById(
//   "loteValorUnitarioCompra"
// );
// let loteValorUnitarioVenta = document.getElementById("loteValorUnitarioVenta");
// let loteCantidad = document.getElementById("loteCantidad");
// let tablaEntradas = document.getElementById("tablaEntradas");
let idDocumento = Math.random() * (9999 - 1) + 1;
let desdeLaFecha = document.getElementById("desdeLaFecha");
let hastaLaFecha = document.getElementById("hastaLaFecha");
let nombreEmpleado = document.getElementById("nombreEmpleado");
let sueldoBase = document.getElementById("sueldoBase");
let horasExtra = document.getElementById("horasExtra");
let bonificaciones = document.getElementById("bonificaciones");
let deducciones = document.getElementById("deducciones");
document.addEventListener("DOMContentLoaded", function () {
  //   obtenerCategorias();
  //   obtenerProveedores();
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
// const obtenerCategorias = async () => {
//   await ipcRenderer.invoke("obtenerCategorias");
// };

// let listaDeCategoriasRaw = [];
// ipcRenderer.on("lista_de_categorias", (event, results) => {
//   let plantilla = "";
//   listaDeCategoriasRaw = results[0];
//   listaDeCategoriasRaw.forEach((element) => {
//     plantilla += `<option value = ${element.categoria_id} > ${element.categoria_nombre}</option>`;
//   });
//   let nullOption = `<option value = 0>Seleccione</option>`;
//   productoCategoria.innerHTML = nullOption + plantilla;
// });

// const obtenerProveedores = async () => {
//   await ipcRenderer.invoke("obtenerProveedores");
// };

// let listaDeProveedoresRaw = [];
// ipcRenderer.on("lista_de_proveedores", (event, results) => {
//   let plantilla = "";
//   listaDeProveedoresRaw = results[0];
//   listaDeProveedoresRaw.forEach((element) => {
//     plantilla += `<option value = ${element.proveedor_id} > ${element.proveedor_nombre}</option>`;
//   });
//   let nullOption = `<option value = 0>Seleccione</option>`;
//   productoProveedor.innerHTML = nullOption + plantilla;
// });

// let cantidad_filas_ingresadas = 0;
const agregarFilasProductos = async () => {
  let plantilla = "";
  plantilla += `
    <tr class = "filasElementos">
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${desdeLaFecha.value}
        </th>
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${hastaLaFecha.value}
        </th>
        <th style="min-width: 260px; max-width: 260px; width: 260px">
        ${nombreEmpleado.value}
        </th>
        <th style="min-width: 100px; max-width: 100px; width: 160px">
          ${sueldoBase.value}
        </th>
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${horasExtra.value}
        </th>
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${bonificaciones.value}
        </th>
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${deducciones.value}
        </th>
        <th style="min-width: 160px; max-width: 160px; width: 160px">
          ${
            parseInt(sueldoBase.value) +
            parseInt(bonificaciones.value) -
            parseInt(deducciones.value)
          }
        </th>
        <td style="min-width: 130px; max-width: 130px; width: 130px">
            <div>
                <button 
                    onclick="modificarFila();event.preventDefault()"
                    class="accionesBoton colorSecundario">
                    <img 
                    src="icons/edit-button.png" alt="" />
                    
                </button>
                <button 
                    onclick="eliminarFila();event.preventDefault()"
                    class="btnEliminarFila accionesBoton colorRojo">
                    <img src="icons/cancel.png" alt="" />
                </button>
            </div>
        </td>
    </tr>`;
  tablaEntradas.innerHTML += plantilla;
  limpiarTextos();
};

const limpiarTextos = () => {
  nombreEmpleado.value = "";
  sueldoBase.value = "";
  horasExtra.value = "";
  bonificaciones.value = "";
  deducciones.value = "";
  nombreEmpleado.focus();
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  //   console.log(index);
  let desdeLaFechaP = index.children[0].innerHTML.trim();
  let hastaLaFechaP = index.children[1].innerHTML.trim();
  let nombreEmp = index.children[2].innerHTML.trim();
  let sueldoP = index.children[3].innerHTML.trim();
  let horasExtraP = index.children[4].innerHTML.trim();
  let bonificacionesP = index.children[5].innerHTML.trim();
  let deduccionesP = index.children[6].innerHTML.trim();
  desdeLaFecha.value = desdeLaFechaP;
  hastaLaFecha.value = hastaLaFechaP;
  nombreEmpleado.value = nombreEmp;
  sueldoBase.value = sueldoP;
  horasExtra.value = horasExtraP;
  bonificaciones.value = bonificacionesP;
  deducciones.value = deduccionesP;
  index.remove();
};

const nuevoProducto = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  for (let index = 0; index < filasElementos.length; index++) {
    let filasDatos = {};
    // let datos = [];
    let filasLote = [];
    // let lote = [];
    // let nombreP = filasElementos[index].children[1].innerHTML.trim();
    // let presentacionP = filasElementos[index].children[2].innerHTML.trim();
    // let descripcionP = filasElementos[index].children[3].innerHTML.trim();
    // let fechaVencimientoP = filasElementos[index].children[4].innerHTML.trim();
    // let categoriaP = filasElementos[index].children[5].innerHTML.trim();
    // let colorP = filasElementos[index].children[6].innerHTML.trim();
    // let proveedorP = filasElementos[index].children[7].innerHTML.trim();
    // let valorCompra = filasElementos[index].children[8].innerHTML.trim();
    // let valorVenta = filasElementos[index].children[9].innerHTML.trim();
    // let cantidadP = filasElementos[index].children[10].innerHTML.trim();
    let desdeLaFechaP = filasElementos[index].children[0].innerHTML.trim();
    let hastaLaFechaP = filasElementos[index].children[1].innerHTML.trim();
    let nombreEmp = filasElementos[index].children[2].innerHTML.trim();
    let sueldoP = filasElementos[index].children[3].innerHTML.trim();
    let horasExtraP = filasElementos[index].children[4].innerHTML.trim();
    let bonificacionesP = filasElementos[index].children[5].innerHTML.trim();
    let deduccionesP = filasElementos[index].children[6].innerHTML.trim();

    filasDatos = {
      planilla_fecha_ini: desdeLaFechaP,
      planilla_fecha_fin: hastaLaFechaP,
      planilla_sueldo_base: sueldoP,
      planilla_horas_extras: horasExtraP,
      planilla_bonificaciones: bonificacionesP,
      planilla_deducciones: deduccionesP,
      planilla_usuario_fk: 1,
      planilla_nombre_empleado: nombreEmp,
      planilla_codigo: idDocumento,
    };
    await ipcRenderer.invoke("insertar_nueva_planilla", filasDatos);
  }
};

const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
};
