const { ipcRenderer } = require("electron");

let fechaLiquidacion = document.getElementById("fechaLiquidacion");

document.addEventListener("DOMContentLoaded", function () {
  fechaLiquidacion.value = obtenerFecha("YYYY/MM/DD");
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
  let fechaHoy = fechaLiquidacion.value;
  await ipcRenderer.invoke("ventasDelDia", fechaHoy);
  await ipcRenderer.invoke("aportacionesDelDia", fechaHoy);
};

// const aportacionesDelDia = async () => {
//   let fechaHoy = fechaLiquidacion.value;
//   await ipcRenderer.invoke("aportacionesDelDia", fechaHoy);
// };
