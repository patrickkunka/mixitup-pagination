/* global mixitup */

mixitup.ConfigRender.registerAction('afterConstruct', 'pagination', function() {
    this.pager = null;
    this.pageStats = null;
});