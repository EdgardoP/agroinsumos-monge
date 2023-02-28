const { ipcRenderer } = require("electron");

let buscarEntrada = document.getElementById("buscarEntrada");
let tablaEntradas = document.getElementById("tablaSalidas");
let fecha_inicial_salida = document.getElementById("fecha_inicial_salida");
let fecha_final_salida = document.getElementById("fecha_final_salida");

document.addEventListener("DOMContentLoaded", function () {
  cargarPlanillas();
});

const cargarPlanillas = async () => {
  await ipcRenderer.invoke("historial_planillas");
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

const visualizarPlanilla = async (id) => {
  await ipcRenderer.invoke("mostrar_planilla_documento", id);
  // window.location = "documento_historial_salida.ejs";
};

// const filtrarDocumentos = async () => {
//   let fechaUno = fecha_inicial_salida.value;
//   let fechaDos = fecha_final_salida.value;
//   await ipcRenderer.invoke("cargar_historial_salidas", fechaUno, fechaDos);
//   tablaEntradas.innerHTML = "";
// };

let i = 0;
ipcRenderer.on("historial_planillas", (event, results) => {
  let documentos = results[0];
  console.log(documentos);
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${i}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${convertirFecha(
        element.planilla_fecha_ini
      )}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${convertirFecha(
        element.planilla_fecha_fin
      )}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">
        <div class="flexRow">
          <button
            id = ${element.codigo}
            onclick="visualizarPlanilla(this.id)"
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
