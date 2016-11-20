/* global mixitup */

/**
 * A group of optional render functions for creating and updating elements.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        render
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigRender.registerAction('afterConstruct', 'pagination', function() {
    /**
     * A function returning an HTML string representing a single pager control element.
     *
     * By default, MixItUp will render pager controls using its own internal renderer
     * and templates (see `templates.pager`), but you may override this functionality by
     * providing your own render function here instead. All pager elements must have a
     * data-page element indicating the action of the control.
     *
     * The function receives an object containing all neccessary information
     * about the pager as its first parameter.
     *
     * @name        pager
     * @memberof    mixitup.Config.render
     * @instance
     * @type        {function}
     * @default     'null'
     */

    this.pager = null;

    /**
     * A function returning an HTML string forming the contents of the "page stats" element.
     *
     * By default, MixItUp will render page stats using its own internal renderer
     * and templates (see `templates.pageStats`), but you may override this functionality by
     * providing your own render function here instead.
     *
     * The function receives an object containing all neccessary information
     * about the current page and total pages as its first parameter.
     *
     * @name        pageStats
     * @memberof    mixitup.Config.render
     * @instance
     * @type        {function}
     * @default     'null'
     */

    this.pageStats = null;
});