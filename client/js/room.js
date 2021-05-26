import $ from 'jquery';

var onRoom = false;
var socket = null;



$(() => {
    if ($("#room").data('room')) {
        import( /* webpackChunkName: "room" */ './socket').
            then((module) => {
                module.connectRoom(() => {
                    onRoom = true;
                    socket = module.socket;
                    function submitForm() {
                        modal.hide();
                        module.join();
                    }
                    /** @type {HTMLFormElement} */
                    // @ts-ignore
                    var form = $("#roomForm").get(0);
                    window['submitForm'] = submitForm;
                    form.action = "javascript:window['submitForm']();"
                });
            });

        const bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
        var modal = new bootstrap.Modal($("#roomModal").get(0), {
            backdrop: true, keyboard: false, focus: false,
            // @ts-ignore
            backdrop: 'static'
        });
        modal.show();


    } else {
        window['room'] = false;
        registerKeys();
    }
})



/**
 * 
 * @returns {boolean}
 */
export function isOnRoom() {
    return onRoom;
}

function registerKeys() {
    $(document).on('keypress', function (e) {
        e.preventDefault();
        switch (e.key) {
            case ' ':
            case 'k':
                if (!ve.playButton.hasClass("d-none")) {
                    vp.togglePlay();
                }
                break;
            case 'f':
                vp.toggleFullScreen();
                break;
            case 'c':
                vp.toggleSubs();
                break;
            default:
                console.log('has pulsado ' + e.key);
        }
    });

    // Activar los toggles de los iconos del video
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

/**
 * @param {string} event
 * @param {any[]} [args]
 */
export function emit(event, args) {
    if (!socket) {
        console.error("Socket no inicializado");
        return
    }
    socket.emit(event, args);
}