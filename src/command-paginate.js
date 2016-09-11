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
    this.action = ''; // enum: ['prev', 'next']
    this.anchor = null;

    h.seal(this);
};