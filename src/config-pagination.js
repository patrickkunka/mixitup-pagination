/* global mixitup, h */

/**
 * @constructor
 * @memberof    mixitup.Config
 * @name        pagination
 * @namespace
 * @public
 * @since       2.0.0
 */

mixitup.ConfigPagination = function() {

    /**
     * @name        generatePageList
     * @memberof    mixitup.Config.pagination
     * @instance
     * @type        {boolean}
     * @default     true
     */

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