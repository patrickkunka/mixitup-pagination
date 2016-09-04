/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup
 * @private
 * @since       3.0.0
 */

mixitup.CommandPaginate = function() {
    this.page   = -1;
    this.limit  = -1;
    this.goTo   = '';
    this.anchor = null;

    h.seal(this);
};