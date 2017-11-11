/* globals mixitup */

mixitup.Events.registerAction('afterConstruct', 'pagination', function() {
    /**
     * A custom event triggered whenever a pagination operation starts.
     *
     * @name        paginateStart
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.paginateStart = null;

    /**
     * A custom event triggered whenever a pagination operation ends.
     *
     * @name        paginateEnd
     * @memberof    mixitup.Events
     * @static
     * @type        {CustomEvent}
     */

    this.paginateEnd = null;
});

mixitup.events = new mixitup.Events();