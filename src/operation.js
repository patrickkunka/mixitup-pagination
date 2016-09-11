/* global mixitup */

mixitup.Operation.registerAction('afterConstruct', 'pagination', function() {
    this.startPagination    = null;
    this.newPagination      = null;
    this.startTotalPages    = -1;
    this.newTotalPages      = -1;
});