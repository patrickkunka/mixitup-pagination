/* global mixitup */

/**
 * A group of template strings used to render pager controls and page stats elements.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        templates
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigTemplates.registerAction('afterConstruct', 'pagination', function() {
    /**
     * @name        pager
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '<button type="button" class="${classNames}" data-page="${pageNumber}">${pageNumber}</button>'
     */

    this.pager = '<button type="button" class="${classNames}" data-page="${pageNumber}">${pageNumber}</button>';

    /**
     * @name        pagerPrev
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '<button type="button" class="${classNames}" data-page="prev">&laquo;</button>'
     */

    this.pagerPrev = '<button type="button" class="${classNames}" data-page="prev">&laquo;</button>';

    /**
     * @name        pagerNext
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '<button type="button" class="${classNames}" data-page="next">&raquo;</button>'
     */

    this.pagerNext = '<button type="button" class="${classNames}" data-page="next">&raquo;</button>';

    /**
     * @name        pagerTruncationMarker
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '<span class="${classNames}">&hellip;</span>'
     */

    this.pagerTruncationMarker = '<span class="${classNames}">&hellip;</span>';

    /**
     * @name        pageStats
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '${startPageAt} to ${endPageAt} of ${totalTargets}'
     */

    this.pageStats = '${startPageAt} to ${endPageAt} of ${totalTargets}';

    /**
     * @name        pageStatsSingle
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     '${startPageAt} of ${totalTargets}'
     */

    this.pageStatsSingle = '${startPageAt} of ${totalTargets}';

    /**
     * @name        pageStatsFail
     * @memberof    mixitup.Config.templates
     * @instance
     * @type        {string}
     * @default     'None found'
     */

    this.pageStatsFail = 'None found';
});