define('global', function(require) {
    'use strict';

    var Global = (function() {
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
                self.loadModules();
                self.cacheDom();
                self.attachHandlers();
            },

            loadModules: function() {
                var modules = JSON.parse(document.getElementById('js_modules').innerText),
                    len = modules.length;

                if (len) {
                    for (var i = 0; i < len; i++) {
                        require(['modules/' + modules[i]]);
                    }
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

    return Global;
});