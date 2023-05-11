const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoVentasContado = document.getElementById("cuerpoVentasContado");
let cuerpoVentasContadoLibraSaco = document.getElementById(
  "cuerpoVentasContadoLibraSaco"
);

let cuerpoVentasCredito = document.getElementById("cuerpoVentasCredito");
let cuerpoVentasCreditoLibraSaco = document.getElementById(
  "cuerpoVentasCreditoLibraSaco"
);
let cuerpoResumenMes = document.getElementById("cuerpoResumenMes");

btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `REPORTE VENTAS_MENSUALES`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "portrait" },
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

const homeDir = require("os").homedir();
const desktopDir = `${homeDir}/Desktop/`;
console.log(desktopDir);

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var ws = XLSX.utils.table_to_sheet(elt);
  var elt2 = document.getElementById("exportable_table2");
  var ws2 = XLSX.utils.table_to_sheet(elt2);
  var elt3 = document.getElementById("exportable_table3");
  var ws3 = XLSX.utils.table_to_sheet(elt3);
  var elt4 = document.getElementById("exportable_table4");
  var ws4 = XLSX.utils.table_to_sheet(elt4);
  var elt5 = document.getElementById("exportable_table5");
  var ws5 = XLSX.utils.table_to_sheet(elt5);
  var wb = XLSX.utils.book_new();
  window.location.href = "#modal_excel";
  XLSX.utils.book_append_sheet(wb, ws, "Ventas al Contado");
  XLSX.utils.book_append_sheet(wb, ws2, "Ventas al Contado Libra Saco");
  XLSX.utils.book_append_sheet(wb, ws3, "Ventas al Credito");
  XLSX.utils.book_append_sheet(wb, ws4, "Ventas al Credito Libra Saco");
  XLSX.utils.book_append_sheet(wb, ws5, "Resumen del Mes");

  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn || `${desktopDir}VENTAS-MENSUALES-${tituloLibro}.` + (type || "xlsx")
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

let mesActual;
let anioActual;
let totalGeneralVentasContado = 0;
let totalVentasContadoNormal = 0;
let totalVentasContadoLibraSaco = 0;
let totalGeneralComprasContado = 0;
let totalComprasContadoNormal = 0;
let totalComprasContadoLibraSaco = 0;
let totalProductosContadoNormal = 0;
let totalProductosContadoLibraSaco = 0;
let totalGeneralUtilidadContado = 0;
let totalUtilidadContadoNormal = 0;
let totalUtilidadContadoLibraSaco = 0;
let totalGastos = 0;
let tituloLibro;

// ipcRenderer.on("gastosDelMes", (event, results, anio, mes) => {
//   totalGastos =  results[0][0].total_gastos
//   console.log(totalGastos);
// })

ipcRenderer.on("ventas_mensuales_contado", (event, results, anio, mes) => {
  let ventas = results[0];
  mesActual = mes;
  anioActual = anio;
  let fechaActual = document.getElementsByClassName("fechaActual");
  let mesAct = document.getElementById("mesActual");
  for (let index = 0; index < fechaActual.length; index++) {
    fechaActual[index].innerHTML = `${fechaPalabras(mesActual)} ${anioActual}`;
    mesAct.innerHTML = `RESUMEN DEL MES DE ${fechaPalabras(
      mesActual
    )} ${anioActual}`;
  }
  tituloLibro = `${fechaPalabras(mesActual)} ${anioActual}`;
  let plantillaVentasContado = "";
  let plantillaVentasContadoLibraSaco = "";
  ventas.forEach((element) => {
    let venta = element.total_ventas;
    let compra = element.costo_total_compras;
    let cantidadProductos = element.cantidad_producto;
    let utilidad = element.utilidad_bruta;
    totalGeneralVentasContado += venta;
    totalGeneralComprasContado += compra;
    totalGeneralUtilidadContado += utilidad;
    if (
      element.lote_presentacion == "Libra" ||
      element.lote_presentacion == "Saco"
    ) {
      totalVentasContadoLibraSaco += venta;
      totalComprasContadoLibraSaco += compra;
      totalProductosContadoLibraSaco += cantidadProductos;
      totalUtilidadContadoLibraSaco += utilidad;

      plantillaVentasContadoLibraSaco += `
      <tr>
      <td style="width: 200px; max-width: 200px">${element.producto_nombre} ${
        element.lote_presentacion
      }</td>
      <td style="width: 160px; max-width: 150px">${parseFloat(
        element.cantidad_producto
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        element.total_ventas
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        element.lote_valor_unitario_venta
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        element.costo_total_compras
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        element.utilidad_bruta
      ).toFixed(2)}</td>
    </tr>
      `;
    } else {
      totalVentasContadoNormal += venta;
      totalComprasContadoNormal += compra;
      totalProductosContadoNormal += cantidadProductos;
      totalUtilidadContadoNormal += utilidad;
      plantillaVentasContado += `
        <tr>
          <td style="width: 200px; max-width: 200px">${
            element.producto_nombre
          } ${element.lote_presentacion}</td>
          <td style="width: 160px; max-width: 150px">${parseInt(
            element.cantidad_producto
          )}</td>
          <td style="width: 20px; max-width: 200px">L. ${parseFloat(
            element.total_ventas
          ).toFixed(2)}</td>
          <td style="width: 150px; max-width: 150px">L. ${parseFloat(
            element.lote_valor_unitario_venta
          ).toFixed(2)}</td>
          <td style="width: 150px; max-width: 150px">L. ${parseFloat(
            element.costo_total_compras
          ).toFixed(2)}</td>
          <td style="width: 120px; max-width: 120px">L. ${parseFloat(
            element.utilidad_bruta
          ).toFixed(2)}</td>
        </tr>
        `;
    }
  });
  plantillaVentasContado += `
  <tr>
      <td style="width: 200px; max-width: 200px"></td>
      <td style="width: 160px; max-width: 150px">${parseInt(
        totalProductosContadoNormal
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        totalVentasContadoNormal
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px"></td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        totalComprasContadoNormal
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        totalUtilidadContadoNormal
      ).toFixed(2)}</td>
  </tr>
  `;

  plantillaVentasContadoLibraSaco += `
  <tr>
      <td style="width: 200px; max-width: 200px"></td>
      <td style="width: 160px; max-width: 150px">${parseInt(
        totalProductosContadoLibraSaco
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        totalVentasContadoLibraSaco
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px"></td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        totalComprasContadoLibraSaco
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        totalUtilidadContadoLibraSaco
      ).toFixed(2)}</td>
  </tr>
  `;
  cuerpoVentasContado.innerHTML += plantillaVentasContado;
  cuerpoVentasContadoLibraSaco.innerHTML += plantillaVentasContadoLibraSaco;
});

let totalGeneralVentasCredito = 0;
let totalVentasCreditoNormal = 0;
let totalVentasCreditoLibraSaco = 0;
let totalGeneralComprasCredito = 0;
let totalComprasCreditoNormal = 0;
let totalComprasCreditoLibraSaco = 0;
let totalProductosCreditoNormal = 0;
let totalProductosCreditoLibraSaco = 0;
let totalGeneralUtilidadCredito = 0;
let totalUtilidadCreditoNormal = 0;
let totalUtilidadCreditoLibraSaco = 0;
let utilidadTotal;
ipcRenderer.on("ventas_mensuales_credito", (event, results, anio, mes) => {
  let ventas = results[0];
  console.log(results);
  let plantillaVentasCredito = "";
  let plantillaVentasCreditoLibraSaco = "";
  ventas.forEach((element) => {
    let venta = element.total_ventas;
    let compra = element.costo_total_compras;
    let cantidadProductos = parseInt(element.cantidad_producto);
    let utilidad = element.utilidad_bruta;
    totalGeneralVentasCredito += venta;
    totalGeneralComprasCredito += compra;
    totalGeneralUtilidadCredito += utilidad;
    if (
      element.lote_presentacion == "Libra" ||
      element.lote_presentacion == "Saco"
    ) {
      totalVentasCreditoLibraSaco += venta;
      totalComprasCreditoLibraSaco += compra;
      totalProductosCreditoLibraSaco += parseInt(cantidadProductos);
      totalUtilidadCreditoLibraSaco += utilidad;
      plantillaVentasCreditoLibraSaco += `
      <tr>
      <td style="width: 200px; max-width: 200px">${element.producto_nombre} ${
        element.lote_presentacion
      }</td>
      <td style="width: 160px; max-width: 150px">${parseInt(
        element.cantidad_producto
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        element.total_ventas
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        element.lote_valor_unitario_venta
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        element.costo_total_compras
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        element.utilidad_bruta
      ).toFixed(2)}</td>
    </tr>
      `;
    } else {
      totalVentasCreditoNormal += venta;
      totalComprasCreditoNormal += compra;
      totalProductosCreditoNormal += cantidadProductos;
      totalUtilidadCreditoNormal += utilidad;
      plantillaVentasCredito += `
        <tr>
          <td style="width: 200px; max-width: 200px">${
            element.producto_nombre
          } ${element.lote_presentacion}</td>
          <td style="width: 160px; max-width: 150px">${parseInt(
            element.cantidad_producto
          )}</td>
          <td style="width: 20px; max-width: 200px">L. ${parseFloat(
            element.total_ventas
          ).toFixed(2)}</td>
          <td style="width: 150px; max-width: 150px">L. ${parseFloat(
            element.lote_valor_unitario_venta
          ).toFixed(2)}</td>
          <td style="width: 150px; max-width: 150px">L. ${parseFloat(
            element.costo_total_compras
          ).toFixed(2)}</td>
          <td style="width: 120px; max-width: 120px">L. ${parseFloat(
            element.utilidad_bruta
          ).toFixed(2)}</td>
        </tr>
        `;
    }
  });
  plantillaVentasCredito += `
  <tr>
      <td style="width: 200px; max-width: 200px"></td>
      <td style="width: 160px; max-width: 150px">${parseInt(
        totalProductosCreditoNormal
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        totalVentasCreditoNormal
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px"></td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        totalComprasCreditoNormal
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        totalUtilidadCreditoNormal
      ).toFixed(2)}</td>
  </tr>
  `;

  plantillaVentasCreditoLibraSaco += `
  <tr>
      <td style="width: 200px; max-width: 200px"></td>
      <td style="width: 160px; max-width: 150px">${parseInt(
        totalProductosCreditoLibraSaco
      )}</td>
      <td style="width: 20px; max-width: 200px">L. ${parseFloat(
        totalVentasCreditoLibraSaco
      ).toFixed(2)}</td>
      <td style="width: 150px; max-width: 150px"></td>
      <td style="width: 150px; max-width: 150px">L. ${parseFloat(
        totalComprasCreditoLibraSaco
      ).toFixed(2)}</td>
      <td style="width: 120px; max-width: 120px">L. ${parseFloat(
        totalUtilidadCreditoLibraSaco
      ).toFixed(2)}</td>
  </tr>
  `;
  cuerpoVentasCredito.innerHTML += plantillaVentasCredito;
  cuerpoVentasCreditoLibraSaco.innerHTML += plantillaVentasCreditoLibraSaco;
  let totalIngresosDelMes = parseFloat(
    totalGeneralVentasContado + totalGeneralVentasCredito
  ).toFixed(2);
  let totalMercaderiaCosto = parseFloat(
    totalGeneralComprasContado + totalGeneralComprasCredito
  ).toFixed(2);
  utilidadTotal = parseFloat(
    totalIngresosDelMes - totalMercaderiaCosto
  ).toFixed(2);
  let plantillaCuerpoResumen = "";
  plantillaCuerpoResumen += `
        <tr>
          <td style="width: 50%;">TOTAL DE VENTAS AL CONTADO</td>
          <td>L. ${parseFloat(totalGeneralVentasContado).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="width: 50%;">TOTAL DE VENTAS AL CREDITO</td>
          <td>L. ${parseFloat(totalGeneralVentasCredito).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="width: 50%;">TOTAL DE INGRESOS DEL MES</td>
          <td>L. ${parseFloat(totalIngresosDelMes).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="width: 50%;">TOTAL DE MERCADERIA AL COSTO</td>
          <td>L. ${parseFloat(totalMercaderiaCosto).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="width: 50%;">UTILIDAD</td>
          <td>L. ${parseFloat(utilidadTotal).toFixed(2)}</td>
        </tr>
        
  `;
  cuerpoResumenMes.innerHTML += plantillaCuerpoResumen;
});

let totalUtilidadNetaMes;
ipcRenderer.on("salariosDelMes", (event, results, anio, mes) => {
  let salarios = results[0];
  let totalSalarios;
  salarios.forEach((element) => {
    totalSalarios = parseFloat(element.total_salarios).toFixed(2);
    console.log(totalSalarios);
    if (isNaN(totalSalarios) === true) {
      totalSalarios = 0;
    }
  });
  totalUtilidadNetaMes = parseFloat(utilidadTotal - totalSalarios).toFixed(2);
  let plantilla = `
  <tr>
    <td style="width: 50%;">SUELDOS Y SALARIOS</td>
    <td>L. ${parseFloat(totalSalarios).toFixed(2)}</td>
  </tr>
  `;
  cuerpoResumenMes.innerHTML += plantilla;
  // console.log(totalSalarios);
});

// ipcRenderer.on("gastosDelMes", (event, results, anio, mes) => {
//   totalGastos =  results[0][0].total_gastos
//   console.log(totalGastos);
// })

ipcRenderer.on("gastosDelMes", (event, results, anio, mes) => {
  // let salarios = results[0];
  console.log(results);
  totalGastos = parseFloat(results[0][0].total_gastos).toFixed(2);
  console.log(results[0][0].total_gastos);
  if (isNaN(totalGastos) === true) {
    totalGastos = 0;
    console.log("No es numero");
  }
  console.log(totalGastos);
  // let totalSalarios;
  // salarios.forEach((element) => {
  //   totalSalarios = parseFloat(element.total_salarios).toFixed(2);
  // });
  totalUtilidadNetaMes -= totalGastos;
  let plantilla = `
  <tr>
    <td style="width: 50%;">GASTOS DE CAJA</td>
    <td>L. ${parseFloat(totalGastos).toFixed(2)}</td>
  </tr>
  <tr>
    <td style="width: 50%;">PERDIDAS</td>
    <td></td>
  </tr>
  <tr>
    <td style="width: 50%;">UTILIDAD NETA DEL MES</td>
    <td>L. ${parseFloat(totalUtilidadNetaMes).toFixed(2)}</td>
  </tr>
  `;
  cuerpoResumenMes.innerHTML += plantilla;
  // console.log(totalSalarios);
});
