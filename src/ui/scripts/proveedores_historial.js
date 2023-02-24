const { ipcRenderer } = require("electron");

let buscarProveedor = document.getElementById("buscarProveedor");

let nuevo_proveedor_nombre = document.getElementById("nuevo_proveedor_nombre");
let nuevo_proveedor_numero = document.getElementById("nuevo_proveedor_numero");
let nuevo_proveedor_estado = document.getElementById("nuevo_proveedor_estado");

let modificar_proveedor_nombre = document.getElementById(
  "modificar_proveedor_nombre"
);
let modificar_proveedor_numero = document.getElementById(
  "modificar_proveedor_numero"
);
let modificar_proveedor_estado = document.getElementById(
  "modificar_proveedor_numero"
);

let tablaEntradas = document.getElementById("tablaEntradas");
document.addEventListener("DOMContentLoaded", function () {
  cargarDocumentos();
  obtenerProveedores();
});

const cargarDocumentos = async () => {
  await ipcRenderer.invoke("documentosHistorialProveedores");
};

function formatDinero(numero) {
  return numero.toLocaleString();
}

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
  let fechaDiaMesAnio = (fechaOrdenada = [
    dia,
    mes,
    fechaParse.getFullYear(),
  ].join("/"));
  return fechaDiaMesAnio;
};

const nuevoProveedor = async () => {
  let fecha = obtenerFecha("YYYY/MM/DD");
  const obj = {
    proveedor_nombre: nuevo_proveedor_nombre.value,
    proveedor_numero: nuevo_proveedor_numero.value,
    proveedor_estado: "Activo",
  };
  await ipcRenderer.invoke("nuevoProveedor", obj, fecha);
  window.location.reload();
};

const obtenerProveedores = async () => {
  await ipcRenderer.invoke("obtenerProveedores");
};

let listaDeProveedoresRaw = [];
ipcRenderer.on("lista_de_proveedores", (event, results) => {
  listaDeProveedoresRaw = results[0];
});

let idPro;
const modificarProveedor = () => {
  console.log(listaDeProveedoresRaw);
  let index = event.target.parentNode.parentNode.parentNode;
  idPro = index.children[1].innerHTML;
  console.log(idPro);
  let elemento = listaDeProveedoresRaw.find(
    (element) => element.proveedor_id == idPro
  );
  modificar_proveedor_nombre.value = elemento.proveedor_nombre;
  modificar_proveedor_numero.value = elemento.proveedor_numero;
};

const confirmarModificarProveedor = async () => {
  let obj = {
    proveedor_id: idPro,
    proveedor_nombre: modificar_proveedor_nombre.value,
    proveedor_numero: modificar_proveedor_numero.value,
  };
  await ipcRenderer.invoke("modificarProveedor", obj);
  window.location.reload();
};

const visualizarDocumento = async (id) => {
  let fechaInicial = "1999-01-01";
  let fechaFinal = "2050-01-01";
  await ipcRenderer.invoke("historial_proveedor", id, fechaInicial, fechaFinal);
  window.location = "proveedores_historial_documento.ejs";
};

let i = 0;
ipcRenderer.on("documentos_historial_proveedores", (event, results) => {
  let documentos = results[0];
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr>
      <td style="max-width: 10vh; min-width: 10vh; width: 10vh">${i}</td>
      <td style="max-width: 10vh; min-width: 10vh; width: 10vh">${
        element.proveedor_id
      }</td>
      <td style="max-width: 28vh; min-width: 28vh; width: 28vh">
      ${element.proveedor_nombre}
      </td>
      <td style="max-width: 28vh; min-width: 28vh; width: 28vh">${convertirFecha(
        element.historial_proveedor_fecha
      )}</td>
      <td style="max-width: 20vh; min-width: 20vh; width: 20vh">${
        element.proveedor_estado
      }</td>
      <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
        L. ${formatDinero(element.historial_proveedor_saldo_nuevo)}.00
      </td>
      <td style="max-width: 30vh; min-width: 30vh; width: 30vh">
        <div class="flexRow">
          <button
            id = ${element.proveedor_id}
            onclick="visualizarDocumento(this.id)"
            class="botonListado colorSecundario"
            style="margin-right: 20px"
          >
            VER
          </button>
          <button
          id = ${element.proveedor_id}
          class="botonListado colorAmarillo"
          onclick="location.href='#modal_modificar_proveedor';modificarProveedor() ;event.preventDefault()"
          style="margin-right: 20px"
        >
          MODIFICAR
        </button>
          <button
            id = ${element.proveedor_id}
            onclick="event.preventDefault()"
            class="botonListado colorRojo"
          >
            INACTIVAR
          </button>
        </div>
      </td>
    </tr>`;
  });
  tablaEntradas.innerHTML += plantilla;
});
