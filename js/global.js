define('global', function(require) {
    'use strict';

    return (function() {
        var self = {

            cacheDom: function() {
                self.dom = {};
                self.dom.primaryNav = $('.primary-navigation');
                self.dom.topLevelNavLinks = self.dom.primaryNav.find('.top-level');
            },

            attachHandlers: function() {
                self.dom.topLevelNavLinks.on('mouseenter', self.navOver);
                self.dom.topLevelNavLinks.on('mouseleave', self.navOut);
            },

            init: function() {
                self.loadComponents();
                self.cacheDom();
                self.attachHandlers();
            },

            loadComponents: function() {
                var components = JSON.parse(document.getElementById('js_components').innerText),
                    len = components.length,
                    names = [];

                if (len) {
                    for (var i = 0; i < len; i++) {
                        names.push('components/' + components[i]);
                    }

                    return require(names);
                }
            },

            navOver: function(e) {
                var el = $(e.currentTarget).find('.sub-navigation');

                el.fadeIn();
            },

            navOut: function(e) {
                var el = $(e.currentTarget).find('.sub-navigation');

                el.fadeOut();
            }
        };

        return self;
    })();
});