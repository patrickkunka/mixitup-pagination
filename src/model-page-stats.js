/* globals mixitup, h */

mixitup.ModelPageStats = function() {
    this.startPageAt    = -1;
    this.endPageAt      = -1;
    this.totalTargets   = -1;

    h.seal(this);
};