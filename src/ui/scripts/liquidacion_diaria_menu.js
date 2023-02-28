const { ipcRenderer } = require("electron");

let fechaLiquidacion = document.getElementById("fechaLiquidacion");
let fechaRecuperacion = document.getElementById("fechaRecuperacion");
let mesVentas = document.getElementById("mesVentas");

document.addEventListener("DOMContentLoaded", function () {
  fechaLiquidacion.value = obtenerFecha("YYYY/MM/DD");
  fechaRecuperacion.value = obtenerFecha("YYYY/MM/DD");
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

const ventasDelDia = async () => {
  let fecha = fechaLiquidacion.value;
  await ipcRenderer.invoke("ventasDelDia", fecha);
  await ipcRenderer.invoke("aportacionesDelDia", fecha);
  await ipcRenderer.invoke("salidasDelDia", fecha);
};

const recuperacionesClientesDia = async () => {
  let fecha = fechaRecuperacion.value;
  await ipcRenderer.invoke("recuperacionesClientesDia", fecha);
};

const ventasMensuales = async () => {
  let valor = mesVentas.value;
  let split = valor.split("-");
  let anio = split[0];
  let mes = split[1];
  console.log(anio);
  console.log(mes);
  await ipcRenderer.invoke("ventasMensualesCreditoContado", anio, mes);
};

// const aportacionesDelDia = async () => {
//   let fechaHoy = fechaLiquidacion.value;
//   await ipcRenderer.invoke("aportacionesDelDia", fechaHoy);
// };
