/* global mixitup */

/**
 * `mixitup.State` objects expose various pieces of data detailing the state of
 * a MixItUp instance. They are provided at the start and end of any operation via
 * callbacks and events, with the most recent state stored between operations
 * for retrieval at any time via the API.
 *
 * @constructor
 * @namespace
 * @name        State
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.State.registerAction('afterConstruct', 'pagination', function() {

    /**
     * The currently active pagination command as set by a control click or API call.
     *
     * @name        activePagination
     * @memberof    mixitup.State
     * @instance
     * @type        {mixitup.CommandPagination}
     * @default     null
     */

    this.activePagination = null;

    /**
     * The total number of pages produced as a combination of the current page
     * limit and active filter.
     *
     * @name        totalPages
     * @memberof    mixitup.State
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.totalPages = -1;
});