const { ipcRenderer } = require("electron");

let btnImprimir = document.getElementById("btnImprimir");
let cuerpoListadoProductos = document.getElementById("cuerpoListadoProductos");

btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `REPORTE_INVENTARIO_${obtenerFecha("")}`,
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

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn || `../INVENTARIO-FECHA-${obtenerFecha("")}.` + (type || "xlsx")
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

let mes;
let anio;
ipcRenderer.on("listado_de_productos", (event, results) => {
  let productos;
  let plantilla = "";
  productos = results[0];
  console.log(results);
  let totalInversion = 0;
  let totalCantidad = 0;
  productos.forEach((element) => {
    let valorCompra = parseInt(element.lote_valor_unitario_compra);
    let cantidad = parseInt(element.lote_cantidad);
    let valorVenta = parseInt(element.lote_valor_unitario_venta);
    let inversion = valorCompra * cantidad;
    totalCantidad += cantidad;
    totalInversion += inversion;
    plantilla += `
        <tr>
            <td style="width: 200px; max-width: 200px">${
              element.producto_nombre
            }</td>
            <td style="width: 100px; max-width: 100px">${
              element.lote_presentacion
            }</td>
            <td style="width: 70px; max-width: 70px">${cantidad}</td>
            <td style="width: 140px; max-width: 140px">L. 
            ${valorCompra.toFixed(2)}
            </td>
            <td style="width: 140px; max-width: 140px">L. ${valorVenta.toFixed(
              2
            )}</td>
            <td style="width: 100px; max-width: 100px">L. ${inversion.toFixed(
              2
            )}</td>
        </tr>
    `;
  });
  plantilla += `
        <tr>
            <td style="width: 200px; max-width: 200px"></td>
            <td style="width: 100px; max-width: 100px">TOTAL CANTIDADES</td>
            <td style="width: 70px; max-width: 70px">${totalCantidad}</td>
            <td style="width: 140px; max-width: 140px"></td>
            <td style="width: 140px; max-width: 140px">TOTAL INVERSION</td>
            <td style="width: 100px; max-width: 100px">L. ${totalInversion.toFixed(
              2
            )}</td>
        </tr>
  `;
  cuerpoListadoProductos.innerHTML += plantilla;
});
