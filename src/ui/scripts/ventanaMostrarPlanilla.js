const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoTablaPlanilla = document.getElementById("cuerpoTablaPlanilla");
let tituloDesdeHasta = document.getElementById("tituloDesdeHasta");
btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `PLANILLA ${tituloDesdeHasta.innerHTML}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "landscape" },
  };
  let elementoImprimir = document.getElementById("elementoImprimir");
  html2pdf().set(opt).from(elementoImprimir).save();
});

document.addEventListener("DOMContentLoaded", function () {});

const fechaPalabras = (fechaIni, fechaFin, fechaMes, fechaAnio) => {
  let mes;
  switch (fechaMes) {
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
  let fechaNueva = `CORRESPONDIENTE DEL ${fechaIni} DE ${mes} AL ${fechaFin} DEL ${fechaAnio}`;
  // console.log(fechaNueva);
  return fechaNueva;
};

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  window.location.href = "#modal_excel";
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(wb, fn || `../PLANILLA-NUEVA.` + (type || "xlsx"));
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
    mes = ("0" + (fechaParse.getMonth() + 1)).slice(-2),
    dia = ("0" + fechaParse.getDate()).slice(-2);
  let fechaDiaMesAnio = (fechaOrdenada = [
    dia,
    mes,
    fechaParse.getFullYear(),
  ].join("/"));
  return fechaDiaMesAnio;
};

let anio;
let primerFecha;
let segundaFecha;
const dividirFecha = (fecha, fecha2) => {
  let arr = fecha.split("/");
  let arrDia = arr[0];
  let arrMes = arr[1];
  let arrAnio = arr[2];

  let arr2 = fecha2.split("/");
  let arr2Dia = arr2[0];
  let arr2Mes = arr2[1];
  let arr2Anio = arr2[2];
  tituloDesdeHasta.innerHTML = `${fechaPalabras(
    arrDia,
    arr2Dia,
    arrMes,
    arrAnio
  )}`;
};

ipcRenderer.on("documento_planilla", (event, results, id) => {
  let plantilla = "";
  let totalSueldos = 0;
  let totalNetos = 0;
  let documentos = results[0];

  documentos.forEach((element, index, array) => {
    console.log(element);
    let fechaUno = convertirFecha(element.planilla_fecha_ini);
    let fechaDos = convertirFecha(element.planilla_fecha_fin);
    dividirFecha(fechaUno, fechaDos);
    // console.log(convertirFecha(element.planilla_fecha_fin));
    let sueldo_base = parseInt(element.planilla_sueldo_base);
    totalSueldos += sueldo_base;
    let bono = parseInt(element.planilla_bonificaciones);
    let deducciones = parseInt(element.planilla_deducciones);
    let totalNeto = sueldo_base - deducciones + bono;
    totalNetos += totalNeto;
    plantilla += `
    <tr style = "text-align:right">
      <td>${index}</td>
      <td>${element.planilla_nombre_empleado}</td>
      <td>L. ${sueldo_base.toFixed(2)}</td>
      <td>${element.planilla_horas_extras}</td>
      <td>L. ${bono.toFixed(2)}</td>
      <td>L. ${deducciones.toFixed(2)}</td>
      <td>L. ${totalNeto.toFixed(2)}</td>
      <td></td>
    </tr>`;
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
      <td></td>
    </tr>`;
  cuerpoTablaPlanilla.innerHTML += plantilla;
});
