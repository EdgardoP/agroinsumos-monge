const { ipcRenderer } = require("electron");

let fechaActual = document.getElementById("fechaActual");
let tablaEntradas = document.getElementById("tablaEntradas");
let numeroSerie = document.getElementById("numeroSerie");
document.addEventListener("DOMContentLoaded", function () {
  fechaActual.innerHTML = obtenerFecha("YYYY/MM/DD");
});

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

function formatDinero(numero) {
  // console.log(numero.toLocaleString());
  return numero.toLocaleString();
}
console.log(formatDinero("5"));

ipcRenderer.on("documento_historial_entrada", (event, results, id) => {
  numeroSerie.innerHTML = id;
  let listado = results[0];
  console.log(results[0]);
  let plantilla = "";
  let totalOtrosGastos = 0;
  let totalSubTotales = 0;
  listado.forEach((element, index, array) => {
    let otrosGastos = parseInt(element.entrada_otros_gastos);
    let subtotal = parseInt(element.sub_total);
    totalOtrosGastos += otrosGastos;
    totalSubTotales += subtotal;
    plantilla += `
    <tr class = "filas">
      <td style="min-width: 20px; max-width: 20px; width: 20px">${
        index + 1
      }</td>
      <td style="min-width: 50px; max-width: 50px; width: 50px">
        ${element.producto_id}
      </td>
      <td style="min-width: 200px; max-width: 200px; width: 200px">
      ${element.producto_nombre}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.lote_presentacion}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.lote_valor_unitario_compra}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_cantidad_ingresar}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_stock_antiguo}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.stock_actualizado}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_tipo_pago}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_otros_gastos}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.sub_total}
      </td>
    </tr>`;
  });
  tablaEntradas.innerHTML += plantilla;
  tablaEntradas.innerHTML += `
    <tr class = "filas">
    <td style="min-width: 20px; max-width: 20px; width: 20px"></td>
    <td style="min-width: 50px; max-width: 50px; width: 50px"></td>
    <td style="min-width: 200px; max-width: 200px; width: 200px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff">L. ${totalOtrosGastos}</td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff">L. ${totalSubTotales}</td>
    </tr>
    <tr class = "filas">
    <td style="min-width: 20px; max-width: 20px; width: 20px"></td>
    <td style="min-width: 50px; max-width: 50px; width: 50px"></td>
    <td style="min-width: 200px; max-width: 200px; width: 200px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff">L. ${formatDinero(
      totalOtrosGastos + totalSubTotales
    )}</td>
    </tr>
    `;
  //   tablaEntradas.innerHTML += plantillaTotales;
});
