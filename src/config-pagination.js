/* global mixitup, h */

// {{{{raw}}}}
mixitup.ConfigPagination = function() {
    this.loop                       = false;
    this.generatePagers             = true;
    this.generateStats              = true;
    this.maintainActivePage         = true;
    this.limit                      = Infinity;
    this.maxPagers                  = 5;
    this.templatePager              = '<span class="{{classes}}" data-page="{{pageNumber}}">{{pageNumber}}</span>';
    this.templatePrevPage           = '<span class="{{classes}}" data-page="prev">&laquo;</span>';
    this.templateNextPage           = '<span class="{{classes}}" data-page="next">&raquo;</span>';
    this.templatePageStats          = '{{startPageAt}} to {{endPageAt}} of {{totalTargets}}';
    this.templatePageStatsSingle    = '{{startPageAt}} of {{totalTargets}}';
    this.templatePageStatsFail      = 'None found';
    this.templateTruncated          = '&hellip;';

    h.seal(this);
};
// {{{{/raw}}}}