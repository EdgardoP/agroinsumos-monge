const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let ventasContado = document.getElementById("ventasContado");
let ventasCredito = document.getElementById("ventasCredito");
let ventasDeposito = document.getElementById("ventasDeposito");
let totalVentas = document.getElementById("totalVentas");
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
    filename: `LIQUIDACION_${fechaPalabras(fechaMostrar)}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "portrait" },
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

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(wb, fn || `../SalidaNo.` + (type || "xlsx"));
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

let totalContado = 0;
let totalDeposito = 0;
let fechaMostrar;
ipcRenderer.on("ventas_del_dia", (event, results, fecha) => {
  fechaMostrar = fecha;
  let fechaActual = document.getElementsByClassName("fechaActual");
  for (let index = 0; index < fechaActual.length; index++) {
    fechaActual[index].innerHTML = fechaPalabras(fechaMostrar);
  }
  console.log(results[0]);
  let ventas = results[0];
  // let totalContado = 0;
  let totalCredito = 0;
  // let totalDeposito = 0;
  let sumaTotalVentas = 0;
  ventas.forEach((element) => {
    if (element.salida_tipo_pago === "Contado") {
      totalContado += parseInt(element.total_venta);
    }
    if (element.salida_tipo_pago === "Credito") {
      totalCredito += parseInt(element.total_venta);
    }
    if (element.salida_tipo_pago === "Deposito") {
      totalDeposito += parseInt(element.total_venta);
    }
  });
  ventasContado.value = `L. ${totalContado.toFixed(2)}`;
  ventasCredito.value = `L. ${totalCredito.toFixed(2)}`;
  ventasDeposito.value = `L. ${totalDeposito.toFixed(2)}`;
  sumaTotalVentas = (totalContado + totalCredito + totalDeposito).toFixed(2);
  totalVentas.value = `L. ${sumaTotalVentas}`;
});

ipcRenderer.on("aportaciones_del_dia", (event, results) => {
  console.log(results[0]);
  let aportaciones = results[0];
  let recuperacionesContado = 0;
  let recuperacionesDeposito = 0;
  let recuperacionesTotal = 0;
  let sumaContado = 0;
  let sumaDeposito = 0;
  aportaciones.forEach((element) => {
    if (element.historial_cliente_tipo_aportacion === "Contado") {
      recuperacionesContado += parseInt(element.historial_cliente_aportacion);
    }
    if (element.historial_cliente_tipo_aportacion === "Deposito") {
      recuperacionesDeposito += parseInt(element.historial_cliente_aportacion);
    }
  });
  recuperacionesTotal = (
    (recuperacionesContado + recuperacionesDeposito) *
    -1
  ).toFixed(2);
  recuperacionContado.value = `L. ${(recuperacionesContado * -1).toFixed(2)}`;
  recuperacionDeposito.value = `L. ${(recuperacionesDeposito * -1).toFixed(2)}`;
  totalRecuperaciones.value = `L. ${recuperacionesTotal}`;
  sumaContado = totalContado + recuperacionesContado * -1;
  sumaDeposito = totalDeposito + recuperacionesDeposito * -1;
  sumaTotalContado.value = `L. ${sumaContado.toFixed(2)}`;
  sumaTotalDeposito.value = `L. ${sumaDeposito.toFixed(2)}`;
});

ipcRenderer.on("salidas_del_dia", (event, results) => {
  let salidas = results[0];
  console.log(results[0]);
  let plantillaCredito = "";
  let plantillaContado = "";
  let plantillaDeposito = "";
  let contarFilasCredito = 0;
  let contarFilasContado = 0;
  let contarFilasDeposito = 0;
  let totalCredito = 0;
  let totalContado = 0;
  let totalDeposito = 0;

  salidas.forEach((element, index, array) => {
    if (element.salida_tipo_pago === "Credito") {
      let total = parseInt(element.total);
      totalCredito += total;
      if (contarFilasCredito > 48) {
        plantillaCredito += `<div class="html2pdf__page-break"></div><br>`;
        contarFilasCredito = 0;
      }
      plantillaCredito += `
      <tr>
          <td style="width: 150px; max-width: 150px">${
            element.salida_cantidad
          }</td>
          <td style="width: 160px; max-width: 150px">${element.producto_id}</td>
          <td style="width: 400px; max-width: 400px">${
            element.producto_nombre
          }</td>
          <td style="width: 150px; max-width: 150px">L. ${parseInt(
            element.lote_valor_unitario_venta
          ).toFixed(2)}</th>
          <td style="width: 120px; max-width: 120px">L. ${total.toFixed(2)}</td>
        </tr>`;
      contarFilasCredito++;
    } else if (element.salida_tipo_pago === "Contado") {
      let total = parseInt(element.total);
      totalContado += total;
      if (contarFilasContado > 48) {
        plantillaContado += `<div class="html2pdf__page-break"></div><br>`;
        contarFilasContado = 0;
      }
      plantillaContado += `
      <tr>
          <td style="width: 150px; max-width: 150px">${
            element.salida_cantidad
          }</td>
          <td style="width: 160px; max-width: 150px">${element.producto_id}</td>
          <td style="width: 400px; max-width: 400px">${
            element.producto_nombre
          }</td>
          <td style="width: 150px; max-width: 150px">L. ${parseInt(
            element.lote_valor_unitario_venta
          ).toFixed(2)}</th>
          <td style="width: 120px; max-width: 120px">L. ${parseInt(
            element.total
          ).toFixed(2)}</td>
        </tr>`;
      contarFilasContado++;
    } else if (element.salida_tipo_pago === "Deposito") {
      let total = parseInt(element.total);
      totalDeposito += total;
      if (contarFilasDeposito > 48) {
        plantillaDeposito += `<div class="html2pdf__page-break"></div><br>`;
        contarFilasDeposito = 0;
      }
      plantillaDeposito += `
      <tr>
          <td style="width: 150px; max-width: 150px">${
            element.salida_cantidad
          }</td>
          <td style="width: 160px; max-width: 150px">${element.producto_id}</td>
          <td style="width: 400px; max-width: 400px">${
            element.producto_nombre
          }</td>
          <td style="width: 150px; max-width: 150px">L. ${parseInt(
            element.lote_valor_unitario_venta
          ).toFixed(2)}</th>
          <td style="width: 120px; max-width: 120px">L. ${parseInt(
            element.total
          ).toFixed(2)}</td>
        </tr>`;
      contarFilasDeposito++;
    }
  });
  plantillaCredito += `
  <tr>
      <td style="width: 150px; max-width: 150px"></td>
      <td style="width: 160px; max-width: 150px"></td>
      <td style="width: 400px; max-width: 400px"></td>
      <td style="width: 150px; max-width: 150px">TOTAL</th>
      <td style="width: 120px; max-width: 120px"> L. ${totalCredito.toFixed(
        2
      )}</td>
    </tr>`;
  plantillaContado += `
    <tr>
        <td style="width: 150px; max-width: 150px"></td>
        <td style="width: 160px; max-width: 150px"></td>
        <td style="width: 400px; max-width: 400px"></td>
        <td style="width: 150px; max-width: 150px">TOTAL</th>
        <td style="width: 120px; max-width: 120px"> L. ${totalContado.toFixed(
          2
        )}</td>
      </tr>`;
  plantillaDeposito += `
      <tr>
          <td style="width: 150px; max-width: 150px"></td>
          <td style="width: 160px; max-width: 150px"></td>
          <td style="width: 400px; max-width: 400px"></td>
          <td style="width: 150px; max-width: 150px">TOTAL</th>
          <td style="width: 120px; max-width: 120px"> L. ${totalDeposito.toFixed(
            2
          )}</td>
        </tr>`;
  cuerpoTablaCredito.innerHTML += plantillaCredito;
  cuerpoTablaContado.innerHTML += plantillaContado;
  cuerpoTablaDeposito.innerHTML += plantillaDeposito;
});
