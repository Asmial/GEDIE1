import $ from 'jquery';
import * as room from './room';

var cardsShown = false;
var voted = false;

/** @type {JQuery<HTMLElement>} */
var singleOption;
/** @type {JQuery<HTMLElement>} */
var cardsQuestion;
/** @type {JQuery<HTMLElement>} */
var cardAnswers;
/** @type {JQuery<HTMLElement>} */
var cardAnswer0;
/** @type {JQuery<HTMLElement>} */
var cardAnswer1;
/** @type {JQuery<HTMLElement>} */
var videoCards;
/** @type {JQuery<HTMLElement>} */
var voteLeft;
/** @type {JQuery<HTMLElement>} */
var voteRight;

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
    voted = false;
    console.log(answer1);

    if (!answer1) {
        console.log("hide");
        singleOption.addClass('d-none');
    } else {
        singleOption.removeClass('d-none');
        cardAnswer1.html(answer1);
    }
}

export function hideAwnser1() {
    singleOption.addClass('d-none');
    console.log("hidden");
}

/**
 * @param {Function} callback0
 * @param {Function} [callback1]
 */
export function setCardsCallbacks(callback0, callback1) {
    voted = false;
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
    if (!voted) {
        voteLeft.css({ width: '0%' });
        voteRight.css({ width: '0%' });
        cardAnswers.removeClass("bg-primary bg-success text-light bg-dark");
        cardAnswers.addClass("bg-light");
    }
    videoCards.fadeIn(200);
}

export function hideCards() {
    voted = false;
    cardsShown = false;
    videoCards.fadeOut(200, () => {
        voteLeft.css({ width: '0%' });
        voteRight.css({ width: '0%' });
        cardAnswers.removeClass("bg-primary bg-success text-light bg-dark");
        cardAnswers.addClass("bg-light");
    });
}


/**
 * @param {number} left
 * @param {number} right
 */
export function setVotes(left, right) {
    if (cardsShown) {
        voteLeft.animate({ width: `${left}%` }, 150);
        voteRight.animate({ width: `${right}%` }, 150);
    }
}



$(() => {
    cardAnswers = $(".card-answer")
    videoCards = $('#video-cards');
    singleOption = $('#single-option');
    cardsQuestion = $('#cards-question');
    cardAnswer0 = $('#card-answer0');
    cardAnswer1 = $('#card-answer1');
    voteLeft = $("#votebar-left");
    voteRight = $("#votebar-right");

    videoCards.fadeOut(0);
    videoCards.on('dblclick', (e) => {
        e.stopPropagation();
    })

    cardAnswer0.on('click', (e) => {
        e.stopPropagation();
        if (cardsShown && cardCallback0)
            cardCallback0(e);
        if (room.isOnRoom() && !voted) {
            voted = true;
            cardAnswer0.addClass("bg-primary");
            cardAnswers.removeClass("bg-light");
            cardAnswers.addClass("text-light");
            cardAnswer1.addClass("bg-dark");
        } else if (!room.isOnRoom()) {
            hideCards();
        }
    });
    cardAnswer1.on('click', (e) => {
        e.stopPropagation();
        if (cardsShown && cardCallback1) {
            cardCallback1(e);
        }
        if (room.isOnRoom() && !voted) {
            voted = true;
            cardAnswer1.addClass("bg-success");
            cardAnswers.removeClass("bg-light");
            cardAnswers.addClass("text-light");
            cardAnswer0.addClass("bg-dark");
        } else if (!room.isOnRoom()) {
            hideCards();
        }
    });
    videoCards.on('click', (e) => {
        e.stopPropagation();
    })
})
