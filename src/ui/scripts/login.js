const { ipcRenderer } = require("electron");

let usuario_nombre = document.getElementById("usuario_nombre");
let usuario_contraseña = document.getElementById("usuario_contraseña");
let btnLogin = document.getElementById("btnLogin");
let btnOlvideContraseña = document.getElementById("btnOlvideContraseña");

btnLogin.addEventListener("click", () => {
  const obj = {
    usuario_nombre: usuario_nombre.value,
    usuario_contraseña: usuario_contraseña.value,
  };
  ipcRenderer.invoke("iniciarSesion", obj);
});
