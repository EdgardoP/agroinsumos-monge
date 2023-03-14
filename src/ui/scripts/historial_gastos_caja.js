// const { ipcRenderer } = require("electron");

let buscarEntrada = document.getElementById("buscarEntrada");
let tablaEntradas = document.getElementById("tablaSalidas");
let fecha_inicial_salida = document.getElementById("fecha_inicial_salida");
let fecha_final_salida = document.getElementById("fecha_final_salida");

document.addEventListener("DOMContentLoaded", function () {
  cargar_historial_gastos_caja();
});

const cargar_historial_gastos_caja = async () => {
  await ipcRenderer.invoke("historial_gastos_caja");
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

const gastosCaja = async (id) => {
  await ipcRenderer.invoke("mostrar_gastos_caja_documento", id);
};

let i = 0;
ipcRenderer.on("historial_gastos_caja", (event, results) => {
  let documentos = results[0];
  console.log(documentos);
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr class = "filasElementos">
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${i}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${element.codigo}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">${convertirFecha(
        element.gastos_fecha
      )}</td>
      <td style="max-width: 25vh; min-width: 25vh; width: 25vh">
        <div class="flexRow">
          <button
            id = ${element.codigo}
            onclick="gastosCaja(this.id)"
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
