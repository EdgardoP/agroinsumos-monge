const { ipcRenderer } = require("electron");

var $ = (jQuery = require("jquery"));
$(document).ready(function () {
  $("#accordian a").click(function () {
    var link = $(this);
    var closest_ul = link.closest("ul");
    var parallel_active_links = closest_ul.find(".active");
    var closest_li = link.closest("li");
    var link_status = closest_li.hasClass("active");
    var count = 0;

    closest_ul.find("ul").slideUp(function () {
      if (++count == closest_ul.find("ul").length)
        parallel_active_links.removeClass("active");
    });

    if (!link_status) {
      closest_li.children("ul").slideDown();
      closest_li.addClass("active");
    }
  });
});

let height = $(window).height();
$("#cajaDashboard").height(height);

const cerrarVentana = async () => {
  await ipcRenderer.invoke("cerrarVentana");
};

const maximizarVentana = async () => {
  await ipcRenderer.invoke("maximizarVentana");
};

const minimizarVentana = async () => {
  await ipcRenderer.invoke("minimizarVentana");
};
