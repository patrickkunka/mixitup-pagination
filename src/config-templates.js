/* global mixitup */

mixitup.ConfigTemplates.registerAction('afterConstruct', 'pagination', function() {
    // {{{{raw}}}}
    this.pager                = '<button type="button" class="{{classnames}}" data-page="{{pageNumber}}">{{pageNumber}}</button>';
    this.pagerPrev            = '<button type="button" class="{{classnames}}" data-page="prev">&laquo;</button>';
    this.pagerNext            = '<button type="button" class="{{classnames}}" data-page="next">&raquo;</button>';
    this.pagerTruncationMarker = '<span class="{{classnames}}">&hellip;</span>';
    this.pageStats            = '{{startPageAt}} to {{endPageAt}} of {{totalTargets}}';
    this.pageStatsSingle      = '{{startPageAt}} of {{totalTargets}}';
    this.pageStatsFail        = 'None found';
    // {{{{/raw}}}}
});