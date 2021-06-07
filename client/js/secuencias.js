import $ from 'jquery';
import * as vt from './videoTracks';
import * as ve from './videoElements';
import * as room from './room';
import * as rc from './rewindCards';

const elecciones = [1, 4, 7, 11, 15, 21, 23, 28];
const numSecuencias = elecciones.length;
var secuenciaContainers = new Array(numSecuencias);
var mostrados = new Array(numSecuencias);

/**
 * @param {any} num
 */
export function hideSecuencias(num) {
    for (let i = numSecuencias - 1; i >= num; i--) {
        secuenciaContainers[i].addClass('d-none');
        mostrados[i] = false;
    }
    if (num <= 0) {
        $("#noescenas").removeClass("d-none");
    }
}

/**
 * @param {any} num
 */
export function showSecuencia(num) {
    if (num < numSecuencias) {
        $("#noescenas").addClass("d-none");
        secuenciaContainers[num].removeClass('d-none');
        mostrados[num] = true;
    }
}

export function getUltimo() {
    var indice = -1;
    for (let i = mostrados.length - 1; indice == -1 && i >= 0; i--) {
        if (mostrados[i]) indice = i;
    }
    return indice;
}

export function irUltimo() {
    var indice = getUltimo();
    if (indice != -1) {
        hideSecuencias(indice);
        vt.goToScene(elecciones[indice]);
        ve.video.play();
    }
}

window['chetos'] = function () {
    for (let index = 0; index < numSecuencias; index++) {
        showSecuencia(index);
    }
}


$(() => {
    for (let i in elecciones) {
        $("#contenedor-secuencias").append(
            `<div id="secuencia-container${i}" class="secuencia col-xs-24 col-sm-12 col-md-8 col-lg-6 col-xxl-4 col-xxxl-3 d-flex justify-content-center d-none">
                <a class="escena" href ="javascript:void(0)">
                    <img id="eleccion${elecciones[i]}" class="imageUp thumbnail" src="/assets/img/decision${i}.jpg" width="200">
                </a>
            </div>`);
        secuenciaContainers[i] = $(`#secuencia-container${i}`);
        secuenciaContainers[i].on('click', function (e) {
            if (room.isOnRoom()) {
                room.emit("vote-rewind",
                    { time: ve.video.currentTime, scene: i });
                $('[data-toggle="tooltip"]').tooltip('hide');
                rc.setNextVote(true);
            } else {
                hideSecuencias(i);
                vt.goToScene(elecciones[i]);
            }
        });
    }
});