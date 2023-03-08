const { ipcRenderer } = require("electron");

let idProducto = document.getElementById("idProducto");
let productoNombre = document.getElementById("productoNombre");
let productoDescripcion = document.getElementById("productoDescripcion");
let productoColor = document.getElementById("productoColor");
let producto_categoria = document.getElementById("producto_categoria");
let producto_proveedor_fk = document.getElementById("producto_proveedor_fk");

const obtenerCategorias = async () => {
  await ipcRenderer.invoke("obtenerCategorias");
};

document.addEventListener("DOMContentLoaded", function () {
  obtenerProveedores();
  obtenerNombreProductos();
  obtenerCategorias();
  autocomplete(productoNombre, listaDeProductosNombre);
  autocomplete(idProducto, listaDeProductosId);
  productoNombre.focus();
});

let listaDeProductosRaw = [];
let listaDeProductosNombre = [];
let listaDeProductosId = [];

const obtenerNombreProductos = async () => {
  await ipcRenderer.invoke("obtenerInformacionProductos");
};

ipcRenderer.on("informacion_productos", (event, results) => {
  listaDeProductosRaw = results;
  console.log(listaDeProductosRaw);
  listaDeProductosRaw.forEach((element, index) => {
    listaDeProductosId.push(
      element.producto_id +
        " " +
        element.producto_nombre +
        " " +
        element.producto_descripcion
    );
    listaDeProductosNombre.push(
      element.producto_nombre + " " + element.producto_descripcion + " "
    );
  });
});

const limpiarTextos = () => {
  idProducto.value = "";
  productoNombre.value = "";
  productoDescripcion.value = "";
  productoColor.value = "%";
  producto_categoria.value = "0";
  quitarColorError();
};

let listaDeCategoriasRaw = [];
ipcRenderer.on("lista_de_categorias", (event, results) => {
  let plantilla = "";
  listaDeCategoriasRaw = results[0];
  listaDeCategoriasRaw.forEach((element) => {
    plantilla += `<option value = ${element.categoria_id} > ${element.categoria_nombre}</option>`;
  });
  let nullOption = `<option value = 0>Seleccione</option>`;
  producto_categoria.innerHTML = nullOption + plantilla;
});

function autocomplete(inp, arr) {
  let focusActual;
  inp.addEventListener("input", function (e) {
    let contenedorItems;
    let items;
    let i;
    let val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    focusActual = -1;
    contenedorItems = document.createElement("div");
    contenedorItems.setAttribute("id", this.id + "lista-autocompletado");
    contenedorItems.setAttribute("class", "items-autocompletado");
    this.parentNode.appendChild(contenedorItems);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        items = document.createElement("div");
        items.innerHTML =
          "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        items.innerHTML += arr[i].substr(val.length);
        items.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        //Añadir el atributo id segun el indice que tiene en la lista de productos
        items.setAttribute("id", i);
        items.addEventListener("click", function (e) {
          //capturo el indice con la variable e, mediante target.id
          let indice = e.target.id;
          productoNombre.value = listaDeProductosRaw[indice].producto_nombre;
          idProducto.value = listaDeProductosRaw[indice].producto_id;
          productoDescripcion.value =
            listaDeProductosRaw[indice].producto_descripcion;
          productoColor.value = listaDeProductosRaw[indice].producto_color;
          producto_proveedor_fk.value =
            listaDeProductosRaw[indice].producto_proveedor_fk;
          producto_categoria.value =
            listaDeProductosRaw[indice].producto_categoria_fk;
          closeAllLists();
        });
        contenedorItems.appendChild(items);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "lista-autocompletado");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      focusActual++;
      addActive(x);
    } else if (e.keyCode == 38) {
      focusActual--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (focusActual > -1) {
        if (x) x[focusActual].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (focusActual >= x.length) focusActual = 0;
    if (focusActual < 0) focusActual = x.length - 1;
    x[focusActual].classList.add("autompletado-activo");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autompletado-activo");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("items-autocompletado");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
const validar = () => {
  if (
    idProducto.value != "" &&
    productoNombre.value != "" &&
    productoDescripcion.value != "" &&
    producto_proveedor_fk.value != "%" &&
    productoColor.value != "%" &&
    producto_categoria.value != "0"
  ) {
    quitarColorError();
    modificarProducto();
    limpiarTextos();
  } else {
    if (idProducto.value == "") {
      idProducto.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      idProducto.parentNode.style.boxShadow = "none";
    }
    if (productoNombre.value == "") {
      productoNombre.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoNombre.parentNode.style.boxShadow = "none";
    }
    if (productoDescripcion.value == "") {
      productoDescripcion.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoDescripcion.parentNode.style.boxShadow = "none";
    }
    if (producto_proveedor_fk.value == "%") {
      producto_proveedor_fk.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      producto_proveedor_fk.parentNode.style.boxShadow = "none";
    }
    if (productoColor.value == "%") {
      productoColor.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      productoColor.parentNode.style.boxShadow = "none";
    }
    if (producto_categoria.value == "0") {
      producto_categoria.parentNode.style.boxShadow =
        "rgba(255, 0, 0, 0.563) 3px 2px 5px";
    } else {
      producto_categoria.parentNode.style.boxShadow = "none";
    }
  }
};

const quitarColorError = () => {
  idProducto.parentNode.style.boxShadow = "none";
  productoNombre.parentNode.style.boxShadow = "none";
  productoDescripcion.parentNode.style.boxShadow = "none";
  producto_proveedor_fk.parentNode.style.boxShadow = "none";
  productoColor.parentNode.style.boxShadow = "none";
  producto_categoria.parentNode.style.boxShadow = "none";
};
const modificarProducto = async () => {
  let obj = {
    producto_id: idProducto.value,
    producto_nombre: productoNombre.value,
    producto_descripcion: productoDescripcion.value,
    producto_color: productoColor.value,
    producto_categoria: producto_categoria.value,
  };
  await ipcRenderer.invoke("modificarProducto", obj);
};

const obtenerProveedores = async () => {
  await ipcRenderer.invoke("obtenerProveedores");
};

let listaDeProveedoresRaw = [];
ipcRenderer.on("lista_de_proveedores", (event, results) => {
  let plantilla = "";
  listaDeProveedoresRaw = results[0];
  listaDeProveedoresRaw.forEach((element) => {
    plantilla += `<option value = ${element.proveedor_id} > ${element.proveedor_nombre}</option>`;
  });
  let nullOption = `<option value = '%'>Seleccione</option>`;
  producto_proveedor_fk.innerHTML = nullOption + plantilla;
  console.log(listaDeProveedoresRaw);
});
