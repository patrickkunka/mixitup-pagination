/* global mixitup, h */

mixitup.ConfigPagination = function() {
    this.loop                       = false;
    this.generatePageList           = true;
    this.generatePageStats          = true;
    this.maintainActivePage         = true;
    this.hidePageListIfSinglePage   = false;
    this.hidePageStatsIfSinglePage  = false;
    this.limit                      = Infinity;
    this.maxPagers                  = 5;

    h.seal(this);
};