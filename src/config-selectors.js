/* global mixitup */

mixitup.ConfigSelectors.registerAction('afterConstruct', 'pagination', function() {
    this.pageList  = '.mixitup-page-list';
    this.pageStats = '.mixitup-page-stats';
});