/*
 * Simple jQuery plugin to synchronously load and then transition (fade-in/out) a list of images as full screen background-images on a web page.
 * Author: Matt Richards, http://github.com/mattyrichards
 * Licensed under the MIT license
 */
;(function( $, window, document, undefined ){

    var BackgroundTransition = function( elem, options ){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        self = this;
    };

    BackgroundTransition.prototype = {
        defaults: {
            classNameBottomImage: "image-bottom",
            classNameTopImage: "image-top",
            idNameDownloadImage: "image-download",
            backgrounds: [ 
            { src :'../assets/img/bg-masthead.png' },
            { src: '../assets/img/bg-masthead2.jpg' } 
            ],
            imageKey: 1,
            transitionDelay: 5,
            animationSpeed: 1500
        },

        init: function() {
            this.config = $.extend({}, this.defaults, this.options);
            if (this.config.backgrounds.length >= 2) {
                this.prepareMarkup();
                this.loadNext();
                return this;
            } else {
                console.warn('BackgroundTransition requires at least 2 background images.')
                return false;
            }
        },

        prepareMarkup: function() {
            var imageBottom = $("<div/>").addClass(this.config.classNameBottomImage + ' initial').css('background-image',  ['linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 100%, rgba(0, 0, 0, 0.2) 100%)', 'url(' + this.config.backgrounds[0].src + ')']);
            var imageTop = $("<div/>").addClass(this.config.classNameTopImage).css('display', 'none');
            $(this.elem)
                .prepend(imageBottom, imageTop)
                .css('background-image', 'none');
        },

        loadNext: function() {
            if (this.config.imageKey == this.config.backgrounds.length){
                this.config.imageKey = 0;
            }
            var deferred = $.Deferred();
            $('<img/>').attr('id', this.config.idNameDownloadImage).load(function() {
                deferred.resolve();
            }).attr('src', this.config.backgrounds[this.config.imageKey].src).prependTo('body .backgroundTransition');
            deferred.done(function() {
                setTimeout(self.replaceImage, (self.config.transitionDelay * 1000));
            });
        },

        replaceImage: function() {
            var nextSrc = $('#' + self.config.idNameDownloadImage);
            $('#' + self.config.idNameDownloadImage).remove();
            $('.' + self.config.classNameTopImage).css('background-image', ['linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 100%, rgba(0, 0, 0, 0.2) 100%)', 'url(' + nextSrc.attr('src') + ')']);
            $('.' + self.config.classNameTopImage).fadeIn(self.config.animationSpeed, 'swing', function() {
               $('.' + self.config.classNameBottomImage).css('background-image', ['linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 100%, rgba(0, 0, 0, 0.2) 100%)', 'url(' + nextSrc.attr('src') + ')']);
               $(this).hide();
               self.config.imageKey++;
               self.loadNext();
            });
        }
    }

    BackgroundTransition.defaults = BackgroundTransition.prototype.defaults;

    $.fn.backgroundTransition = function(options) {
        return this.each(function() {
            new BackgroundTransition(this, options).init();
        });
    };

})( jQuery, window , document );

$('.backgroundTransition').backgroundTransition({
    backgrounds:[
      { src: '../assets/img/bg-masthead.png' },
      { src: '../assets/img/bg-masthead2.jpg' },
    ],
    transitionDelay: 5,
    animationSpeed: 1500
});