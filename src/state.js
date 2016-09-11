/* global mixitup */

mixitup.State.registerAction('afterConstruct', 'pagination', function() {
    this.activePagination = new mixitup.CommandPaginate();
    this.totalPages       = -1;
});