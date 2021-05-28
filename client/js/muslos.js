import $ from 'jquery';

const numMuslos = 8
var muslosAct = 4
const muslos = new Array(8);

$(() => {
    for (let i = 0; i < numMuslos; i++) {
        $('#hambre-dot').append(`
        <div class="position-relative mb-3">
            <img id="hambre-dot${i}" class="position-absolute top-50 start-50 translate-middle"
                src="/assets/img/hungerIcon.png" height="37">
            <img class="image1" src="/assets/img/hungerEmptyIcon.png" height="37">
        </div>
        `);
        muslos[i] = $(`#hambre-dot${i}`);
    }
    setHungerLevel(muslosAct)
});

/**
 * @param {number} num
 */
function menosMuslo(num) {
    $(muslos[num]).hide(500)
}

/**
 * @param {number} num
 */
function masMuslo(num) {
    $(muslos[num]).show(500)
}

export function actualizaMuslo(num) {
    muslosAct = muslosAct + num;
    setHungerLevel(muslosAct)
}

/**
 * @param {number} level
 */
export function setHungerLevel(level) {
    //En caso de que el número de muslos tenga que ser 0
    if (level == 9) level = 0
    if (level > numMuslos)
        level = numMuslos;

    for (let i = 0; i < level; i++) {
        masMuslo(i);
    }
    for (let i = level; i < 8; i++) {
        menosMuslo(i);
    }
}

window['setHungerLevel'] = setHungerLevel