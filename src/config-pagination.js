/* global mixitup, h */

/**
 * A group of properties defining the mixer's pagination behavior.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        pagination
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigPagination = function() {

    /**
     * @name        generatePageList
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.generatePageList = true;

    /**
     * @name        generatePageStats
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.generatePageStats = true;

    /**
     * @name        maintainActivePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.maintainActivePage = true;

    /**
     * @name        loop
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.loop = false;

    /**
     * @name        hidePageListIfSinglePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.hidePageListIfSinglePage = false;

    /**
     * @name        hidePageStatsIfSinglePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.hidePageStatsIfSinglePage = false;

    /**
     * @name        limit
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.limit = -1;

    /**
     * A number dictating the maximum number of individual pager controls to render before
     * truncating the list.
     *
     * @name        maxPagers
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {number}
     * @default     5
     */

    this.maxPagers = 5;

    h.seal(this);
};