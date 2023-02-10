const { ipcRenderer } = require("electron");

let buscarProveedor = document.getElementById("buscarProveedor");
let tablaEntradas = document.getElementById("tablaEntradas");

document.addEventListener("DOMContentLoaded", function () {
  cargarDocumentos();
});

const cargarDocumentos = async () => {
  await ipcRenderer.invoke("documentosHistorialProveedores");
};

function formatDinero(numero) {
  return numero.toLocaleString();
}

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
      <td style="max-width: 28vh; min-width: 28vh; width: 28vh">${
        element.proveedor_estado
      }</td>
      <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
        L. ${formatDinero(element.historial_proveedor_saldo_nuevo)}.00
      </td>
      <td style="max-width: 22vh; min-width: 22vh; width: 22vh">
        <div class="flexRow">
          <button
            id = ${element.proveedor_id}
            onclick="event.preventDefault()"
            class="botonListado colorSecundario"
            style="margin-right: 20px"
          >
            VER
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
