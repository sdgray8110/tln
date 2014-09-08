define(function(require) {
    'use strict';

    var $ = require('jquery')

    return (function () {
        var proto = function () {
            var self = {
                settings: {
                    'autoDuration': 0, // Positive integer will enable auto slide
                    'carouselEl': null, // required
                    'hasPagers': true,
                    'hasPagination': true,
                    'before': null,
                    'pagerButtonSelector': 'button',
                    'slideHeight': '',
                    'slideSelector': '.slide',
                    'pagerContainerClass': 'button-container',
                    'prevButtonClass': 'prev',
                    'nextButtonClass': 'next',
                    'paginationClass': 'pagination-button-container',
                    'activePageClass': 'currentPage'
                },

                cacheDom: function () {
                    self.dom = {};
                    self.dom.carousel = self.settings.carouselEl;
                    self.dom.pagerButtons = self.dom.carousel.find(self.settings.pagerButtonSelector);
                    self.dom.slides = self.dom.carousel.find(self.settings.slideSelector);
                    self.dom.slideCount = self.dom.slides.length;

                },

                init: function (options) {
                    self.options = options;
                    $.extend(self.settings, self.options);

                    self.cacheDom();
                    self.startCarousel();
                },

                startCarousel: function () {
                    self.triggerHeightCallback();
                    self.carousel = Swipe(self.dom.carousel[0], {
                        auto: self.settings.autoDuration,
                        callback: self.onSlideChange
                    });
                    self.buildPagerButtons();
                    self.buildPagination();
                    self.wrapPaginationInPagers();
                    self.onSlideChange(0);
                },

                triggerHeightCallback: function() {
                    if (typeof(self.options.before) === 'function') {
                        self.options.before(self.dom.slides, self.settings.slideHeight);
                    }
                },

                onPagerClick: function (e) {
                    e.preventDefault();
                    var button = $(e.currentTarget),
                        index = 0;

                    if (button.hasClass(self.settings.prevButtonClass)) {
                        index = (self.currentPage - 1) < 0 ? self.dom.slideCount - 1 : self.currentPage - 1;
                    }
                    else {
                        index = (self.currentPage + 1) >= self.dom.slideCount ? 0 : self.currentPage + 1;
                    }

                    self.carousel.slide(index);
                },

                buildPagerButtons: function () {
                    var hasPagers = self.settings.hasPagers;

                    if (hasPagers === 'desktop') {
                        hasPagers = !('ontouchstart' in document.documentElement);
                    }

                    if (hasPagers && self.dom.slideCount > 1) {
                        self.dom.buttons = $('<button class="' + self.settings.prevButtonClass + '"></button><button class="' + self.settings.nextButtonClass + '"></button>');
                        var container = $('<div>').attr('class', self.settings.pagerContainerClass).append(self.dom.buttons);

                        self.dom.buttons.on('click', self.onPagerClick);
                        self.dom.carousel.append(container);
                    }
                },

                buildPagination: function () {
                    if (self.settings.hasPagination && self.dom.slideCount > 1) {
                        var pagers = '';
                        for (var i = 0; i < self.dom.slides.length; i++) {
                            var currentPage = i + 1,
                                page = '<li> page: ' + currentPage + '</li>';
                            pagers += page;
                        }
                        pagers = $('<ol>').html(pagers);
                        self.dom.pagerContainer = $('<div>').attr('class', self.settings.paginationClass).html(pagers);
                        self.dom.carousel.append(self.dom.pagerContainer);
                        self.dom.pagerListItems = self.dom.pagerContainer.find('li');
                        self.dom.pagerListItems.on('click', self.onPaginationClick);
                    }
                },

                wrapPaginationInPagers: function () {
                    if (self.settings.hasPagination && self.dom.slideCount > 1) {

                        self.dom.prevButton = $('<li><button class="' + self.settings.prevButtonClass + '"></button></li>');
                        self.dom.nextButton = $('<li><button class="' + self.settings.nextButtonClass + '"></button></li>');

                        var container = self.dom.pagerContainer.find('ol').prepend(self.dom.prevButton).append(self.dom.nextButton);

                        self.dom.prevButton.find('button').on('click', self.onPagerClick);
                        self.dom.nextButton.find('button').on('click', self.onPagerClick);

                    }
                },

                onPaginationClick: function (e) {
                    e.preventDefault();
                    var button = $(e.currentTarget),
                        index = self.dom.pagerListItems.index(button);

                    self.carousel.slide(index);
                },

                onSlideChange: function (index) {
                    if (index >= self.dom.slideCount) {
                        index = 0;
                    }
                    self.currentPage = index;

                    if (self.settings.hasPagination && self.dom.slideCount > 1) {
                        self.dom.pagerListItems.removeClass(self.settings.activePageClass).eq(self.currentPage).addClass(self.settings.activePageClass);
                    }
                },

                returnToFirstSlide: function() {
                    if (self.carousel.getPos() !== 0) {
                        self.carousel.slide(0);
                    }
                }

            };

            return self;
        };

        return {
            create: function() {
                var c = function() {
                };
                c.prototype = proto();

                return new c();
            }
        };
    })();
});
