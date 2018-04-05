/*
 * Create a list that holds all of your cards
 */
const symbolList = ['fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];

//global vars
const deck = $('.deck');
let movesMade = $('.moves');
let openedCards = []; //used to put mached cards into array
let match = 0;  //matched element count
let movesCounter = 0; // moves made
let status = 0; //timer status
let time = 0; // time in millis
var clickSound = new Audio('audio/card-click.mp3');
var matchSound = new Audio('audio/match.mp3');
var nomatchSound = new Audio('audio/nomatch.mp3');
var loading = new Audio('audio/loading.mp3');
var win = new Audio('audio/win.mp3');


//game timer
function startTimer() {
    if (!this.done) {
        this.done = true;
        status = 1;
        timer();
    }
    if (status == 0) {
        this.done = false;
    }
}

function stopTimer() {

    status = 0;

}

function resetTimer() {
    status = 0;
    time = 0;
}

function timer() {
    if (status == 1) {
        // set function to calculate time
        setTimeout(function () {
            time++;
            min = Math.floor(time / 100 / 60);
            sec = Math.floor(time / 100);
            millis = time % 100 - 1;

            if (min < 10) {
                min = `0${min}`;
            }
            if (sec >= 60) {
                sec %= 60;
            }
            if (sec < 10) {
                sec = `0${sec}`;
            }
            if (millis < 10) {
                millis = `0${millis}`;
            }
            $('.timer').text(`Time: ${min}:${sec}`);
            timer();
        }, 10);

    }
}


// game logic fucntion
function checkCards(element) {
    // debug for double click on element
    if ($(element).hasClass('show') || $(element).hasClass('match')) {
        return true;
    }
    $(element).addClass('show open');

    openedCards.push(element);

    if (openedCards.length > 1) {
        if (element.firstElementChild.className === openedCards[0].firstElementChild.className) {
            deck.find('.open').addClass('match zoomed');
            matchSound.play();
            setTimeout(function () {
                deck.find('.match').removeClass('open zoomed');
                
            }, 300);
            match++;
        } else {
            deck.find('.open').addClass('nomatch');
            nomatchSound.play();
            setTimeout(function () {
                deck.find('.open').removeClass('open show nomatch');
            }, 300);
        }
        movesCounter++;
        openedCards = [];
    }
}
// star rating count
function moveRating(movesCounter) {

    if (movesCounter < 11) {
        starsfinished = 3;
    } else if (movesCounter > 11 && movesCounter < 16) {
        $('.fa-star').eq(2).removeClass('fa-star').addClass('fa-star-o');
        starsfinished = 2;
    } else if (movesCounter > 16 && movesCounter < 20) {
        $('.fa-star').eq(1).removeClass('fa-star').addClass('fa-star-o');
        starsfinished = 1;
    } else if (movesCounter > 20) {
        $('.fa-star').eq(0).removeClass('fa-star').addClass('fa-star-o');
        starsfinished = 0;
    }
}

// game end function
function gameEnd() {
    if (match === 8) {
        let gameEnd = $('.game-end');
        $(gameEnd).addClass('open');
        const timerResult = $('.timer').text();
        $('.game-info').append(`<p>You made it! With ${starsfinished} stars and ${movesCounter} moves. Your ${timerResult}</p>`);  // writes line in winner screen
        stopTimer();
        win.play();

    }
}
// function to reset game
function resetGame() {

    $('.card').removeClass('show open match');
    let deck = $('.card .fa');
    for (let i = 0; i < deck.length; i++) {
        $(deck[i]).removeClass(symbolList[i]);
    }
    shuffle(symbolList);
    for (let i = 0; i < symbolList.length; i++) {
        $(deck[i]).addClass(symbolList[i]);
    }
    $('.fa-star-o').removeClass('fa-star-o').addClass('fa-star');
    openedCards = [];
    movesCounter = 0;
    movesMade.text('0');
    match = 0;
    time = 0, 0;
    resetTimer();

}
// initiate game
function startGame() {
    shuffle(symbolList);
    let deck = $('.card .fa');
    for (let i = 0; i < symbolList.length; i++) {
        $(deck[i]).addClass(symbolList[i]);
    }
    $('.fa-star-o').removeClass('fa-star-o').addClass('fa-star');
    movesCounter = 0;
    movesMade.text('0');
    match = 0;
}

//reset game click fnction
$('.restart').click(function () {
    resetGame();
    $('.deck').addClass('reset');
    $('.load-text').fadeIn('slow');
    loading.play();
    setTimeout(function () {
        $('.deck').removeClass('reset');
        $('.load-text').fadeOut('slow');

    }, 6000);
});
//start new game  click function
$('#restart-game').click(function () {
    $('.timer').text("Time: 00:00");
    resetGame();
    $('.game-end').fadeOut('slow');
    $('.deck').addClass('reset ');
    $('.load-text').fadeIn('slow')
    loading.play();
    setTimeout(function () {
        $('.deck').removeClass('reset ');
        $('.load-text').fadeOut('slow');
    }, 6000);

});
//card click function
$('.card').click(function () {
    movesMade.text(movesCounter);
    checkCards(this);
    moveRating(movesCounter);
    startTimer();
    gameEnd();
    clickSound.play();
});

startGame();




/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */