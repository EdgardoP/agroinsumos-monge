const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoTablaRecuperaciones = document.getElementById(
  "cuerpoTablaRecuperaciones"
);
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
    filename: `RECUPERACIONES_${fechaPalabras(fechaMostrar)}`,
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

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("tablaFinanzas");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn ||
          `../RECUPERACIONES_FECHA_${fechaPalabras(fechaMostrar)}.` +
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

//class html2pdf__page-break

let totalContado = 0;
let totalDeposito = 0;
let fechaMostrar;
ipcRenderer.on("recuperaciones_clientes", (event, results, fecha) => {
  let fechaActual = document.getElementsByClassName("fechaActual");
  fechaMostrar = fecha;
  for (let index = 0; index < fechaActual.length; index++) {
    fechaActual[index].innerHTML = fechaPalabras(fechaMostrar);
  }
  console.log(results[0]);
  let ventas = results[0];
  let plantilla = "";
  ventas.forEach((element) => {
    let nombreCompleto = `${element.cliente_nombre}  ${element.cliente_apellido} `;
    let descripcion = `${element.historial_cliente_detalle}`;
    let aportacion = `${parseInt(element.historial_cliente_aportacion)}`;
    if (aportacion < 0) {
      aportacion *= -1;
    }
    let tipoAportacion = `${element.historial_cliente_tipo_aportacion}`;
    if (tipoAportacion === "Deposito") {
      totalDeposito += aportacion;
      plantilla += `
        <tr>
          <td style="width: 150px; max-width: 150px">Nº FACTURA</td>
          <td style="width: 300px; max-width: 300px">${nombreCompleto.toUpperCase()}</td>
          <td style="width: 400px; max-width: 400px">${descripcion.toUpperCase()}</td>
          <td style="width: 120px; max-width: 120px"></td>
          <td style="width: 120px; max-width: 120px">L. ${aportacion.toFixed(
            2
          )}</td>
          <td style="width: 120px; max-width: 120px"></td>
          <td style="width: 120px; max-width: 120px"></td>
        </tr>
        `;
    } else if (tipoAportacion === "Contado") {
      totalContado += aportacion;
      plantilla += `
        <tr>
          <td style="width: 150px; max-width: 150px">Nº FACTURA</td>
          <td style="width: 300px; max-width: 300px">${nombreCompleto.toUpperCase()}</td>
          <td style="width: 400px; max-width: 400px">${descripcion.toUpperCase()}</td>
          <td style="width: 120px; max-width: 120px"></td>
          <td style="width: 120px; max-width: 120px"></td>
          <td style="width: 120px; max-width: 120px">L. ${aportacion.toFixed(
            2
          )}</td>
          <td style="width: 120px; max-width: 120px"></td>
        </tr>
        `;
    }
    // }
    // plantilla += `
    // <tr>
    //   <td style="width: 150px; max-width: 150px">Nº FACTURA</td>
    //   <td style="width: 300px; max-width: 300px">${nombreCompleto.toUpperCase()}</td>
    //   <td style="width: 400px; max-width: 400px">${descripcion.toUpperCase()}</td>
    //   <td style="width: 120px; max-width: 120px"></td>
    //   <td style="width: 120px; max-width: 120px">DEPOSITOS</td>
    //   <td style="width: 120px; max-width: 120px">EFECTIVO</td>
    //   <td style="width: 120px; max-width: 120px">TOTAL</td>
    // </tr>
    // `;
    // if (element.salida_tipo_pago === "Contado") {
    //   totalContado += parseInt(element.total_venta);
    // }
    // if (element.salida_tipo_pago === "Credito") {
    //   totalCredito += parseInt(element.total_venta);
    // }
    // if (element.salida_tipo_pago === "Deposito") {
    //   totalDeposito += parseInt(element.total_venta);
    // }
  });
  let montoTotal = totalDeposito + totalContado;
  plantilla += `
  <tr>
    <td style="width: 150px; max-width: 150px; border: 0px"></td>
    <td style="width: 300px; max-width: 300px; border: 0px"></td>
    <td style="width: 400px; max-width: 400px; border: 0px">MONTO TOTAL</td>
    <td style="width: 120px; max-width: 120px; border: 0px"></td>
    <td style="width: 120px; max-width: 120px;">L. ${totalDeposito.toFixed(
      2
    )}</td>
    <td style="width: 120px; max-width: 120px">L. ${totalContado.toFixed(
      2
    )}</td>
    <td style="width: 120px; max-width: 120px">L. ${montoTotal.toFixed(2)}</td>
  </tr>
  `;
  cuerpoTablaRecuperaciones.innerHTML = plantilla;
  console.log(totalDeposito);
  console.log(totalContado);
});
