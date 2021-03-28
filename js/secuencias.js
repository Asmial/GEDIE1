import $ from 'jquery';
const numSecuencias = 8;
const secuenciaContainers = new Array(numSecuencias);

/**
 * @param {any} num
 */
export function hideSecuencias(num) {
    for (let i = num; i < numSecuencias; i++) {
        secuenciaContainers[i].hide(500);
    }
}

/**
 * @param {any} num
 */
export function showSecuencia(num) {
    if (num < numSecuencias)
        secuenciaContainers[num].show(500);
}

$(() => {
    for (let i = 0; i < numSecuencias; i++) {
        $("#contenedor-secuencias").append(
            `<div id="secuencia-container${i}" class="col-xs-24 col-sm-12 col-md-8 col-lg-6 col-xxl-4 col-xxxl-3 d-flex justify-content-center">
                <a class='escena thumbnail' href = "#">
                    <img id="eleccion${i}" class="imageUp" src="img/decision${i}.jpg" width="200">
                </a>
            </div>`);
        secuenciaContainers[i] = $(`secuencia-container${i}`);
    }
});