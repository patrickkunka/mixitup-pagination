/* global mixitup */

mixitup.State.registerAction('afterConstruct', 'pagination', function() {
    this.limit              = -1;
    this.page               = -1;
    this.totalPages         = -1;
    this.anchor             = null;
});