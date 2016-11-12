/* global mixitup */

/**
 * The MixItUp configuration object is extended with properties relating to pagination functionality.
 *
 * @constructor
 * @memberof    mixitup
 * @namespace
 * @public
 * @since       2.0.0
 */

var Config = function() {
    this.pagination = new mixitup.ConfigPagination();
};

mixitup.Config.registerAction('beforeConstruct', 'pagination', Config);