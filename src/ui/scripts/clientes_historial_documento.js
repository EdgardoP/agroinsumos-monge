// const { ipcRenderer } = require("electron");
// const { TableToExcel } = require("table2excel");

let idCliente;
let tablaEntradas = document.getElementById("tablaEntradas");
let detallesAportacion = document.getElementById("detalles_aportacion");
let cantidadAporte = document.getElementById("cantidad_aportacion");
let saldoActual = document.getElementById("saldoActual");
let ultimaActualizacion = document.getElementById("ultimaActualizacion");
let formaPago = document.getElementById("forma_pago");
let nombreCliente = document.getElementById("nombreCliente");
let referenciaCliente = document.getElementById("referenciaCliente");
let fechaInicial = document.getElementById("fechaInicial");
let fechaFinal = document.getElementById("fechaFinal");
let fechaActual;

document.addEventListener("DOMContentLoaded", function () {
  fechaActual = obtenerFecha("YYYY/MM/DD");
  console.log(fechaActual);
  renderizar();
});

let btnImprimir = document.getElementById("btnImprimir");
btnImprimir.addEventListener("click", () => {
  let opt = {
    margin: 1,
    filename: `Estado de Cuenta ${nombreCliente.innerHTML}`,
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

const nuevaAportacion = async () => {
  let saldoAnterior = parseInt(saldoActual.innerHTML);
  console.log(saldoAnterior);
  let saldoAporte = parseInt(cantidadAporte.value);
  console.log(saldoAporte);

  let saldoNuevo = saldoAnterior - saldoAporte;
  obj = {
    historial_cliente_fk: idCliente,
    historial_cliente_fecha: fechaActual,
    historial_cliente_detalle: detallesAportacion.value,
    historial_cliente_saldo_anterior: saldoActual.innerHTML,
    historial_cliente_aportacion: parseInt(cantidadAporte.value) * -1,
    historial_cliente_saldo_nuevo: saldoNuevo,
    historial_cliente_tipo_aportacion: formaPago.value,
  };
  console.log(obj);
  await ipcRenderer.invoke("insertarAportacionCliente", obj);
  let fechaInicial = "1999-01-01";
  let fechaFinal = "2050-01-01";
  await ipcRenderer.invoke(
    "historial_clientes",
    idCliente,
    fechaInicial,
    fechaFinal
  );
  window.location = "clientes_historial_documento.ejs";
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
  await ipcRenderer.invoke("historial_clientes", idCliente, fechaUno, fechaDos);
  window.location = "clientes_historial_documento.ejs";
};

const renderizar = () => {
  ipcRenderer.on("historial_cuentas_clientes", (event, results, id) => {
    // console.log(id);
    console.log(results);
    let datos = results[0];
    let plantilla = "";
    idCliente = id;
    datos.forEach((element, index, array) => {
      ultimaActualizacion.innerHTML = `<strong>Ultima Actualizacion: </strong>${convertirFecha(
        element.historial_cliente_fecha
      )}`;
      nombreCliente.innerHTML = `${element.cliente_nombre} ${element.cliente_apellido}`;
      referenciaCliente.innerHTML = `${element.cliente_referencia}`;
      saldoActual.innerHTML = `${formatDinero(
        element.historial_cliente_saldo_nuevo
      )}`;
      plantilla += `
      <tr class = "filasElementos">
          <td style="max-width: 5vh; min-width: 5vh; width: 5vh">${index}</td>
          <td style="max-width: 10vh; min-width: 10vh; width: 10vh">
            ${convertirFecha(element.historial_cliente_fecha)}
          </td>
          <td style="max-width: 35vh; min-width: 35vh; width: 35vh">
            ${element.historial_cliente_detalle}
          </td>
          <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
           L. ${formatDinero(element.historial_cliente_saldo_anterior)}
          </td>
          <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
           L. ${formatDinero(element.historial_cliente_aportacion)}
          </td>
          <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
           L. ${formatDinero(element.historial_cliente_saldo_nuevo)}
          </td>
          <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
            ${element.historial_cliente_tipo_aportacion}
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
          `${desktopDir}Estado de Cuenta ${nombreCliente.innerHTML}.` +
            (type || "xlsx")
      );
}
