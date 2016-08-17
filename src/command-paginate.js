/* global mixitup, h */

mixitup.CommandPaginate = function() {
    this.page   = -1;
    this.limit  = -1;
    this.goTo   = '';
    this.anchor = null;

    h.seal(this);
};