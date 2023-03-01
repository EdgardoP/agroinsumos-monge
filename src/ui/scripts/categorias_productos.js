const { ipcRenderer } = require("electron");

let categoria_id = document.getElementById("categoria_id");
let categoria_nombre = document.getElementById("categoria_nombre");
let categoria_descripcion = document.getElementById("categoria_descripcion");

let tablaEntradas = document.getElementById("tablaEntradas");
document.addEventListener("DOMContentLoaded", function () {
  obtenerCategorias();
});

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

const obtenerCategorias = async () => {
  await ipcRenderer.invoke("obtenerCategorias");
};

const modificarCategoria = (id) => {
  console.log(documentos);
  console.log(id);
  let element = documentos.find((element) => element.categoria_id == id);
  categoria_id.value = element.categoria_id;
  categoria_nombre.value = element.categoria_nombre;
  categoria_descripcion.value = element.categoria_descripcion;
};

const guardarModificarCategoria = async () => {
  let obj = {
    categoria_id: categoria_id.value,
    categoria_nombre: categoria_nombre.value,
    categoria_descripcion: categoria_descripcion.value,
  };
  await ipcRenderer.invoke("modificarCategoria", obj);
};

const eliminarCategoria = async (id) => {
  await ipcRenderer.invoke("eliminarCategoria", id);
};

const limpiar = () => {
  categoria_id.value = "";
  categoria_nombre.value = "";
  categoria_descripcion.value = "";
};

const nuevaCategoria = async () => {
  const obj = {
    categoria_nombre: categoria_nombre.value,
    categoria_descripcion: categoria_descripcion.value,
  };
  await ipcRenderer.invoke("nuevaCategoria", obj);
};

let i = 0;
let documentos;
ipcRenderer.on("lista_de_categorias", (event, results) => {
  documentos = results[0];
  console.log(documentos);
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr>
        <td style="max-width: 10vh; min-width: 10vh; width: 10vh">${i}</td>
        <td style="max-width: 10vh; min-width: 10vh; width: 10vh">
        ${element.categoria_id}
        </td>
        <td style="max-width: 28vh; min-width: 28vh; width: 28vh">
        ${element.categoria_nombre}
        </td>
        <td style="max-width: 28vh; min-width: 28vh; width: 28vh">
        ${element.categoria_descripcion}
        </td>
        <td style="max-width: 30vh; min-width: 30vh; width: 30vh">
        <div class="flexRow">
            <button
                id = ${element.categoria_id}
                class="botonListado colorAmarillo"
                onclick="modificarCategoria(this.id) ;event.preventDefault()"
                style="margin-right: 20px"
                >
                MODIFICAR
            </button>
            <button
                id = ${element.categoria_id}
                onclick="eliminarCategoria(this.id);event.preventDefault()"
                class="botonListado colorRojo"
                >
                ELIMINAR
            </button>
        </div>
        </td>
    </tr>
    `;
  });
  tablaEntradas.innerHTML += plantilla;
});
