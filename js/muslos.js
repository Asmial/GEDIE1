import $ from 'jquery';

const numMuslos = 8
const muslos = new Array(8);

$(() => {
    for (let i = 0; i < numMuslos; i++) {
        $('#hambre-dot').append(`
        <div class="position-relative">
            <img id="hambre-dot${i}" class="position-absolute top-50 start-50 translate-middle"
                src="img/hungerIcon.png" height="37">
            <img class="image1" src="img/hungerEmptyIcon.png" height="37">
        </div>`);
        muslos[i] = $(`#hambre-dot${i}`);
    }
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

/**
 * @param {number} level
 */
export function setHungerLevel(level) {
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