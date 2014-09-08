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
        jquery: 'lib/jquery-1.11.1.min',
        mustache: 'lib/mustache',
        serializeObject: 'lib/serializeObject'
    }
}); // end require.config

define(['jquery'], function($) {
    require(['global'], function(Global) {
        Global.init();

        return Global;
    });

    require(['mustache'], function(Mustache) {
        window.Mustache = Mustache;

        return Mustache;
    });

    require(['serializeObject']);

    return $;
});