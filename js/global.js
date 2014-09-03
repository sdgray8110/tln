define('global', function(require) {
    'use strict';

    var Global = (function() {
        var self = {
            init: function() {
                console.log('Global Started');
            }
        };

        return self;
    })();

    return Global;
});