import $ from 'jquery';
import * as room from './room';

var cardsShown = false;
var voted = false;

/** @type {JQuery<HTMLElement>} */
var cardsName;
/** @type {JQuery<HTMLElement>} */
var cardsImage;
/** @type {JQuery<HTMLElement>} */
var cardAnswers;
/** @type {JQuery<HTMLElement>} */
var cardAnswer0;
/** @type {JQuery<HTMLElement>} */
var cardAnswer1;
/** @type {JQuery<HTMLElement>} */
var rewindCards;
/** @type {JQuery<HTMLElement>} */
var voteLeft;
/** @type {JQuery<HTMLElement>} */
var voteRight;

var cardCallback0 = null;
var cardCallback1 = null;
var nextvote = 0;

export function isCardsShown() {
    return cardsShown;
}

/**
 * @param {string} name
 */
export function setCardsName(name) {
    cardsName.html(name)
}

/**
 * @param {number} scene
 */
export function setCardsScene(scene) {
    cardsImage.attr('src', `/assets/img/decision${scene}.jpg`)
}

export function showCards() {
    voted = false;
    cardsShown = true;
    rewindCards.fadeIn(200, () => {
        if (nextvote > 0) {
            switch (nextvote) {
                case 1: voteyes(); break;
                case 2: voteno(); break;
            }
            nextvote = 0;
        }
    });
}

export function hideCards() {
    voted = false;
    rewindCards.fadeOut(200, () => {
        cardsShown = false;
        voteLeft.css({ width: '0%' });
        voteRight.css({ width: '0%' });
        cardAnswers.removeClass("bg-primary bg-success text-light bg-dark");
        cardAnswers.addClass("bg-light");
    });
    nextvote = 0;
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

/**
 * @param {boolean} vote
 */
export function setNextVote(vote) {
    if (vote) {
        nextvote = 1
    } else {
        nextvote = 2;
    }
}

/**
 * @param {boolean} [force]
 */
function voteyes(force) {
    if (cardsShown && !voted || force) {
        console.log("voteyes");
        room.emit("vote-rewind-option", { left: true });
        voted = true;
        cardAnswer0.addClass("bg-primary");
        cardAnswers.removeClass("bg-light");
        cardAnswers.addClass("text-light");
        cardAnswer1.addClass("bg-dark");
    }
}

function voteno() {
    if (cardsShown && !voted) {
        room.emit("vote-rewind-option", { left: false });
        voted = true;
        cardAnswer1.addClass("bg-success");
        cardAnswers.removeClass("bg-light");
        cardAnswers.addClass("text-light");
        cardAnswer0.addClass("bg-dark");
    }
}

$(() => {
    rewindCards = $('#rewind-vote');
    cardsName = $('#cards-name');
    cardsImage = $('#cards-image');
    cardAnswer0 = $('#rewind-answer0');
    cardAnswer1 = $('#rewind-answer1');
    voteLeft = $('#votebar-rewind-left');
    voteRight = $('#votebar-rewind-right');
    cardAnswers = $('.rewind-answer')

    rewindCards.fadeOut(0);
    rewindCards.on('dblclick', (e) => {
        e.stopPropagation();
    })

    cardAnswer0.on('click', (e) => {
        e.stopPropagation();
        voteyes();
    });
    cardAnswer1.on('click', (e) => {
        e.stopPropagation();
        voteno();
    });

    rewindCards.on('click', (e) => {
        e.stopPropagation();
    })
})
