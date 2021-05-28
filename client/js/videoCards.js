import $ from 'jquery';
import * as room from './room';

var cardsShown = false;

/** @type {JQuery<HTMLElement>} */
var singleOption;
/** @type {JQuery<HTMLElement>} */
var cardsQuestion;
/** @type {JQuery<HTMLElement>} */
var cardAnswer0;
/** @type {JQuery<HTMLElement>} */
var cardAnswer1;
/** @type {JQuery<HTMLElement>} */
var videoCards;

var cardCallback0 = null;
var cardCallback1 = null;

export function isCardsShown() {
    return cardsShown;
}

/**
 * @param {string} question
 * @param {string} answer0
 * @param {string} [answer1]
 */
export function setCardsText(question, answer0, answer1) {
    cardsQuestion.html(question);
    cardAnswer0.html(answer0);

    if (!answer1) {
        singleOption.addClass('d-none');
    } else {
        singleOption.removeClass('d-none');
        cardAnswer1.html(answer1);
    }
}

/**
 * @param {Function} callback0
 * @param {Function} [callback1]
 */
export function setCardsCallbacks(callback0, callback1) {
    cardCallback0 = callback0;
    if (callback1)
        cardCallback1 = callback1;
    else
        cardCallback1 = null;
}

export function getCardsCallbacks() {
    return [cardCallback0, cardCallback1]
}

export function showCards() {
    cardsShown = true;
    videoCards.fadeIn(200);
}

export function hideCards() {
    cardsShown = false;
    videoCards.fadeOut(200, () => {
        $("#votebar-left").css({ width: '0%' });
        $("#votebar-right").css({ width: '0%' });
    });
}



$(() => {
    videoCards = $('#video-cards');
    singleOption = $('#single-option');
    cardsQuestion = $('#cards-question');
    cardAnswer0 = $('#card-answer0');
    cardAnswer1 = $('#card-answer1');

    videoCards.fadeOut(0);
    videoCards.on('dblclick', (e) => {
        e.stopPropagation();
    })

    cardAnswer0.on('click', (e) => {
        e.stopPropagation();
        if (cardsShown && cardCallback0)
            cardCallback0(e);
        if (room.isOnRoom()) { } else {
            hideCards();
        }
    });
    cardAnswer1.on('click', (e) => {
        e.stopPropagation();
        if (cardsShown && cardCallback1)
            cardCallback1(e);
        if (room.isOnRoom()) {
        } else {
            hideCards();
        }
    });
    videoCards.on('click', (e) => {
        e.stopPropagation();
    })
})
