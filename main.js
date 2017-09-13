$(document).ready(function() {

    new MatchHandler().createCards();
});

function Match() {
    var id = null;
    Object.defineProperty(this, 'id', {
        get: function () {
            if (id == null) {
                id = Math.random();
            }
            return id;
        }
    });
    this.relatedObject = null;
}

Match.prototype.clone = function (elm) {
    var c = null;

    if (elm) {
        c = new Card(elm);
    } else {
        c = new Card(this.attr);
        for (var attr in this) {
            if (attr != 'element' && c.hasOwnProperty(attr)) {
                c[attr] = this[attr];
            }
        }
    }

    c.relatedObject = this;
    this.relatedObject = c;

    return c;
}

/**
 *
 * @param attr {obj|jqElm}
 * @returns {null}
 * @constructor
 */
function Card(obj) {
    if (!$) {
        console.error("Card requires jquery");
        return null;
    }

    Match.call(this);

    //check if the object passed in is a jQuery Element
    if (obj[0]) {
        this.element = obj;
        this.element.attr('id', this.id);
    } else {
        //object passed in is a list of attributes for the new element
        this.attr = obj;
        this.createElement();
    }
}
Card.prototype = Object.create(Match.prototype);
Card.prototype.constructor = Match;

Card.prototype.createElement = function () {
    this.element = $('<div>').attr('class', 'card').attr('id', this.id);
    var bg = $('<div>').attr('class', 'back');
    var fg = $('<div>').attr('class', 'front');

    bg.attr(this.attr);
    this.element.append(bg).append(fg);
}

function MatchHandler() {
    if (!$) {
        console.error("MatchHandler requires jquery");
        return null;
    }

    var self = this;
    self.cardsClicked = [];
    self.cardsMatch = [];
    self.allCards = [];
    self.turnOverTimeout = 3000;
    self.timeoutCallback = null;
    self.setupCallback = null;
    self.autoCreate = false;
    self.numToCreate = false;

    self.winCallback = function(mhandler){
        $(mhandler.gameArea.containerSelector).append($("<h1>").html("You win").attr('class', 'win'));
        $(mhandler.gameArea.containerSelector).find('.card').hide();
    };

    self.resetObj = {
        selector:".reset",
        callback:function(){
            $(self.gameArea.containerSelector).find('h1').remove();
        }
    };

    self.matchCallback = function(selected, match){
        console.log("Match Callback : ", selected, " : ", match);
    };

    self.gameArea = {
        'containerSelector': '#game-area',
        'cardSelector': '.card',
        'frontSelector':'.front',
        'backSelector':'.back'
    };

    var randomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    self.cardClicked = function () {

        //the current scope is a specific card object
        var card = this;
        if(self.autoCreate){
            $(self.gameArea.containerSelector).append(card.element);
        }

        card.element.off('click').on('click',function () {

            var obj = self.findObj($(this));
            var match = self.checkMatch(obj);

            if (self.timeoutCallback) {
                $(this).animate({"right": "+=10"}, 50).animate({"right": "-=20"}, 50).animate({"right": "+=10"}, 50);
                return;
            }

            obj.element.find(self.gameArea.backSelector).hide();

            //check if the click was the first click
            if (typeof match == "boolean") {

                if (match) {
                    self.cardsMatch.push(obj, obj.relatedObject);
                    //once matched remove click handlers
                    obj.element.unbind('click');
                    obj.relatedObject.element.unbind('click');
                    //reset array of cards clicked
                    self.cardsClicked = [];

                    if(typeof self.matchCallback == 'function'){
                        self.matchCallback(obj, obj.relatedObject);
                    }

                    if (self.cardsMatch.length == self.allCards.length) {
                        self.winCallback(self);
                    }
                } else {

                    console.log("Cards didn't match");
                    self.timeoutCallback = setTimeout(function () {
                        obj.element.find(self.gameArea.backSelector).show();
                        if(self.cardsClicked[0]){
                            self.cardsClicked[0].element.find(self.gameArea.backSelector).show();
                        }
                        self.cardsClicked = [];
                        self.timeoutCallback = null;
                    }, self.turnOverTimeout);
                }

            } else {
                console.log("first click");
            }

        });
    }

    var parseCreationObj = function(obj){
        var dfd = jQuery.Deferred();

        self.createCallback = function(){console.log("Cards Created Callback")};

        if(obj){
            self.createCallback = (obj.createCallback)?obj.createCallback:self.createCallback;
            self.createCallback = (typeof obj == 'function')?obj:self.createCallback;

            self.creationObj = obj;

        }else{
            self.creationObj = {};
            if ($(self.gameArea.containerSelector).length == 0
                && $(self.gameArea.cardSelctor).length == 0) {
                self.numToCreate = 10;
            }
        }

        self.autoCreate  = (self.numToCreate) ? true : false;

        self.winCallback = (self.creationObj.winCallback)?self.creationObj.winCallback:self.winCallback;
        self.resetObj = (self.creationObj.resetObj)?self.creationObj.resetObj:self.resetObj;

        self.matchCallback = (self.creationObj.matchCallback && typeof self.creationObj.matchCallback == 'function')?self.creationObj.matchCallback:self.matchCallback;

        self.suffle = (self.creationObj.suffle)?self.creationObj.suffle:false;

        $(self.resetObj.selector).off('click').on('click', function(){
            //reset by creating the cards
            self.createCards(obj);
        });

        //auto resolve promise until we have other parsing that may not be syncornous
        dfd.resolve();

        return dfd.promise();
    }

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    /**
     * Method that takes in a object to either create the cards dynamically or pull existing elements to use for cards
     * @param obj - [numtoCreate:(int) , cardClass:(string)]
     * @returns {MatchHandler}
     */
    self.createCards = function (obj) {
        var cards = [];

        //reset the handler and then start with creation
        self.reset(true).done(function(){
            parseCreationObj(obj).done(function(){
                if (self.autoCreate) {
                    for (var i = 0; i < self.numToCreate; i++) {
                        var color = randomColor();
                        var c = new Card({
                            'style': 'background-color:' + color,
                            'data-id': 'eric' + i
                        });
                        var c2 = c.clone();
                        cards.push(c, c2);
                    }
                } else if (self.gameArea.cardSelector) {
                    var manualCards = $(self.gameArea.cardSelector);
                    if (manualCards.length > 1) {
                        var cards_src = [];

                        manualCards.each(function(index, elm){
                            cards_src.push($(elm).find(self.gameArea.frontSelector+' img').attr('src'));

                        }).promise().done(function(){
                            jQuery.unique(cards_src);

                            console.log(cards_src);

                            $(cards_src).each(function(i, val){
                                var matchingCards = $("img[src$='" + val + "']").parents(self.gameArea.cardSelector);
                                var c = new Card(matchingCards.eq(0));
                                var c2 = c.clone(matchingCards.eq(1));

                                cards.push(c, c2);
                            }).promise().done(function(){
                                //shuffle the cards

                                if(self.shuffle){
                                    self.allCards = shuffle(cards);
                                }else{
                                    self.allCards = cards;
                                }

                                $(self.allCards).each(self.cardClicked).promise().done(function(){
                                    self.createCallback();
                                });
                            });
                        });

                    } else {
                        return new Error("Obj parameter doesnt seem to have the correct properties to create cards");
                    }
                }else{
                    return new Error("cant find cards with the class"+self.gameArea.cardSelector+", unable to create functionality");
                }
            })
        });

        return self;
    };

    self.checkMatch = function (obj) {

        if (self.cardsClicked.length == 0) {
            self.cardsClicked.push(obj);
        } else {
            if (self.cardsClicked.indexOf(obj.relatedObject) != -1) {
                //cards matched
                return true;
            } else {
                return false;
            }
        }

        return null;
    }

    self.findObj = function (jqObj) {
        for (var index in self.allCards) {
            var c = self.allCards[index];
            if (c.id == jqObj.attr('id')) {
                return c;
            }
        }
        return null;
    }

    self.reset = function (init) {
        init = (init == undefined)?true:false;

        var dfd = jQuery.Deferred();
        //loop through all cards that were matched and show the backs
        $(self.allCards).each(function (i, val) {
            //show all of the card backs
            val.element.find(self.gameArea.backSelector).show();
        }).promise().done(function(){
            self.cardsClicked = [];
            self.cardsMatch = [];
            self.allCards = [];

            self.timeoutCallback = null;

            $(self.gameArea.containerSelector).find(self.gameArea.cardSelector).show();

            if(self.resetObj.callback
                && typeof self.resetObj.callback == 'function'
                && !init){
                self.resetObj.callback(self);
            }

            dfd.resolve();
        });

        return dfd.promise();
    }
}