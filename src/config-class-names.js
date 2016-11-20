/* global mixitup */

/**
 * A group of properties defining the output and structure of class names programmatically
 * added to controls and containers to reflect the state of the mixer.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        classNames
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigClassNames.registerAction('afterConstruct', 'pagination', function() {

    /**
     * The "element" portion of the class name added to pager controls.
     *
     * @example <caption>Example: changing the `config.classNames.elementPager` value</caption>
     *
     * // Change from the default value of 'control' to 'pager'
     *
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementPager: 'pager'
     *     }
     * });
     *
     * // Base pager output: "mixitup-pager"
     *
     * @name        elementPager
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'control'
     */

    this.elementPager = 'control';

    /**
     * The "element" portion of the class name added to the page list element, when it is
     * in its disabled state.
     *
     * The page list element is the containing element in which pagers are rendered.
     *
     * @example <caption>Example: changing the `config.classNames.elementPageList` value</caption>
     *
     * // Change from the default value of 'page-list' to 'pagination-links'
     *
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementPageList: 'pagination-links'
     *     }
     * });
     *
     * // Disabled page-list output: "mixitup-pagination-links-disabled"
     *
     * @name        elementPageList
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'page-list'
     */

    this.elementPageList = 'page-list';

    /**
     * The "element" portion of the class name added to the page stats element, when it is
     * in its disabled state.
     *
     * The page stats element is the containing element in which information about the
     * current page and total number of pages is rendered.
     *
     * @example <caption>Example: changing the `config.classNames.elementPageStats` value</caption>
     *
     * // Change from the default value of 'page-stats' to 'pagination-info'
     *
     * var mixer = mixitup(containerEl, {
     *     classNames: {
     *         elementPageList: 'pagination-info'
     *     }
     * });
     *
     * // Disabled page-list output: "mixitup-pagination-info-disabled"
     *
     * @name        elementPageStats
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'page-stats'
     */

    this.elementPageStats = 'page-stats';

    /**
     * The "modifier" portion of the class name added to the first pager in the list of pager controls.
     *
     * @name        modifierFirst
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'first'
     */

    this.modifierFirst = 'first';

    /**
     * The "modifier" portion of the class name added to the last pager in the list of pager controls.
     *
     * @name        modifierLast
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'last'
     */

    this.modifierLast = 'last';

    /**
     * The "modifier" portion of the class name added to the previous pager in the list of pager controls.
     *
     * @name        modifierLast
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'prev'
     */

    this.modifierPrev = 'prev';

    /**
     * The "modifier" portion of the class name added to the next pager in the list of pager controls.
     *
     * @name        modifierNext
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'next'
     */

    this.modifierNext = 'next';

    /**
     * The "modifier" portion of the class name added to truncation markers in the list of pager controls.
     *
     * @name        modifierTruncationMarker
     * @memberof    mixitup.Config.classNames
     * @instance
     * @type        {string}
     * @default     'truncation-marker'
     */

    this.modifierTruncationMarker = 'truncation-marker';
});