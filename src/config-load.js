/* global mixitup */

/**
 * A group of properties defining the initial state of the mixer on load (instantiation).
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
     * An integer defining the starting page on load, if a page limit is active.
     *
     * @example <caption>Example: Defining a start page other than 1 to be applied on load</caption>
     *
     * // The mixer will show page 3 on load, with 8 items per page.
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8
     *     },
     *     load: {
     *         page: 3
     *     }
     * });
     *
     * @name        page
     * @memberof    mixitup.Config.load
     * @instance
     * @type        {number}
     * @default     1
     */

    this.page = 1;
});