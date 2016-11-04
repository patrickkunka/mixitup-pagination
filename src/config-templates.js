/* global mixitup */

mixitup.ConfigTemplates.registerAction('afterConstruct', 'pagination', function() {
    this.pager                = '<button type="button" class="${classNames}" data-page="${pageNumber}">${pageNumber}</button>';
    this.pagerPrev            = '<button type="button" class="${classNames}" data-page="prev">&laquo;</button>';
    this.pagerNext            = '<button type="button" class="${classNames}" data-page="next">&raquo;</button>';
    this.pagerTruncationMarker = '<span class="${classNames}">&hellip;</span>';
    this.pageStats            = '${startPageAt} to ${endPageAt} of ${totalTargets}';
    this.pageStatsSingle      = '${startPageAt} of ${totalTargets}';
    this.pageStatsFail        = 'None found';
});