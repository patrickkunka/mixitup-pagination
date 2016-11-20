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
     * A boolean dictating whether or not MixItUp should render a list of pager controls.
     *
     * If you wish to control pagination functionality via the API, or your own UI, this can be set to `false`.
     *
     * In order for this functionality to work, you must provide MixItUp with a `pageList`
     * element matching the selector defined in `selectors.pageList`. Pager controls will be
     * rendered inside this element as per the templates defined for the `templates.pager`
     * and related configuration options, or if set, a custom render
     * function supplied to the `render.pager` configuration option.
     *
     * @name        generatePageList
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.generatePageList = true;

    /**
     * A boolean dictating whether or not MixItUp should render a stats about the
     * current page (e.g. "1 to 4 of 16").
     *
     * In order for this functionality to work, you must provide MixItUp with a `pageStats`
     * element matching the selector defined in `selectors.pageStats`. Page stats content will
     * be rendered inside this element as per the templates defined for the `templates.pageStats`
     * and `templates.pageStatsSingle` configuration options, or if set, a custom render
     * function supplied to the `render.pageStats` configuration option.
     *
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