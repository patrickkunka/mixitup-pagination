/* global mixitup */

mixitup.ConfigLoad.registerAction('afterConstruct', 'pagination', function() {
    this.page = 1;
});