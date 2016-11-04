/* global mixitup, h */

mixitup.ConfigPagination = function() {
    this.generatePageList           = true;
    this.generatePageStats          = true;
    this.maintainActivePage         = true;
    this.loop                       = false;
    this.hidePageListIfSinglePage   = false;
    this.hidePageStatsIfSinglePage  = false;
    this.limit                      = -1;
    this.maxPagers                  = 5;

    h.seal(this);
};