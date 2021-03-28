import $ from 'jquery';

/** @type {HTMLVideoElement} */
export var video;
export var track;
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

$(() => {
    // @ts-ignore
    video = $('#video').get(0)
    track = $('#track').get(0)
    videoControls = $('#video-controls');
    playButton = $('#play-button');
    volumeSlider = $('#volume-slider');
    videoContainer = $('#video-container').get(0);
    fullscreenToggle = $("#fullscreen-toggle");
    muteToggle = $("#mute-toggle");
    playMain = $("#play-main");
})