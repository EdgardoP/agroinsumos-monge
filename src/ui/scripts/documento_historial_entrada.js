const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 0.2,
    filename: `Entrada-${fechaActual.innerHTML}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "landscape" },
  };
  let elementoImprimir = document.getElementById("elementoImprimir");
  html2pdf().set(opt).from(elementoImprimir).save();
});

let fechaActual = document.getElementById("fechaActual");
let tablaEntradas = document.getElementById("tablaEntradas");
let numeroSerie = document.getElementById("numeroSerie");
document.addEventListener("DOMContentLoaded", function () {});

const homeDir = require("os").homedir();
const desktopDir = `${homeDir}/Desktop/`;
console.log(desktopDir);

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  let arr = fechaActual.innerHTML.split("/");
  console.log(arr);
  console.log(numeroSerie.innerHTML);
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  window.location.href = "#modal_excel";
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn ||
          `${desktopDir}Entrada-Fecha-${arr[0]}-${arr[1]}-${arr[2]}.` +
            (type || "xlsx")
      );
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

function formatDinero(numero) {
  // console.log(numero.toLocaleString());
  return numero.toLocaleString();
}
// console.log(formatDinero("5"));

ipcRenderer.on("documento_historial_entrada", (event, results, id) => {
  numeroSerie.innerHTML = id;
  let listado = results[0];
  console.log(results[0]);
  let plantilla = "";
  let totalOtrosGastos = 0;
  let totalSubTotales = 0;
  let totalTotal = 0;
  listado.forEach((element, index, array) => {
    fechaActual.innerHTML = convertirFecha(element.entradas_fecha);
    let otrosGastos = parseFloat(element.entrada_otros_gastos);
    let subtotal = parseFloat(element.sub_total);
    totalOtrosGastos += otrosGastos;
    totalSubTotales += subtotal;
    totalTotal = parseFloat(totalOtrosGastos + totalSubTotales).toFixed(2);
    console.log(totalSubTotales);
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
      L. ${parseFloat(element.lote_valor_unitario_compra).toFixed(2)}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_cantidad_ingresar}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.entrada_tipo_pago}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      L. ${parseFloat(element.entrada_otros_gastos).toFixed(2)}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      L. ${parseFloat(element.sub_total).toFixed(2)}
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
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff"><strong> L. ${parseFloat(
      totalOtrosGastos
    ).toFixed(2)} </strong></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff"><strong>L. ${parseFloat(
      totalSubTotales
    ).toFixed(2)}</strong></td>
    </tr>
    <tr class = "filas">
    <td style="min-width: 20px; max-width: 20px; width: 20px"></td>
    <td style="min-width: 50px; max-width: 50px; width: 50px"></td>
    <td style="min-width: 200px; max-width: 200px; width: 200px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px">Total:</td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff"> <strong>L. ${parseFloat(
      totalTotal
    ).toFixed(2)}</strong></td>
    </tr>
    `;
  //   tablaEntradas.innerHTML += plantillaTotales;
});

//Imprimir el Reporte
