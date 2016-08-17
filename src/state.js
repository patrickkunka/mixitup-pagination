mixitup.State.addAction('construct', 'pagination', function() {
    this.limit              = -1;
    this.page               = -1;
    this.totalPages         = -1;
    this.anchor             = null;
}, 1);