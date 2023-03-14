const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoTablaRecuperaciones = document.getElementById(
  "cuerpoTablaRecuperaciones"
);
let documentosCredito = document.getElementById("documentosCredito");
let documentosDeposito = document.getElementById("documentosDeposito");
let totaldocumentos = document.getElementById("totaldocumentos");
let recuperacionContado = document.getElementById("recuperacionContado");
let recuperacionDeposito = document.getElementById("recuperacionDeposito");
let totalRecuperaciones = document.getElementById("totalRecuperaciones");
let sumaTotalContado = document.getElementById("sumaTotalContado");
let sumaTotalDeposito = document.getElementById("sumaTotalDeposito");
let cuerpoTablaCredito = document.getElementById("cuerpoTablaCredito");
let cuerpoTablaContado = document.getElementById("cuerpoTablaContado");
let cuerpoTablaDeposito = document.getElementById("cuerpoTablaDeposito");

btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `GASTOS DE CAJA`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "landscape" },
  };
  let elementoImprimir = document.getElementById("elementoImprimir");
  html2pdf().set(opt).from(elementoImprimir).save();
});

document.addEventListener("DOMContentLoaded", function () {});

const fechaPalabras = (fecha) => {
  console.log(fecha);
  let fechaArray = fecha.split("-");
  let mes;
  switch (fechaArray[1]) {
    case "01":
      mes = "ENERO";
      break;
    case "02":
      mes = "FEBRERO";
      break;
    case "03":
      mes = "MARZO";
      break;
    case "04":
      mes = "ABRIL";
      break;
    case "05":
      mes = "MAYO";
      break;
    case "06":
      mes = "JUNIO";
      break;
    case "07":
      mes = "JULIO";
      break;
    case "08":
      mes = "AGOSTO";
      break;
    case "09":
      mes = "SEPTIEMBRE";
      break;
    case "10":
      mes = "OCTUBRE";
      break;
    case "11":
      mes = "NOVIEMBRE";
      break;
    case "12":
      mes = "DICIEMBRE";
      break;
    default:
      mes = "ERROR";
      break;
  }
  let fechaNueva = `${fechaArray[2]} DE ${mes} DEL ${fechaArray[0]} `;
  return fechaNueva;
};

const homeDir = require("os").homedir();
const desktopDir = `${homeDir}/Desktop/`;
console.log(desktopDir);

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("tablaFinanzas");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  window.location.href = "#modal_excel";
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn || `${desktopDir}GASTOS DE CAJA.` + (type || "xlsx")
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

//class html2pdf__page-break

let fechaMostrar;
ipcRenderer.on("documento_gastos", (event, results, fecha) => {
  console.log(results);
  let fechaActual = document.getElementsByClassName("fechaActual");
  fechaMostrar = fecha;
  for (let index = 0; index < fechaActual.length; index++) {
    fechaActual[index].innerHTML = fechaPalabras(fechaMostrar);
  }
  console.log(results[0]);
  let documentos = results[0];
  let plantilla = "";
  let totalGastos = 0;
  documentos.forEach((element) => {
    totalGastos += element.gastos_cantidad;
    plantilla += `
    <tr>
      <td style="width: 400px; max-width: 400px">${element.gastos_detalle}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        element.gastos_cantidad
      ).toFixed(2)}</td>
    </tr>
    `;
  });
  plantilla += `
  <tr>
    <td style="width: 150px; max-width: 150px;">TOTAL</td>
    <td style="width: 300px; max-width: 300px;">L. ${parseFloat(
      totalGastos
    ).toFixed(2)}</td>
  </tr>
  `;
  cuerpoTablaRecuperaciones.innerHTML = plantilla;
});
