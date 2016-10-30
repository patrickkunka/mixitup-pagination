/* global mixitup */

mixitup.State.registerAction('afterConstruct', 'pagination', function() {
    this.activePagination = null;
    this.totalPages       = -1;
});