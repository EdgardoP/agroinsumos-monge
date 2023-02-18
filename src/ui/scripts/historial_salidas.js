const { ipcRenderer } = require("electron");

let buscarEntrada = document.getElementById("buscarEntrada");
let tablaEntradas = document.getElementById("tablaSalidas");

document.addEventListener("DOMContentLoaded", function () {
  cargarEntradas();
});

const cargarEntradas = async () => {
  await ipcRenderer.invoke("cargar_historial_salidas");
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

const visualizarEntrada = async (id) => {
  await ipcRenderer.invoke("historial_salidas", id);
  window.location = "documento_historial_salida.ejs";
};

let i = 0;
ipcRenderer.on("historial_salidas", (event, results) => {
  let documentos = results[0];
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${i}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh"><strong>${
        element.numero_serie
      }</strong></td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${convertirFecha(
        element.salida_fecha
      )}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">
        <div class="flexRow">
          <button
            id = ${element.numero_serie}
            onclick="visualizarEntrada(this.id)"
            class="botonListado colorSecundario"
            style="margin-right: 20px"
          >
            VER
          </button>
        </div>
      </td>
    </tr>`;
  });
  tablaEntradas.innerHTML += plantilla;
});
