var zoomInput = document.querySelector("input#zoom");
var icons = document.querySelector(".icons");

var updateZoom = function() {
	icons.style.zoom = zoomInput.value;
}

zoomInput.addEventListener('input', updateZoom);
updateZoom();