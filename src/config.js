/* global mixitup */

/**
 * The MixItUp configuration object is extended with the following properties
 * relating to the Pagination extension.
 *
 * For the full list of configuration options, please refer to the MixItUp
 * core documentation.
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