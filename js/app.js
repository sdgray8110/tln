/**
 * main and config
 *
 * Require configuration and definition of main
 */
require.config({
    // Increase the wait time before giving up on a script
    waitSeconds: 15,
    baseUrl: 'js',
    paths: {
        // Core Libraries
        'async': 'lib/require_async',
        jquery: 'lib/jquery-1.11.1.min',
        mustache: 'lib/mustache',
        serializeObject: 'lib/serializeObject'
    }
}); // end require.config

define(['jquery'], function($) {
    require(['global'], function(Global) {
        Global.init();

        window.global = Global;
    });

    return $;
});