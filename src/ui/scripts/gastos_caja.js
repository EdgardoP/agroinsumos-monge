// const { ipcRenderer } = require("electron");

let idDocumento = Math.random() * (9999 - 1) + 1;
let gasto_fecha = document.getElementById("gasto_fecha");
let detalleGasto = document.getElementById("detalleGasto");
let gastos_cantidad = document.getElementById("gastos_cantidad");
let bonificaciones = document.getElementById("bonificaciones");
let deducciones = document.getElementById("deducciones");
document.addEventListener("DOMContentLoaded", function () {});
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
          ${gasto_fecha.value}
        </td>
        <td style="min-width: 260px; max-width: 260px; width: 260px">
        ${detalleGasto.value}
        </td>
        <td style="min-width: 160px; max-width: 160px; width: 160px">
          ${gastos_cantidad.value}
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
  detalleGasto.value = "";
  gastos_cantidad.value = "";
  detalleGasto.focus();
  quitarColorError();
};

const modificarFila = () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  let index = event.target.parentNode.parentNode.parentNode.parentNode;
  let gasto_fechaP = index.children[0].innerHTML.trim();
  let gastosDetalleP = index.children[1].innerHTML.trim();
  let gastosCantidadP = index.children[2].innerHTML.trim();
  
  gasto_fecha.value = gasto_fechaP;
  detalleGasto.value = gastosDetalleP;
  gastos_cantidad.value = gastosCantidadP;
  index.remove();
  agregarColorFilas(filasElementos);
};

const validar = () => {
  if (
    gasto_fecha.value != "" &&
    detalleGasto.value != "" &&
    gastos_cantidad.value != "" 
  ) {
    agregarFilasProductos();
    limpiarTextos();
  } else {
    if (gasto_fecha.value == "") {
      gasto_fecha.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      gasto_fecha.parentNode.style.boxShadow = "none";
    }
    if (detalleGasto.value == "") {
      detalleGasto.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      detalleGasto.parentNode.style.boxShadow = "none";
    }
    if (gastos_cantidad.value == "") {
      gastos_cantidad.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      gastos_cantidad.parentNode.style.boxShadow = "none";
    }
  }
};

const quitarColorError = () => {
  gasto_fecha.parentNode.style.boxShadow = "none";
  detalleGasto.parentNode.style.boxShadow = "none";
  gastos_cantidad.parentNode.style.boxShadow = "none";
};

const nuevoProducto = async () => {
  let filasElementos = document.getElementsByClassName("filasElementos");
  if (filasElementos.length > 0) {
    for (let index = 0; index < filasElementos.length; index++) {
      let filasDatos = {};
      let filasLote = [];
      let gasto_fechaP = filasElementos[index].children[0].innerHTML.trim();
      let gastosDetalleP = filasElementos[index].children[1].innerHTML.trim();
      let gastosCantidadP = filasElementos[index].children[2].innerHTML.trim();

      filasDatos = {
        gastos_fecha: gasto_fechaP,
        gastos_detalle: gastosDetalleP,
        gastos_cantidad:gastosCantidadP,
        gastos_usuarios_fk: 1,
        gastos_codigo: idDocumento,
      };

      await ipcRenderer.invoke("insertar_nuevo_gasto", filasDatos);
    }
    location.reload()
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
