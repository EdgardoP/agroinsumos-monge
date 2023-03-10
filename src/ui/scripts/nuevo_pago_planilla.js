const { ipcRenderer } = require("electron");

let idDocumento = Math.random() * (9999 - 1) + 1;
let desdeLaFecha = document.getElementById("desdeLaFecha");
let hastaLaFecha = document.getElementById("hastaLaFecha");
let nombreEmpleado = document.getElementById("nombreEmpleado");
let sueldoBase = document.getElementById("sueldoBase");
let horasExtra = document.getElementById("horasExtra");
let bonificaciones = document.getElementById("bonificaciones");
let deducciones = document.getElementById("deducciones");
document.addEventListener("DOMContentLoaded", function () {});
//Funcion para obtener la fecha del sistema
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
  let fechaAnioMesDia = (fechaOrdenada = [
    fechaParse.getFullYear(),
    mes,
    dia,
  ].join("-"));
  return fechaAnioMesDia;
};

const agregarFilasProductos = async () => {
  let plantilla = "";
  plantilla += `
    <tr class = "filasElementos">
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${desdeLaFecha.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${hastaLaFecha.value}
        </td>
        <td style="min-width: 260px; max-width: 260px; width: 260px">
        ${nombreEmpleado.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${sueldoBase.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${horasExtra.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${bonificaciones.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${deducciones.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${
            parseInt(sueldoBase.value) +
            parseInt(bonificaciones.value) -
            parseInt(deducciones.value)
          }
        </td>
        <td style="min-width: 130px; max-width: 130px; width: 130px">
              <div>
                <button 
                  onclick="modificarFila();event.preventDefault()"
                  class="accionesBoton colorSecundario">
                  <img 
                  src="icons/edit-button.png" alt="" />
                </button>
                <button 
                  onclick="eliminarFila();event.preventDefault()"
                  class="btnEliminarFila accionesBoton colorRojo">
                  <img src="icons/cancel.png" alt="" />
                </button>
              </div>
        </td>
    </tr>`;
  tablaEntradas.innerHTML += plantilla;
  limpiarTextos();
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
};

const agregarColorFilas = (filas) => {
  for (let index = 0; index < filas.length; index++) {
    filas[index].classList.remove("filasColor");
  }

  for (let index = 0; index < filas.length; index++) {
    if (index % 2 == 0) {
      filas[index].classList.add("filasColor");
    }
  }
};

const limpiarTextos = () => {
  nombreEmpleado.value = "";
  sueldoBase.value = "";
  horasExtra.value = "";
  bonificaciones.value = "";
  deducciones.value = "";
  nombreEmpleado.focus();
  quitarColorError();
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  //   console.log(index);
  let desdeLaFechaP = index.children[0].innerHTML.trim();
  let hastaLaFechaP = index.children[1].innerHTML.trim();
  let nombreEmp = index.children[2].innerHTML.trim();
  let sueldoP = index.children[3].innerHTML.trim();
  let horasExtraP = index.children[4].innerHTML.trim();
  let bonificacionesP = index.children[5].innerHTML.trim();
  let deduccionesP = index.children[6].innerHTML.trim();
  desdeLaFecha.value = desdeLaFechaP;
  hastaLaFecha.value = hastaLaFechaP;
  nombreEmpleado.value = nombreEmp;
  sueldoBase.value = sueldoP;
  horasExtra.value = horasExtraP;
  bonificaciones.value = bonificacionesP;
  deducciones.value = deduccionesP;
  index.remove();
  agregarColorFilas(filasElementos);
};

const validar = () => {
  if (
    desdeLaFecha.value != "" &&
    hastaLaFecha.value != "" &&
    nombreEmpleado.value != "" &&
    sueldoBase.value != "" &&
    horasExtra.value != "" &&
    bonificaciones.value != "" &&
    deducciones.value != ""
  ) {
    agregarFilasProductos();
    limpiarTextos();
  } else {
    if (desdeLaFecha.value == "") {
      desdeLaFecha.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      desdeLaFecha.parentNode.style.boxShadow = "none";
    }
    if (hastaLaFecha.value == "") {
      hastaLaFecha.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      hastaLaFecha.parentNode.style.boxShadow = "none";
    }
    if (nombreEmpleado.value == "") {
      nombreEmpleado.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      nombreEmpleado.parentNode.style.boxShadow = "none";
    }
    if (sueldoBase.value == "") {
      sueldoBase.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      sueldoBase.parentNode.style.boxShadow = "none";
    }
    if (horasExtra.value == "") {
      horasExtra.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      horasExtra.parentNode.style.boxShadow = "none";
    }
    if (bonificaciones.value == "") {
      bonificaciones.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      bonificaciones.parentNode.style.boxShadow = "none";
    }
    if (deducciones.value == "") {
      deducciones.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      deducciones.parentNode.style.boxShadow = "none";
    }
  }
};

const quitarColorError = () => {
  desdeLaFecha.parentNode.style.boxShadow = "none";
  hastaLaFecha.parentNode.style.boxShadow = "none";
  nombreEmpleado.parentNode.style.boxShadow = "none";
  sueldoBase.parentNode.style.boxShadow = "none";
  horasExtra.parentNode.style.boxShadow = "none";
  bonificaciones.parentNode.style.boxShadow = "none";
  deducciones.parentNode.style.boxShadow = "none";
};

const nuevoProducto = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  if (filasElementos.length > 0) {
    for (let index = 0; index < filasElementos.length; index++) {
      let filasDatos = {};
      let filasLote = [];
      let desdeLaFechaP = filasElementos[index].children[0].innerHTML.trim();
      let hastaLaFechaP = filasElementos[index].children[1].innerHTML.trim();
      let nombreEmp = filasElementos[index].children[2].innerHTML.trim();
      let sueldoP = filasElementos[index].children[3].innerHTML.trim();
      let horasExtraP = filasElementos[index].children[4].innerHTML.trim();
      let bonificacionesP = filasElementos[index].children[5].innerHTML.trim();
      let deduccionesP = filasElementos[index].children[6].innerHTML.trim();

      filasDatos = {
        planilla_fecha_ini: desdeLaFechaP,
        planilla_fecha_fin: hastaLaFechaP,
        planilla_sueldo_base: sueldoP,
        planilla_horas_extras: horasExtraP,
        planilla_bonificaciones: bonificacionesP,
        planilla_deducciones: deduccionesP,
        planilla_usuario_fk: 1,
        planilla_nombre_empleado: nombreEmp,
        planilla_codigo: idDocumento,
      };
      await ipcRenderer.invoke("insertar_nueva_planilla", filasDatos);
    }
  } else {
    console.log("No has agregado nada aun");
    tablaEntradas.parentNode.parentNode.classList.add("tablaTransicion");
    tablaEntradas.parentNode.parentNode.style.backgroundColor = "#d0393996";
    setTimeout(() => {
      tablaEntradas.parentNode.parentNode.style.backgroundColor = "#fff";
    }, "1000");
  }
};

const eliminarFila = () => {
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  index.remove();
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
};

function soloLetras(obj) {
  obj.value = obj.value.replace(/[0-9]/g, "");
}

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
}
