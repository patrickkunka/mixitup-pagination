/* global mixitup */

/**
 * A group of optional callback functions to be invoked at various
 * points within the lifecycle of a mixer operation.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        callbacks
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigCallbacks.registerAction('afterConstruct', 'pagination', function() {
    /**
     * A callback function invoked whenever a pagination operation starts.
     *
     * This function is equivalent to `onMixStart`, and is invoked immediately
     * after it with the same arguments. Unlike `onMixStart` however, it will
     * not be invoked for filter or sort operations.
     *
     *
     * @name        onPaginateStart
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onPaginateStart = null;

    /**
     * A callback function invoked whenever a pagination operation ends.
     *
     * This function is equivalent to `onMixEnd`, and is invoked immediately
     * after it with the same arguments. Unlike `onMixEnd` however, it will
     * not be invoked for filter or sort operations.
     *
     * @name        onPaginateStart
     * @memberof    mixitup.Config.callbacks
     * @instance
     * @type        {function}
     * @default     null
     */

    this.onPaginateEnd = null;
});