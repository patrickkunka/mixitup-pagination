/* global mixitup, h */

mixitup.ModelPager = function() {
    this.pageNumber         = -1;
    this.classnames         = '';
    this.classlist          = [];
    this.isDisabled         = false;
    this.isPrev             = false;
    this.isNext             = false;
    this.isTruncationMarker = false;

    h.seal(this);
};