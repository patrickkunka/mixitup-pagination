/**!
 * MixItUp Pagination v2.0.0-beta
 *
 * Build b8b56e2d-75ab-403f-a447-e4e84bfd8a6f
 *
 * Requires mixitup.js >= v3.0.0
 *
 * @copyright Copyright 2014-2016 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://www.kunkalabs.com/mixitup-pagination/
 *
 * @license   Commercial use requires a commercial license.
 *            https://www.kunkalabs.com/mixitup-pagination/licenses/
 *
 *            Non-commercial use permitted under same terms as  license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function(window) {
    'use strict';

    var mixitupPagination = function(mixitup) {
        var h = mixitup.h;

        if (
            !mixitup.CORE_VERSION ||
            !h.compareVersions(mixitupPagination.REQUIRE_CORE_VERSION, mixitup.CORE_VERSION)
        ) {
            throw new Error(
                '[MixItUp-Pagination] MixItUp Pagination v' +
                mixitupPagination.EXTENSION_VERSION +
                ' requires at least MixItUp v' +
                mixitupPagination.REQUIRE_CORE_VERSION
            );
        }

        mixitup.ConfigLoad.addAction('construct', 'pagination', function() {
            this.page = 1;
        }, 1);

        //
        mixitup.ConfigPagination = function() {
            this.loop                       = false;
            this.generatePagers             = true;
            this.generateStats              = true;
            this.maintainActivePage         = true;
            this.limit                      = Infinity;
            this.maxPagers                  = 5;
            this.pagerClass                 = 'mixitup-pager';
            this.pagerClassDisabled         = 'mixitup-pager-disabled';
            this.pagerClassFirst            = 'mixitup-pager-first';
            this.pagerClassLast             = 'mixitup-pager-last';
            this.pagerPrevClass             = 'mixitup-pager-prev';
            this.pagerNextClass             = 'mixitup-pager-next';
            this.pagerListClassDisabled     = 'mixitup-pager-list-disabled';
            this.pagerListClassTruncated    = 'mixitup-pager-list-truncated';
            this.pageStatsClassDisabled     = 'mixitup-page-stats-disabled';
            this.templatePager              = '<span class="{{classes}}" data-page="{{pageNumber}}">{{pageNumber}}</span>';
            this.templatePrevPage           = '<span class="{{classes}}" data-page="prev">&laquo;</span>';
            this.templateNextPage           = '<span class="{{classes}}" data-page="next">&raquo;</span>';
            this.templatePageStats          = '{{startPageAt}} to {{endPageAt}} of {{totalTargets}}';
            this.templatePageStatsSingle    = '{{startPageAt}} of {{totalTargets}}';
            this.templatePageStatsFail      = 'None found';
            this.templateTruncated          = '&hellip;';

            h.seal(this);
        };
        //

        mixitup.ConfigSelectors.addAction('construct', 'pagination', function() {
            this.pageList  = '.mixitup-page-list';
            this.pageStats = '.mixitup-page-stats';
        }, 1);

        mixitup.Config.addAction('construct', 'pagination', function() {
            this.pagination = new mixitup.ConfigPagination();
        });

        mixitup.controlDefinitions.push(new mixitup.ControlDefinition('paginate', '[data-page]', true, 'pageList'));

        /**
         * @param   {mixitup.MultimixCommand[]} commands
         * @param   {ClickEvent}                e
         * @return  {object|null}
         */

        mixitup.Control.addFilter('handleClick', 'pagination', function(commands, e) {
            var self            = this,
                command         = {},
                page            = '',
                pageNumber      = -1,
                mixer           = null,
                button          = null,
                i               = -1;

            if (!self.selector) return commands;

            button = h.closestParent(e.target, self.selector, true, self.bound[0]._dom.document);

            for (i = 0; mixer = self.bound[i]; i++) {
                command = commands[i];

                if (!mixer.config.pagination || mixer.config.pagination.limit < 0 || mixer.config.pagination.newLimit === Infinity) {
                    // Pagination is disabled for this instance. Do not handle.

                    commands[i] = null;
                }

                if (!button || h.hasClass(button, mixer.config.controls.activeClass)) {
                    // No button was clicked or button is already active. Do not handle.

                    commands[i] = null;
                }

                page = button.getAttribute('data-page');

                if (page === 'prev') {
                    command.paginate = 'prev';
                } else if (page === 'next') {
                    command.paginate = 'next';
                } else if (pageNumber) {
                    command.paginate = parseInt(page);
                }

                if (mixer._lastClicked) {
                    mixer._lastClicked = button;
                }
            }

            return commands;
        });

        mixitup.CommandMultimix.addAction('construct', 'pagination', function() {
            this.paginate = null;
        }, 1);

        /**
         * @constructor
         * @memberof    mixitup
         * @private
         * @since       3.0.0
         */

        mixitup.CommandPaginate = function() {
            this.page   = -1;
            this.limit  = -1;
            this.goTo   = '';
            this.anchor = null;

            h.seal(this);
        };

        mixitup.Operation.addAction('construct', 'pagination', function() {
            this.startPage          = -1;
            this.newPage            = -1;
            this.startLimit         = -1;
            this.newLimit           = -1;
            this.startTotalPages    = -1;
            this.newTotalPages      = -1;
            this.startAnchor        = null;
            this.newAnchor          = null;
        }, 1);

        mixitup.State.addAction('construct', 'pagination', function() {
            this.limit              = -1;
            this.page               = -1;
            this.totalPages         = -1;
            this.anchor             = null;
        }, 1);

        mixitup.MixerDom.addAction('construct', 'pagination', function() {
            this.pageList  = null;
            this.pageStats = null;
        }, 1);

        /**
         * @private
         * @param   {mixitup.State} state
         * @return  {mixitup.State}
         */

        mixitup.Mixer.addFilter('_init', 'pagination', function(state) {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.newLimit === Infinity) {
                return state;
            }

            state.limit = self.config.pagination.limit;
            state.page  = self.config.load.page;

            return state;
        });

        /**
         * @private
         * @return  {void}
         */

        mixitup.Mixer.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.newLimit === Infinity) return;

            if (typeof self.config.pagination.maxPagers === 'number') {
                // Restrict max pagers to a minimum of 5. There must always
                // be a first, last, and one on either side of the active pager.
                // e.g. « 1 ... 4 5 6 ... 10 »

                self.config.pagination.maxPagers = Math.max(5, self.config.pagination.maxPagers);
            }
        }, 1);

        /**
         * @private
         * @return  {void}
         */

        mixitup.Mixer.addAction('_cacheDom', 'pagination', function() {
            var self    = this,
                parent  = null;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) return;

            if (!self.config.pagination.generatePagers) return;

            switch (self.config.controls.scope) {
                case 'local':
                    parent = self._dom.container;

                    break;
                case 'global':
                    parent = self._dom.document;

                    break;
                default:
                    throw new Error(mixitup.messages[102]);
            }

            self._dom.pageList  = parent.querySelector(self.config.selectors.pageList);
            self._dom.pageStats = parent.querySelector(self.config.selectors.pageStats);
        }, 1);

        /**
         * @private
         * @param   {mixitup.State}     state
         * @param   {mixitup.Operation} operation
         * @return  {mixitup.State}
         */

        mixitup.Mixer.addFilter('_buildState', 'pagination', function(state, operation) {
            var self        = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) {
                return state;
            }

            // Map pagination-specific properties into state

            state.limit         = operation.newLimit;
            state.page          = operation.newPage;
            state.anchor        = operation.newAnchor;
            state.totalPages    = operation.newTotalPages;

            return state;
        });

        /**
         * @private
         * @param   {mixitup.Operation} operation
         * @return  {void}
         */

        mixitup.Mixer.addAction('_filter', 'pagination', function(operation) {
            var self        = this,
                startPageAt = -1,
                endPageAt   = -1,
                inPage      = [],
                notInPage   = [],
                target      = null,
                index       = -1,
                i           = -1;

            if (!self.config.pagination || operation.newLimit < 0 || operation.newLimit === Infinity) return;

            // Calculate the new total pages as a matter of course (i.e. a change in filter)

            // New matching array has already been set at this point

            operation.newTotalPages = operation.newLimit ?
                Math.max(Math.ceil(operation.matching.length / operation.newLimit), 1) :
                1;

            if (self.config.pagination.maintainActivePage) {
                operation.newPage = (operation.newPage > operation.newTotalPages) ?
                    operation.newTotalPages :
                    operation.newPage;
            }

            self.config.pagination.limit = operation.newLimit;

            if (operation.newAnchor) {
                // Start page at an anchor element

                for (i = 0; target = operation.matching[i]; i++) {
                    if (target.dom.el === operation.newAnchor) break;
                }

                startPageAt = i;
                endPageAt   = i + operation.newLimit - 1;
            } else {
                // Start page based on limit and page index

                startPageAt = operation.newLimit * (operation.newPage - 1);
                endPageAt   = (operation.newLimit * operation.newPage) - 1;
            }

            if (operation.newLimit < 0) return;

            for (i = 0; target = operation.show[i]; i++) {
                // For each target in `show`, include in page, only if within the range

                if (i >= startPageAt && i <= endPageAt) {
                    inPage.push(target);
                } else {
                    // Else move to `notInPage`

                    notInPage.push(target);
                }
            }

            // override the operation's `show` array with the newly constructed `inPage` array

            operation.show = inPage;

            // For anything not in the page, make sure it is correctly assigned:

            for (i = 0; target = operation.toHide[i]; i++) {
                // For example, if a target would normally be included in `toHide`, but is
                // now already hidden as not in the page, make sure it is removed from `toHide`
                // so it is not included in the operation.

                if (!target.isShown) {
                    operation.toHide.splice(i, 1);

                    target.isShown = false;

                    i--;
                }
            }

            for (i = 0; target = notInPage[i]; i++) {
                // For each target not in page, move into `hide`

                operation.hide.push(target);

                if ((index = operation.toShow.indexOf(target)) > -1) {
                    // Any targets due to be shown will no longer be shown

                    operation.toShow.splice(index, 1);
                }

                if (target.isShown) {
                    // If currently shown, move to `toHide`

                    operation.toHide.push(target);
                }
            }
        }, 1);

        /**
         * @public
         * @param   {mixitup.Operation}         operation
         * @param   {mixitup.CommandMultimix}   multimixCommand
         * @return  {mixitup.Operation}
         */

        mixitup.Mixer.addFilter('getOperation_unmapped', 'pagination', function(operation, multimixCommand) {
            var self            = this,
                instruction     = null,
                paginateCommand = null;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) {
                return operation;
            }

            instruction     = self._parsePaginateArgs([multimixCommand.paginate]);
            paginateCommand = instruction.command;

            operation.startPage         = operation.newPage     = self._state.page;
            operation.startLimit        = operation.newLimit    = self._state.limit;
            operation.startAnchor       = operation.newAnchor   = self._state.anchor;
            operation.startTotalPages                           = self._state.totalPages;

            if (paginateCommand) {
                self._parsePaginationCommand(paginateCommand, operation);
            } else if (typeof multimixCommand.filter !== 'undefined' || typeof multimixCommand.sort !== 'undefined') {
                // No other functionality is taking place that could affect
                // the active page, reset to 1, or maintain active:

                if (!self.config.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self._state.page;
                }
            }

            return operation;
        }, 0);

        /**
         * @public
         * @param   {mixitup.Operation} operation
         * @param   {object}            command
         * @param   {boolean}           [isPreFetch=false]
         * @return  {mixitup.Operation}
         */

        mixitup.Mixer.addFilter('getOperation_mapped', 'pagination', function(operation, command, isPreFetch) {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) {
                return operation;
            }

            if (isPreFetch) {
                // The operation is being pre-fetched, so don't update the pagers or stats yet.

                return operation;
            }

            if (self.config.pagination.generatePagers && self._dom.pageList) {
                self._renderPagers(operation);
            }

            if (self.config.pagination.generateStats && self._dom.pageStats) {
                self._renderStats(operation);
            }

            return operation;
        });

        mixitup.Mixer.extend(
        /** @lends mixitup.Mixer */
        {
            /**
             * @private
             * @param   {mixitup.CommandPaginate}   command
             * @param   {mixitup.Operation}         operation
             * @return  {void}
             */

            _parsePaginationCommand: function(command, operation) {
                var self = this;

                // e.g. mixer.paginate({page: 3, limit: 2});
                // e.g. mixer.paginate({goTo: 'next'});
                // e.g. mixer.paginate({anchor: anchorTarget, limit: 5});

                if (command.page > -1) {
                    if (command.page === 0) throw new Error(mixitup.messages.ERROR_PAGINATION_INDEX_RANGE);

                    // TODO: replace Infinity with the highest possible page index

                    operation.newPage = Math.max(1, Math.min(Infinity, command.page));
                } else if (command.goTo === 'next') {
                    operation.newPage = self._getNextPage();
                } else if (command.goTo === 'prev') {
                    operation.newPage = self._getPrevPage();
                } else if (command.anchor) {
                    operation.newAnchor = command.anchor;
                }

                if (command.limit > -1) {
                    // TODO: Should a limit of `0` be permitted?

                    operation.newLimit = command.limit;
                }

                if (operation.newLimit !== operation.startLimit) {
                    // A new limit has been sent via the API, calculate total pages

                    operation.newTotalPages = operation.newLimit ?
                        Math.max(Math.ceil(operation.startState.matching.length / operation.newLimit), 1) :
                        1;
                }

                if (operation.newLimit < 0 || operation.newLimit === Infinity) {
                    operation.newPage = 1;
                }
            },

            /**
             * @private
             * @return  {number}    page
             */

            _getNextPage: function() {
                var self = this,
                    page = -1;

                page = self._state.page + 1;

                if (page > self._state.totalPages) {
                    page = self.config.pagination.loop ? 1 : self._state.page;
                }

                return page;
            },

            /**
             * @private
             * @return  {Number}    page
             */

            _getPrevPage: function() {
                var self = this,
                    page = -1;

                page = self._state.page - 1;

                if (page < 1) {
                    page = self.config.pagination.loop ? self._state.totalPages : self._state.page;
                }

                return page;
            },

            /**
             * @private
             * @param   {mixitup.Operation}  operation
             * @return  {void}
             */

            _renderPagers: function(operation) {
                var self                = this,
                    activeIndex         = -1,
                    pagerHtml           = '',
                    buttonList          = [],
                    classList           = [],
                    allowedIndices      = [],
                    truncatedBefore     = false,
                    truncatedAfter      = false,
                    html                = '',
                    i                   = -1;

                if (operation.newLimit < 0 || operation.newLimit === Infinity) {
                    // Empty the pager list, and add disabled class

                    self._dom.pageList.innerHTML = '';

                    h.addClass(self._dom.pageList, self.config.pagination.pageListClassDisabled);

                    return;
                }

                activeIndex = operation.newPage - 1;

                if (self.config.pagination.maxPagers < Infinity && operation.newTotalPages > self.config.pagination.maxPagers) {
                    allowedIndices = self._getAllowedIndices(operation);
                }

                // Render prev button

                classList.push(self.config.pagination.pagerClass);
                classList.push(self.config.pagination.pagerPrevClass);

                // If first and not looping, disable the prev button

                if (operation.newPage === 1 && !self.config.pagination.loop) {
                    classList.push(self.config.pagination.pagerClassDisabled);
                }

                //
                pagerHtml = self.config.pagination.templatePrevPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Render per-page pagers

                for (i = 0; i < operation.newTotalPages; i++) {
                    pagerHtml = self._renderPager(i, operation, allowedIndices);

                    // Replace gaps between pagers with a truncation maker, but only once

                    if (!pagerHtml && i < activeIndex && !truncatedBefore) {
                        pagerHtml = self.config.pagination.templateTruncated;

                        truncatedBefore = true;
                    }

                    if (!pagerHtml && i > activeIndex && !truncatedAfter) {
                        pagerHtml = self.config.pagination.templateTruncated;

                        truncatedAfter = true;
                    }

                    buttonList.push(pagerHtml);
                }

                // Render next button

                classList = [];

                classList.push(self.config.pagination.pagerClass);
                classList.push(self.config.pagination.pagerNextClass);

                // If last page and not looping, disable the next button

                if (operation.newPage === operation.newTotalPages && !self.config.pagination.loop) {
                    classList.push(self.config.pagination.pagerClassDisabled);
                }

                //
                pagerHtml = self.config.pagination.templateNextPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Replace markup

                html = buttonList.join(' ');

                self._dom.pageList.innerHTML = html;

                if (truncatedBefore || truncatedAfter) {
                    h.addClass(self._dom.pageList, self.config.pagination.pageListClassTruncated);
                } else {
                    h.removeClass(self._dom.pageList, self.config.pagination.pageListClassTruncated);
                }

                if (operation.newTotalPages > 1) {
                    h.removeClass(self._dom.pageList, self.config.pagination.pageListClassDisabled);
                } else {
                    h.addClass(self._dom.pageList, self.config.pagination.pageListClassDisabled);
                }
            },

            /**
             * An algorithm defining which pagers should be rendered based on their index
             * and the current active page, when a `pagination.maxPagers` value is applied.
             *
             * @private
             * @param   {mixitup.Operation} operation
             * @return  {number[]}
             */

            _getAllowedIndices: function(operation) {
                var self                = this,
                    activeIndex         = operation.newPage - 1,
                    lastIndex           = operation.newTotalPages - 1,
                    indices             = [],
                    paddingRange        = -1,
                    paddingBack         = -1,
                    paddingFront        = -1,
                    paddingRangeStart   = -1,
                    paddingRangeEnd     = -1,
                    paddingRangeOffset  = -1,
                    i                   = -1;

                // Examples:

                // « 1 2 *3* 4 5 »                  maxPagers = 5
                // « 1 ... 4 *5* 6 ... 10 »         maxPagers = 5

                // « 1 ... 6 7 *8* 9 10 »           maxPagers = 6
                // « 1 ... 3 4 *5* 6 ... 10 »       maxPagers = 6

                // « 1 ... 3 4 *5* 6 7 ... 10 »     maxPagers = 7
                // « *1* 2 3 4 5 6 ... 10 »         maxPagers = 7

                // This algorithm ensures that at any time, the active pager
                // should be surrounded by as many "padding" pagers as possible to equal the
                // value of `pagination.maxPagers`, accounting for the fact the first and last
                // pager should also always be rendered.

                // Push in index 0 to represent the first pager

                indices.push(0);

                // Calculate the "padding range" by subtracting 2 from `pagination.maxPagers`

                paddingRange  = self.config.pagination.maxPagers - 2;

                // Distribute the padding equally behind and in front of the active pager.
                // If the padding range is an even number, we allow an extra pager behind the active pager.

                paddingBack   = Math.ceil((paddingRange - 1) / 2);
                paddingFront  = Math.floor((paddingRange - 1) / 2);

                // Calculate where the range should start and finish based on the active index

                paddingRangeStart   = activeIndex - paddingBack;
                paddingRangeEnd     = activeIndex + paddingFront;

                // Set the offset to 0

                paddingRangeOffset  = 0;

                // If the start of the range has collided with the first pager, positively offset as needed

                if (paddingRangeStart < 1) {
                    paddingRangeOffset = 1 - paddingRangeStart;
                }

                // If the end of the range has collided with the last pager, negatively offset as needed

                if (paddingRangeEnd > lastIndex - 1) {
                    paddingRangeOffset = (lastIndex - 1) - paddingRangeEnd;
                }

                // Calcuate the first index of the range taking into account any offset

                i = paddingRangeStart + paddingRangeOffset;

                // Iteratate through the range, adding the respective indices:

                while (paddingRange) {
                    indices.push(i);

                    i++;
                    paddingRange--;
                }

                indices.push(lastIndex);

                return indices;
            },

            /**
             * @private
             * @param   {number}              i
             * @param   {mixitup.Operation}   operation
             * @param   {number[]}            [allowedIndices]
             * @return  {string}
             */

            _renderPager: function(i, operation, allowedIndices) {
                var self        = this,
                    activePage  = operation.newPage - 1,
                    classList   = [],
                    output      = '';

                if (
                    self.config.pagination.maxPagers < Infinity &&
                    allowedIndices.length &&
                    allowedIndices.indexOf(i) < 0
                ) {
                    // maxPagers is set, and this pager is not in the allowed range

                    return '';
                }

                classList.push(self.config.pagination.pagerClass);

                if (i === 0) {
                    classList.push(self.config.pagination.pagerClassFirst);
                }

                if (i === operation.newTotalPages - 1) {
                    classList.push(self.config.pagination.pagerClassLast);
                }

                if (i === activePage) {
                    classList.push(self.config.controls.activeClass);
                }

                //
                output = self.config.pagination.templatePager
                    .replace(/{{classes}}/g, classList.join(' '))
                    .replace(/{{pageNumber}}/g, (i + 1));
                //

                return output;
            },

            /**
             * @private
             * @param   {mixitup.Operation} operation
             * @return  {void}
             */

            _renderStats: function(operation) {
                var self            = this,
                    output          = '',
                    template        = '',
                    startPageAt     = -1,
                    endPageAt       = -1,
                    totalTargets    = -1;

                if (operation.newLimit < 0 || operation.newLimit === Infinity) {
                    // Empty the pager list, and add disabled class

                    self._dom.pageStats.innerHTML = '';

                    h.addClass(self._dom.pageStats, self.config.pagination.pageStatsClassDisabled);

                    return;
                }

                totalTargets = operation.matching.length;

                if (totalTargets) {
                    template = operation.newLimit === 1 ?
                        self.config.pagination.templatePageStatsSingle :
                        self.config.pagination.templatePageStats;
                } else {
                    template = self.config.pagination.templatePageStatsFail;
                }

                startPageAt  = totalTargets ? ((operation.newPage - 1) * operation.newLimit) + 1 : 0;
                endPageAt    = Math.min(startPageAt + operation.newLimit - 1, totalTargets);

                //
                output = template
                    .replace(/{{startPageAt}}/g, startPageAt.toString())
                    .replace(/{{endPageAt}}/g, endPageAt.toString())
                    .replace(/{{totalTargets}}/g, totalTargets.toString());
                //

                self._dom.pageStats.innerHTML = output;

                if (totalTargets) {
                    h.removeClass(self._dom.pageStats, self.config.pagination.pageStatsClassDisabled);
                } else {
                    h.addClass(self._dom.pageStats, self.config.pagination.pageStatsClassDisabled);
                }
            },

            /**
             * @private
             * @param   {Array<*>}                  args
             * @return  {mixitup.UserInstruction}   instruction
             */

            _parsePaginateArgs: function(args) {
                var self        = this,
                    instruction = new mixitup.UserInstruction(),
                    arg         = null,
                    i           = -1;

                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandPaginate();

                for (i = 0; i < args.length; i++) {
                    arg = args[i];

                    if (arg !== null) {
                        if (typeof arg === 'object' && h.isElement(arg, self._dom.document)) {
                            instruction.command.anchor = arg;
                        } else if (arg instanceof mixitup.CommandPaginate || typeof arg === 'object') {
                            h.extend(instruction.command, arg);
                        } else if (typeof arg === 'number') {
                            instruction.command.page = arg;
                        } else if (typeof arg === 'string' && !isNaN(parseInt(arg))) {
                            // e.g. "4"

                            instruction.command.page = parseInt(arg);
                        } else if (typeof arg === 'string') {
                            instruction.command.goTo = arg;
                        } else if (typeof arg === 'boolean') {
                            instruction.animate = arg;
                        } else if (typeof arg === 'function') {
                            instruction.callback = arg;
                        }
                    }
                }

                return instruction;
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            paginate: function() {
                var self        = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({
                    paginate: instruction.command
                }, instruction.animate, instruction.callback);
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            nextPage: function() {
                var self        = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({
                    paginate: {
                        goTo: 'next'
                    }
                }, instruction.animate, instruction.callback);
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            prevPage: function() {
                var self = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({
                    paginate: {
                        goTo: 'prev'
                    }
                }, instruction.animate, instruction.callback);
            }
        });    };

    mixitupPagination.NAME                    = 'mixitup-pagiation'
    mixitupPagination.EXTENSION_VERSION       = '2.0.0-beta';
    mixitupPagination.REQUIRE_CORE_VERSION    = '3.0.0';

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixitupPagination;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixitupPagination;
        });
    } else if (window.mixitup && typeof window.mixitup === 'function') {
        mixitupPagination(window.mixitup);
    } else {
        console.error('[MixItUp-pagination] MixItUp core not found');
    }})(window);