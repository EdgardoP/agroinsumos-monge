// const { ipcRenderer } = require("electron");

let buscarEntrada = document.getElementById("buscarEntrada");
let tablaEntradas = document.getElementById("tablaEntradas");
let fecha_inicial_entrada = document.getElementById("fecha_inicial_entrada");
let fecha_final_entrada = document.getElementById("fecha_final_entrada");

document.addEventListener("DOMContentLoaded", function () {
  cargarEntradas();
});

const cargarEntradas = async () => {
  await ipcRenderer.invoke(
    "cargar_historial_entradas",
    "1999-01-01",
    "2050-01-01"
  );
};

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
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
  await ipcRenderer.invoke("historial_entradas", id);
  // window.location = "documento_historial_entrada.ejs";
};

const buscarDocumento = async () => {
  let valorBuscar = buscarEntrada.value;
  let newValor = valorBuscar.trim();
  await ipcRenderer.invoke("historial_entradas", newValor);
};

const filtrarDocumentos = async () => {
  let fechaUno = fecha_inicial_entrada.value;
  let fechaDos = fecha_final_entrada.value;
  await ipcRenderer.invoke("cargar_historial_entradas", fechaUno, fechaDos);
  tablaEntradas.innerHTML = "";
  // window.location = "historial_entradas.ejs";
};

let i = 0;
ipcRenderer.on("historial_entradas", (event, results) => {
  console.log(results);
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
        element.entradas_fecha
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
