/* global mixitup */

mixitup.Operation.registerAction('afterConstruct', 'pagination', function() {
    this.startPage          = -1;
    this.newPage            = -1;
    this.startLimit         = -1;
    this.newLimit           = -1;
    this.startTotalPages    = -1;
    this.newTotalPages      = -1;
    this.startAnchor        = null;
    this.newAnchor          = null;
});