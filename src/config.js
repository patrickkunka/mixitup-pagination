/* global mixitup */

mixitup.Config.registerAction('beforeConstruct', 'pagination', function() {
    this.pagination = new mixitup.ConfigPagination();
});