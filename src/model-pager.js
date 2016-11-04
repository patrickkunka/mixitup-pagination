/* global mixitup, h */

mixitup.ModelPager = function() {
    this.pageNumber         = -1;
    this.classNames         = '';
    this.classList          = [];
    this.isDisabled         = false;
    this.isPrev             = false;
    this.isNext             = false;
    this.isPageLink         = false;
    this.isTruncationMarker = false;

    h.seal(this);
};