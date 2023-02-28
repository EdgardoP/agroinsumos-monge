const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoTablaPlanilla = document.getElementById("cuerpoTablaPlanilla");

btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `REPORTE_INVENTARIO_${obtenerFecha("")}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "landscape" },
  };
  let elementoImprimir = document.getElementById("elementoImprimir");
  html2pdf().set(opt).from(elementoImprimir).save();
});

document.addEventListener("DOMContentLoaded", function () {});

const fechaPalabras = (fecha) => {
  switch (fecha) {
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
  let fechaNueva = `${mes} DEL `;
  return fechaNueva;
};

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(wb, fn || `../INVENTARIO-FECHA.` + (type || "xlsx"));
}

const obtenerFecha = (formato) => {
  let nuevaFecha = Date.now();
  const fechaHoy = new Date(nuevaFecha);
  let fechaActualIso = fechaHoy.toISOString();
  let fechaParse = new Date(fechaActualIso),
    mes = ("0" + (fechaParse.getMontd() + 1)).slice(-2),
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
    mes = ("0" + (fechaParse.getMontd() + 1)).slice(-2),
    dia = ("0" + fechaParse.getDate()).slice(-2);
  let fechaDiaMesAnio = (fechaOrdenada = [
    dia,
    mes,
    fechaParse.getFullYear(),
  ].join("/"));
  return fechaDiaMesAnio;
};

let mes;
let anio;
ipcRenderer.on("documento_planilla", (event, results, id) => {
  let productos;
  let plantilla = "";
  let totalSueldos = 0;
  let totalNetos = 0;
  productos = results[0];
  console.log(results);
  productos.forEach((element, index, array) => {
    let sueldo_base = parseInt(element.planilla_sueldo_base);
    totalSueldos += sueldo_base;
    let bono = parseInt(element.planilla_bonificaciones);
    let deducciones = parseInt(element.planilla_deducciones);
    let totalNeto = sueldo_base - deducciones + bono;
    totalNetos += totalNeto;
    plantilla += `
    <tr>
      <td>${index}</td>
      <td>${element.planilla_nombre_empleado}</td>
      <td style = "text-align:right">L. ${sueldo_base.toFixed(2)}</td>
      <td style = "text-align:right">${element.planilla_horas_extras}</td>
      <td style = "text-align:right">L. ${bono.toFixed(2)}</td>
      <td style = "text-align:right">L.  ${deducciones.toFixed(2)}</td>
      <td style = "text-align:right">L. ${totalNeto.toFixed(2)}</td>
      <td style = "text-align:right"></td>
    <tr>
    `;
  });
  plantilla += `
    <tr style = "text-align:right">
      <td></td>
      <td>TOTAL PLANILLA</td>
      <td>L. ${totalSueldos.toFixed(2)}</td>
      <td></td>
      <td></td>
      <td></td>
      <td>L. ${totalNetos.toFixed(2)}</td>
      <td style = "text-align:right"></td>
    </tr>
  `;
  cuerpoTablaPlanilla.innerHTML += plantilla;
});
