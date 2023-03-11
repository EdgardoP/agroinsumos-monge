const { ipcRenderer } = require("electron");

let usuario_nombre = document.getElementById("usuario_nombre");
let usuario_contraseña = document.getElementById("usuario_contraseña");
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", () => {
  const obj = {
    usuario_nombre: usuario_nombre.value,
    usuario_contraseña: usuario_contraseña.value,
  };
  ipcRenderer.invoke("iniciarSesion", obj);
});

const cerrarVentana = async () => {
  await ipcRenderer.invoke("cerrarVentanaLogin");
};
