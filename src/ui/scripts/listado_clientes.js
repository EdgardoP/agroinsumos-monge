// const { ipcRenderer } = require("electron");

let buscarCliente = document.getElementById("buscarCliente");
let tablaEntradas = document.getElementById("tablaEntradas");
let clienteNombre = document.getElementById("cliente_nombre");
let clienteApellido = document.getElementById("cliente_apellido");
let clienteReferencia = document.getElementById("cliente_referencia");
let clienteNombreModificar = document.getElementById(
  "cliente_nombre_modificar"
);
let clienteApellidoModificar = document.getElementById(
  "cliente_apellido_modificar"
);
let clienteReferenciaModificar = document.getElementById(
  "cliente_referencia_modificar"
);
document.addEventListener("DOMContentLoaded", function () {
  cargarDocumentos();
  obtenerClientes();
});

const cargarDocumentos = async () => {
  await ipcRenderer.invoke("documentosHistorialClientes");
};

function formatDinero(numero) {
  return numero.toLocaleString();
}

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

const visualizarDocumento = async (id) => {
  let fechaInicial = "1999-01-01";
  let fechaFinal = "2050-01-01";
  await ipcRenderer.invoke("historial_clientes", id, fechaInicial, fechaFinal);
  window.location = "clientes_historial_documento.ejs";
};

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

const buscarListaCliente = () => {
  let valor = buscarCliente.value;
  let filasTabla = document.getElementsByClassName("filas");
  // console.log(filasTabla);
  for (let index = 0; index < filasTabla.length; index++) {
    let claseFilas = filasTabla[index].className;
    let valorEnFila = claseFilas.split(" ");
    let regex = new RegExp(valor, "i");
    let busqueda = valorEnFila.filter((element) => regex.test(element));
    if (busqueda.length > 0) {
      filasTabla[index].style.display = "initial";
    } else {
      filasTabla[index].style.display = "none";
    }
    console.log(busqueda);
  }
};

function soloLetras(obj) {
  obj.value = obj.value.replace(/[0-9]/g, "");
}

function soloNumeros(obj) {
  obj.value = obj.value.replace(/[^0-9.]/g, "");
}

const quitarColorError = () => {
  clienteNombre.parentNode.style.boxShadow = "none";
  clienteApellido.parentNode.style.boxShadow = "none";
  clienteReferencia.parentNode.style.boxShadow = "none";
};

const limpiar = () => {
  quitarColorError();
  clienteNombre.value = "";
  clienteApellido.value = "";
  clienteReferencia.value = "";
};

const validar = () => {
  if (
    clienteNombre.value != "" &&
    clienteApellido.value != "" &&
    clienteReferencia.value != ""
  ) {
    nuevoCliente();
  } else {
    if (clienteNombre.value == "") {
      clienteNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteNombre.parentNode.style.boxShadow = "none";
    }
    if (clienteApellido.value == "") {
      clienteApellido.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteApellido.parentNode.style.boxShadow = "none";
    }
    if (clienteReferencia.value == "") {
      clienteReferencia.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      clienteReferencia.parentNode.style.boxShadow = "none";
    }
  }
};

const nuevoCliente = async () => {
  let fecha = obtenerFecha("YYYY/MM/DD");
  const obj = {
    cliente_nombre: clienteNombre.value,
    cliente_apellido: clienteApellido.value,
    cliente_referencia: clienteReferencia.value,
    cliente_estado: "Activo",
  };
  await ipcRenderer.invoke("nuevoCliente", obj, fecha);
  window.location.href = "#";
  location.reload();
};

const obtenerClientes = async () => {
  await ipcRenderer.invoke("obtenerClientes");
};

let listaDeClientesRaw = [];
ipcRenderer.on("lista_de_clientes", (event, results) => {
  listaDeClientesRaw = results;
  console.log(results);
});

let idCli;
const copiarDatos = () => {
  console.log(listaDeClientesRaw);
  let index = event.target.parentNode.parentNode.parentNode;
  idCli = index.children[1].innerHTML;
  console.log(idCli);
  let elemento = listaDeClientesRaw.find(
    (element) => element.cliente_id == idCli
  );
  clienteNombreModificar.value = elemento.cliente_nombre;
  clienteApellidoModificar.value = elemento.cliente_apellido;
  clienteReferenciaModificar.value = elemento.cliente_referencia;
};

const modificarCliente = async () => {
  let obj = {
    cliente_id: idCli,
    cliente_nombre: clienteNombreModificar.value,
    cliente_apellido: clienteApellidoModificar.value,
    cliente_referencia: clienteReferenciaModificar.value,
  };
  console.log(obj);
  await ipcRenderer.invoke("modificarCliente", obj);
  tablaEntradas.innerHTML = "";
  documentos = [];
  cargarDocumentos();
};

let i = 0;
let documentos = [];
ipcRenderer.on("documentos_historial_clientes", (event, results) => {
  console.log(results);
  documentos = results[0];
  let plantilla = "";
  documentos.forEach((element, index, array) => {
    i++;
    plantilla += `
    <tr class = "filas ${element.cliente_nombre}${
      element.cliente_apellido
    }  filasElementos">
      <td style="max-width: 10vh; min-width: 10vh; width: 10vh">${i}</td>
      <td style="max-width: 10vh; min-width: 10vh; width: 10vh">${
        element.cliente_id
      }</td>
      <td style="max-width: 28vh; min-width: 28vh; width: 28vh">
      ${element.cliente_nombre} ${element.cliente_apellido} || ${
      element.cliente_referencia
    }
      </td>
      <td style="max-width: 18vh; min-width: 18vh; width: 18vh">${convertirFecha(
        element.historial_cliente_fecha
      )}</td>
      <td style="max-width: 28vh; min-width: 28vh; width: 28vh">${
        element.cliente_estado
      }</td>
      <td style="max-width: 20vh; min-width: 20vh; width: 20vh">
        L. ${element.historial_cliente_saldo_nuevo}.00
      </td>
      <td style="max-width: 30vh; min-width: 30vh; width: 30vh">
        <div class="flexRow">
          <button
            id = ${element.cliente_id}
            onclick="visualizarDocumento(this.id)"
            class="botonListado colorSecundario"
            style="margin-right: 20px"
          >
            VER
          </button>
          <button
          id = ${element.cliente_id}
          onclick="location.href='#modal_modificar_cliente'; copiarDatos();event.preventDefault()"
          class="botonListado colorAmarillo"
          style="margin-right: 20px"
          >
            MODIFICAR
          </button>
        </div>
      </td>
    </tr>`;
  });
  tablaEntradas.innerHTML += plantilla;
  let filasElementos = document.getElementsByClassName("filasElementos");
  agregarColorFilas(filasElementos);
});

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
