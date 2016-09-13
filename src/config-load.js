/* global mixitup */

/**
 * The `config.load` object is extended with properties relating to the pagination extension.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        load
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigLoad.registerAction('afterConstruct', 'pagination', function() {
    /**
     * @name        page
     * @memberof    mixitup.Config.load
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.page = 1;
});