import $ from 'jquery';

/** @type HTMLVideoElement */
// @ts-ignore
export const video = $('#video').get(0);

export const videoControls = $('#video-controls');
export const playButton = $('#play-button');
export const volumeSlider = $('#volume-slider');
export const videoContainer = $('#video-container').get(0);
export const fullscreenToggle = $("#fullscreen-toggle");
export const muteToggle = $("#mute-toggle");
export const playMain = $("#play-main");