import $ from 'jquery';
const elecciones = [1, 4, 7, 11, 15, 21, 23, 28];
const numSecuencias = elecciones.length;
var secuenciaContainers = new Array(numSecuencias);
var mostrados = new Array(numSecuencias);
var ultimo = -1;

/**
 * @param {any} num
 */
export function hideSecuencias(num) {
    for (let i = numSecuencias - 1; i > num; i--) {
        secuenciaContainers[i].addClass('d-none');
        mostrados[i] = false;
    }
}

/**
 * @param {any} num
 */
export function showSecuencia(num) {
    if (num < numSecuencias) {
        secuenciaContainers[num].removeClass('d-none');
        mostrados[num] = true;
        ultimo = -1;
    }
}

export function getUltimo() {
    return ultimo;
}


$(() => {
    for (let i in elecciones) {
        $("#contenedor-secuencias").prepend(
            `<div id="secuencia-container${i}" class="secuencia col-xs-24 col-sm-12 col-md-8 col-lg-6 col-xxl-4 col-xxxl-3 d-flex justify-content-center d-none">
                <a class="escena" href = "#">
                    <img id="eleccion${elecciones[i]}" class="imageUp thumbnail" src="img/decision${i}.jpg" width="200">
                </a>
            </div>`);
        secuenciaContainers[i] = $(`#secuencia-container${i}`);
    }
});