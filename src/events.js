mixitup.Events.prototype.addAction('construct', 'pagination', function() {
    this.mixPagerClick = null;
}, 1);

// Rebuild and overwrite the `mixitup.events` singleton

mixitup.events = new mixitup.Events();