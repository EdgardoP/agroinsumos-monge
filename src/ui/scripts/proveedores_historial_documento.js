// const { ipcRenderer } = require("electron");
// const { TableToExcel } = require("table2excel");

let idProveedor;
let tablaEntradas = document.getElementById("tablaEntradas");
let detallesAportacion = document.getElementById("detalles_aportacion");
let cantidadAporte = document.getElementById("cantidad_aportacion");
let saldoActual = document.getElementById("saldoActual");
let ultimaActualizacion = document.getElementById("ultimaActualizacion");
let formaPago = document.getElementById("forma_pago");
let nombreProveedor = document.getElementById("nombreProveedor");
let numeroProveedor = document.getElementById("numeroProveedor");
let fechaActual;
let fechaInicial = document.getElementById("fechaInicial");
let fechaFinal = document.getElementById("fechaFinal");

document.addEventListener("DOMContentLoaded", function () {
  fechaActual = obtenerFecha("YYYY/MM/DD");
  console.log(fechaActual);
  renderizar();
});

let btnImprimir = document.getElementById("btnImprimir");
btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `Estado de Cuenta Proveedor ${nombreP}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4, scrollY: 0 },
    jsPDF: { format: "a3", unit: "in", orientation: "landscape" },
  };
  let exportable_table = document.getElementById("exportable_table");
  html2pdf().set(opt).from(exportable_table).save();
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

const limpiar = () => {
  detallesAportacion.value = "";
  formaPago.value = "-1";
  cantidadAporte.value = "";
  quitarColorError();
};

const quitarColorError = () => {
  detallesAportacion.parentNode.style.boxShadow = "none";
  formaPago.parentNode.style.boxShadow = "none";
  cantidadAporte.parentNode.style.boxShadow = "none";
};

const validar = () => {
  if (
    detallesAportacion.value != "" &&
    formaPago.value != "-1" &&
    cantidadAporte.value != ""
  ) {
    nuevaAportacion();
    limpiar();
    location.href = "#";
  } else {
    if (detallesAportacion.value == "") {
      detallesAportacion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      detallesAportacion.parentNode.style.boxShadow = "none";
    }
    if (formaPago.value == "-1") {
      formaPago.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      formaPago.parentNode.style.boxShadow = "none";
    }
    if (cantidadAporte.value == "") {
      cantidadAporte.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      cantidadAporte.parentNode.style.boxShadow = "none";
    }
  }
};

const nuevaAportacion = async () => {
  let saldoAnterior = parseInt(saldoActual.innerHTML);
  console.log(saldoAnterior);
  let saldoAporte = parseInt(cantidadAporte.value);
  console.log(saldoAporte);

  let saldoNuevo = saldoAnterior - saldoAporte;
  obj = {
    historial_proveedor_fk: idProveedor,
    historial_proveedor_fecha: fechaActual,
    historial_proveedor_detalle: detallesAportacion.value,
    historial_proveedor_saldo_anterior: saldoActual.innerHTML,
    historial_proveedor_aportacion: cantidadAporte.value,
    historial_proveedor_saldo_nuevo: saldoNuevo,
    historial_proveedor_tipo_aportacion: formaPago.value,
  };
  console.log(obj);
  await ipcRenderer.invoke("insertarAportacionProveedor", obj);
  let fechaInicial = "1999-01-01";
  let fechaFinal = "2050-01-01";
  await ipcRenderer.invoke(
    "historial_proveedor",
    idProveedor,
    fechaInicial,
    fechaFinal
  );
  window.location = "proveedores_historial_documento.ejs";
};

function soloLetras(obj) {
  obj.value = obj.value.replace(/[0-9]/g, "");
}

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
}

const visualizarDocumento = async () => {
  let fechaUno = fechaInicial.value;
  let fechaDos = fechaFinal.value;
  await ipcRenderer.invoke(
    "historial_proveedor",
    idProveedor,
    fechaUno,
    fechaDos
  );
  window.location = "proveedores_historial_documento.ejs";
};

let nombreP;
const renderizar = () => {
  ipcRenderer.on("historial_cuentas", (event, results, id) => {
    let datos = results[0];
    let plantilla = "";
    idProveedor = id;
    datos.forEach((element, index, array) => {
      nombreP = element.proveedor_nombre;
      ultimaActualizacion.innerHTML = `<strong>Ultima Actualizacion: </strong>${convertirFecha(
        element.historial_proveedor_fecha
      )}`;
      nombreProveedor.innerHTML = `${element.proveedor_nombre}`;
      numeroProveedor.innerHTML = `${element.proveedor_numero}`;
      saldoActual.innerHTML = `${formatDinero(
        element.historial_proveedor_saldo_nuevo
      )}`;
      plantilla += `
        <tr class = "filasElementos">
            <td style="max-width: 5vh; min-width: 5vh; width: 5vh">${index}</td>
            <td style="max-width: 10vh; min-width: 10vh; width: 10vh">
              ${convertirFecha(element.historial_proveedor_fecha)}
            </td>
            <td style="max-width: 35vh; min-width: 35vh; width: 35vh">
              ${element.historial_proveedor_detalle}
            </td>
            <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
             L. ${formatDinero(element.historial_proveedor_saldo_anterior)}
            </td>
            <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
             L. ${formatDinero(element.historial_proveedor_aportacion)}
            </td>
            <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
             L. ${formatDinero(element.historial_proveedor_saldo_nuevo)}
            </td>
            <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
              ${element.historial_proveedor_tipo_aportacion}
            </td>
          </tr>`;
    });
    tablaEntradas.innerHTML += plantilla;
    let filasElementos = document.getElementsByClassName("filasElementos");
    agregarColorFilas(filasElementos);
  });
};

const agregarColorFilas = (filas, fila, cantidad) => {
  console.log(cantidad);
  for (let index = 0; index < filas.length; index++) {
    if (index % 2 == 0) {
      filas[index].classList.add("filasColor");
    }
  }

  if (cantidad <= 0) {
    fila.children[6].classList.add("filasColorAgotado");
  }

  if (cantidad <= 10 && cantidad > 0) {
    fila.children[6].classList.add("filasColorPocasExistencias");
  }
};

const homeDir = require("os").homedir();
const desktopDir = `${homeDir}/Desktop/`;
console.log(desktopDir);

var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  window.location.href = "#modal_excel";
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn ||
          `${desktopDir}Estado de Cuenta Proveedor ${nombreP}.` +
            (type || "xlsx")
      );
}
