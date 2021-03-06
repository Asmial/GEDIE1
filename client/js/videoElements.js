import $ from 'jquery';

/** @type {HTMLVideoElement} */
export var video;
/** @type {JQuery<HTMLElement>} */
export var videoControls;
/** @type {JQuery<HTMLElement>} */
export var playButton;
/** @type {JQuery<HTMLElement>} */
export var volumeSlider;
/** @type {HTMLElement} */
export var videoContainer;
/** @type {JQuery<HTMLElement>} */
export var fullscreenToggle;
/** @type {JQuery<HTMLElement>} */
export var muteToggle;
/** @type {JQuery<HTMLElement>} */
export var playMain;
/** @type {JQuery<HTMLElement>} */
export var rewind;
/** @type {JQuery<HTMLElement>} */
export var fastForward;
/** @type {HTMLVideoElement} */
export var decisionAudio;
/** @type {JQuery<HTMLElement>} */
export var muerte;
/** @type {JQuery<HTMLElement>} */
export var fin;
/** @type {JQuery<HTMLElement>} */
export var subs;

$(() => {
    // @ts-ignore
    video = $('#video').get(0);
    // @ts-ignore
    decisionAudio = $("#audio-decision").get(0);
    videoControls = $('#video-controls');
    playButton = $('#play-button');
    volumeSlider = $('#volume-slider');
    videoContainer = $('#video-container').get(0);
    fullscreenToggle = $("#fullscreen-toggle");
    muteToggle = $("#mute-toggle");
    playMain = $("#play-main");
    rewind = $("#rewind-scene");
    fastForward = $("#play-fast-forward");
    muerte = $("#muerte-display");
    fin = $("#fin-display");
    subs = $("#subtitles-toggle");
});