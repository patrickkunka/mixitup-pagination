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
     * @example <caption>Example: Disabling the rendering of the built-in "page list" UI</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         generatePageList: false
     *     }
     * });
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
     * @example <caption>Example: Disabling the rendering of the built-in "page stats" UI</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         generatePageStats: false
     *     }
     * });
     *
     * @name        generatePageStats
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.generatePageStats = true;

    /**
     * A boolean dictating whether or not to maintain the active page when switching
     * from filter to filter.
     *
     * By default, MixItUp will attempt to maintain the active page or its highest
     * equivalent in the new collection of matching targets (e.g. page 3 would become
     * page 2 if there are not enough targets in the new collection), but by setting
     * this option to `false`, changing the active filter will always cause the mixer
     * to revert to page one of the new collection.
     *
     * @example <caption>Example: Ensuring that the mixer reverts to page one when filtered</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         maintainActivePage: false
     *     }
     * });
     *
     * @name        maintainActivePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

    this.maintainActivePage = true;

    /**
     * A boolean dictating whether or not to allow "looping" of the built-in previous
     * and next pagination controls.
     *
     * By default, when on the first page, the "previous" button will be disabled,
     * and when on the last page, the "next" button will be disabled. By setting
     * this option to `true`, the user may loop from the first to last page and
     * vice-versa.
     *
     * @example <caption>Example: Allowing prev/next controls to "loop" through pages</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         loop: true
     *     }
     * });
     *
     * @name        loop
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.loop = false;

    /**
     * A boolean dictating whether or not to prevent rendering of the built-in
     * "page list" UI if the matching collection of targets has only enough content
     * for one page.
     *
     * @example <caption>Example: Hiding the page list UI if only one page</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         hidePageListIfSinglePage: true
     *     }
     * });
     *
     * @name        hidePageListIfSinglePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.hidePageListIfSinglePage = false;

    /**
     * A boolean dictating whether or not to prevent rendering of the built-in
     * "page stats" UI if the matching collection of targets has only enough content
     * for one page.
     *
     * @example <caption>Example: Hiding the page stats UI if only one page</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8,
     *         hidePageStatsIfSinglePage: true
     *     }
     * });
     *
     * @name        hidePageStatsIfSinglePage
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.hidePageStatsIfSinglePage = false;

    /**
     * A number defining the maximum number of items per page.
     *
     * By default, this is set to `-1` and pagination is effectively
     * disabled. By setting this to any number greater than 0, pagination
     * will be applied to the mixers targets, effectively activating the
     * extension.
     *
     * @example <caption>Example: Activating the pagination extension by defining a valid limit</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     pagination: {
     *         limit: 8
     *     }
     * });
     *
     * @name        limit
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {number}
     * @default     -1
     */

    this.limit = -1;

    /**
     * A number dictating the maximum number of individual pager controls to render before
     * truncating the list (e.g. adding an ellipses between non-consecutive pagers).
     *
     * The minimum value permitted for this option is 5, which ensures
     * there will always be at least a first, last, and two padding pagers, in addition
     * to the pager representing the currently active page.
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