const { ipcRenderer } = require("electron");

let buscarSalida = document.getElementById("buscarSalida");
let tablaEntradas = document.getElementById("tablaSalidas");
let fecha_inicial_salida = document.getElementById("fecha_inicial_salida");
let fecha_final_salida = document.getElementById("fecha_final_salida");

document.addEventListener("DOMContentLoaded", function () {
  cargarEntradas();
});

const cargarEntradas = async () => {
  await ipcRenderer.invoke(
    "cargar_historial_salidas",
    "1999-01-01",
    "2050-01-01"
  );
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
  // window.location = "documento_historial_salida.ejs";
};

const buscarDocumento = async () => {
  let valorBuscar = buscarSalida.value;
  let newValor = valorBuscar.trim();
  await ipcRenderer.invoke("historial_salidas", newValor);
};

const filtrarDocumentos = async () => {
  let fechaUno = fecha_inicial_salida.value;
  let fechaDos = fecha_final_salida.value;
  await ipcRenderer.invoke("cargar_historial_salidas", fechaUno, fechaDos);
  tablaEntradas.innerHTML = "";
};

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9,.]/g, "");
}

let i = 0;
ipcRenderer.on("historial_salidas", (event, results) => {
  let documentos = results[0];
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr class = "filasElementos">
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
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
});

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
