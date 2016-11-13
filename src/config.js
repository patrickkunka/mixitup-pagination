/* global mixitup */

/**
 * The MixItUp configuration object is extended with properties relating to pagination functionality.
 *
 * @constructor
 * @memberof    mixitup
 * @name        Config
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.Config.registerAction('beforeConstruct', 'pagination', function() {
    this.pagination = new mixitup.ConfigPagination();
});