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
        jquery:    'lib/jquery-1.11.1.min'
    }
}); // end require.config

require(['jquery'], function($) {
    return $;
});
require(['global'], function(Global) {
    Global.init();

    return Global;
});