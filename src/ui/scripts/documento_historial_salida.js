const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 0.2,
    filename: `Salida-${fechaActual.innerHTML}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "portrait" },
  };
  let elementoImprimir = document.getElementById("elementoImprimir");
  html2pdf().set(opt).from(elementoImprimir).save();
});

let fechaActual = document.getElementById("fechaActual");
let tablaSalidas = document.getElementById("tablaSalidas");
let numeroSerie = document.getElementById("numeroSerie");
document.addEventListener("DOMContentLoaded", function () {});

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  console.log(numeroSerie.innerHTML);
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  window.location.href = "#modal_excel";
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn ||
          `../SalidaNo-${numeroSerie.innerHTML}-${fechaActual.innerHTML}.` +
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
  return numero.toLocaleString();
}

ipcRenderer.on("documento_historial_salida", (event, results, id) => {
  numeroSerie.innerHTML = id;
  let listado = results[0];
  console.log(results[0]);
  let plantilla = "";
  let totalOtrosGastos = 0;
  let totalSubTotales = 0;
  listado.forEach((element, index, array) => {
    fechaActual.innerHTML = convertirFecha(element.salida_fecha);
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
      L.${parseInt(element.lote_valor_unitario_venta).toFixed(2)}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.salida_cantidad}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      ${element.salida_tipo_pago}
      </td>
      <td style="min-width: 130px; max-width: 130px; width: 130px">
      L.${parseInt(element.sub_total).toFixed(2)}
      </td>
    </tr>`;
  });
  tablaSalidas.innerHTML += plantilla;
  tablaSalidas.innerHTML += `
    <tr class = "filas">
    <td style="min-width: 20px; max-width: 20px; width: 20px"></td>
    <td style="min-width: 50px; max-width: 50px; width: 50px"></td>
    <td style="min-width: 200px; max-width: 200px; width: 200px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px"></td>
    <td style="min-width: 130px; max-width: 130px; width: 130px">Total:</td>
    <td style="min-width: 130px; max-width: 130px; width: 130px;background-color: rgb(138, 138, 138); color: #fff"><strong>L. ${parseInt(
      totalSubTotales
    ).toFixed(2)}</strong></td>
    </tr>
    `;
});

//Imprimir el Reporte
