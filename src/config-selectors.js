/* global mixitup */

/**
 * A group of properties defining the selectors used to query elements within a mixitup container.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        selectors
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigSelectors.registerAction('afterConstruct', 'pagination', function() {
    /**
     * A selector string used to query the page list element.
     *
     * Depending on the value of `controls.scope`, MixItUp will either query the
     * entire document for the page list element, or just the container.
     *
     * @name        pageList
     * @memberof    mixitup.Config.selectors
     * @instance
     * @type        {string}
     * @default     '.mixitup-page-list'
     */

    this.pageList  = '.mixitup-page-list';

    /**
     * A selector string used to query the page stats element.
     *
     * Depending on the value of `controls.scope`, MixItUp will either query the
     * entire document for the page stats element, or just the container.
     *
     * @name        pageStats
     * @memberof    mixitup.Config.selectors
     * @instance
     * @type        {string}
     * @default     '.mixitup-page-stats'
     */

    this.pageStats = '.mixitup-page-stats';
});