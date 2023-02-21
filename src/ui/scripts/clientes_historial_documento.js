const { ipcRenderer } = require("electron");
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

// const nuevaAportacion = async () => {
//   let saldoAnterior = parseInt(saldoActual.innerHTML);
//   console.log(saldoAnterior);
//   let saldoAporte = parseInt(cantidadAporte.value);
//   console.log(saldoAporte);

//   let saldoNuevo = saldoAnterior - saldoAporte;
//   obj = {
//     historial_proveedor_fk: idCliente,
//     historial_proveedor_fecha: fechaActual,
//     historial_proveedor_detalle: detallesAportacion.value,
//     historial_proveedor_saldo_anterior: saldoActual.innerHTML,
//     historial_proveedor_aportacion: cantidadAporte.value,
//     historial_proveedor_saldo_nuevo: saldoNuevo,
//     historial_proveedor_tipo_aportacion: formaPago.value,
//   };
//   console.log(obj);
//   // await ipcRenderer.invoke("modificarMultiplesLotes", obj);
// };

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
      <tr>
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
  });
};
var XLSX = require("xlsx");
function ExportExcel(type, fn, dl) {
  var elt = document.getElementById("exportable_table");
  var wb = XLSX.utils.table_to_book(elt, { sheet: "Libro 1" });
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(
        wb,
        fn ||
          `../Estado de Cuenta ${nombreCliente.innerHTML}.` + (type || "xlsx")
      );
}
