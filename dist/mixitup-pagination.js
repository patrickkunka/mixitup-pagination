/**!
 * MixItUp Pagination v2.0.0-beta
 * A premium extension for MixItUp
 * Build afa2656b-ceb4-445d-a3ce-d9b47f59d730
 *
 * Requires mixitup.js >= v3.0.0
 *
 * @copyright Copyright 2014-2016 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://kunkalabs.com/mixitup-pagination/
 *
 * @license   Commercial use requires a commercial license.
 *            https://kunkalabs.com/mixitup/licenses
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
        mixitup.ConfigCallbacks.prototype.addAction('construct', 'pagination', function() {
            this.onMixPagerClick = null;
        }, 1);
        mixitup.ConfigLoad.prototype.addAction('construct', 'pagination', function() {
            this.page = 1;
        }, 1);
        //
        mixitup.ConfigPagination = function() {
            this.loop                       = false;
            this.generatePagers             = true;
            this.generateStats              = true;
            this.maintainActivePage         = true;
            this.limit                      = Infinity;
            this.maxPagers                  = Infinity;
            this.pagerClass                 = 'mixitup-pager';
            this.pagerClassDisabled         = 'mixitup-pager-disabled';
            this.pagerClassFirst            = 'mixitup-pager-first';
            this.pagerClassLast             = 'mixitup-pager-last';
            this.pagerPrevClass             = 'mixitup-pager-prev';
            this.pagerNextClass             = 'mixitup-pager-next';
            this.pagerListClassDisabled     = 'mixitup-pager-list-disabled';
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
        mixitup.ConfigSelectors.prototype.addAction('construct', 'pagination', function() {
            this.pagerList = '.mixitup-pager-list';
            this.pageStats = '.mixitup-page-stats';
        }, 1);
        mixitup.Config.prototype.addAction('construct', 'pagination', function() {
            this.pagination = new mixitup.ConfigPagination();
        });
        mixitup.Operation.prototype.addAction('construct', 'pagination', function() {
            this.startPage          = -1;
            this.newPage            = -1;
            this.startLimit         = -1;
            this.newLimit           = -1;
            this.startTotalPages    = -1;
            this.newTotalPages      = -1;
        }, 1);
        mixitup.State.prototype.addAction('construct', 'pagination', function() {
            this.limit              = -1;
            this.activePage         = -1;
            this.totalPages         = -1;
        }, 1);
        mixitup.MixerDom.prototype.addAction('construct', 'pagination', function() {
            this.pagerList = null;
            this.pageStats = null;
        }, 1);
        mixitup.Events.prototype.addAction('construct', 'pagination', function() {
            this.mixPagerClick = null;
        }, 1);

        // Rebuild and overwrite the `mixitup.events` singleton

        mixitup.events = new mixitup.Events();

        mixitup.Mixer.prototype.addAction('construct', 'pagination', function() {
            this.pagination = new mixitup.ConfigPagination();
        });

        mixitup.Mixer.prototype.addFilter('_init', 'pagination', function(state, args) {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.newLimit === Infinity) {
                return state;
            }

            state.limit       = self.pagination.limit;
            state.activePage  = self.load.page;

            return state;
        });

        mixitup.Mixer.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.newLimit === Infinity) return;

            if (typeof self.pagination.maxPagers === 'number') {
                // Restrict max pagers to a minimum of 5. There must always
                // be a first, last, and one on either side of the active pager.
                // e.g. « 1 ... 4 5 6 ... 10 »

                self.pagination.maxPagers = Math.max(5, self.pagination.maxPagers);
            }
        }, 1);

        mixitup.Mixer.prototype.addAction('_cacheDom', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

            if (!self.pagination.generatePagers) return;

            if (!(self._dom.pagerList = self._dom.container.querySelector(self.selectors.pagerList))) {
                // Attempt to find page stats container within the container to begin with, else
                // query entire DOM

                self._dom.pagerList = self._dom.document.querySelector(self.selectors.pagerList);
            }

            if (!(self._dom.pageStats = self._dom.container.querySelector(self.selectors.pageStats))) {
                // Attempt to find page stats container within the container to begin with, else
                // query entire DOM

                self._dom.pageStats = self._dom.document.querySelector(self.selectors.pageStats);
            }
        }, 1);

        mixitup.Mixer.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

            // As MixItUp always builds the pager list itself, we will only bind it once,
            // regardless of whether or not `controls.live` is enabled. Users should not
            // be programatically adding and removing pagers, unless they are going
            // exclusively through the API.

            h.on(self._dom.pagerList, 'click', self._handler);
        }, 1);

        mixitup.Mixer.prototype.addAction('_unbindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

            h.off(self._dom.pagerList, 'click', self._handler);
        }, 0);

        mixitup.Mixer.prototype.addAction('_handleClick', 'pagination', function(args) {
            var self            = this,
                returnValue     = null,
                pageCommand     = '',
                pageNumber      = -1,
                pager           = null,
                e               = args[0];

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

            pager = h.closestParent(e.target, '.' + self.pagination.pagerClass, true, self._dom.document);

            if (!pager) return;

            pageCommand = pager.getAttribute('data-page') || '';

            if (pageCommand === 'prev') {
                pageNumber = self._getPrevPage();
            } else if (pageCommand === 'next') {
                pageNumber = self._getNextPage();
            } else if (pageNumber) {
                pageNumber = parseInt(pageCommand);
            } else {
                return;
            }

            if (h.hasClass(pager, self.controls.activeClass)) return;

            self._state.triggerElement = pager;

            mixitup.events.fire('mixPagerClick', self._dom.container, {
                state: self._state,
                instance: self,
                event: e
            }, self._dom.document);

            if (typeof self.callbacks.onMixPagerClick === 'function') {
                returnValue = self.callbacks.onMixPagerClick.call(pager, self._state, self, e);

                if (returnValue === false) {
                    // User has returned `false` from the callback, so do not execute paginate command

                    return;
                }
            }

            self.paginate(pageNumber);
        }, 1);

        mixitup.Mixer.prototype.addFilter('_buildState', 'pagination', function(state, args) {
            var self        = this,
                operation   = args[0];

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) {
                return state;
            }

            state.limit         = operation.newLimit;
            state.activePage    = operation.newPage;
            state.totalPages    = operation.newTotalPages;

            return state;
        });

        mixitup.Mixer.prototype.addAction('_filter', 'pagination', function(args) {
            var self        = this,
                operation   = args && args[0],
                startPageAt = -1,
                endPageAt   = -1,
                inPage      = [],
                notInPage   = [],
                target      = null,
                index       = -1,
                i           = -1;

            if (!self.pagination || operation.newLimit < 0 || operation.newLimit === Infinity) return;

            // Calculate the new total pages as a matter of course (i.e. a change in filter)

            // New matching array has already been set at this point

            operation.newTotalPages = operation.newLimit ?
                Math.max(Math.ceil(operation.matching.length / operation.newLimit), 1) :
                1;

            if (self.pagination.maintainActivePage) {
                operation.newPage = (operation.newPage > operation.newTotalPages) ?
                    operation.newTotalPages :
                    operation.newPage;
            }

            self.pagination.limit = operation.newLimit;

            startPageAt = operation.newLimit * (operation.newPage - 1);
            endPageAt   = (operation.newLimit * operation.newPage) - 1;

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

        mixitup.Mixer.prototype.addAction('getOperation', 'pagination', function(operation) {
            var self            = this,
                command         = null,
                paginateCommand = null;

            // TODO: this should really be a filter as we don't pull in operation
            // from args - as has to be passed directly in the mixer. A todo has
            // been placed there for consideration too.

            if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

            command         = operation.command;
            paginateCommand = command.paginate;

            operation.startPage  = operation.newPage  = operation.startState.activePage;
            operation.startLimit = operation.newLimit = operation.startState.limit;

            operation.startTotalPages = operation.startState.totalPages;

            if (paginateCommand) {
                self._parsePaginationCommand(paginateCommand, operation);
            } else if (typeof command.filter !== 'undefined' || typeof command.sort !== 'undefined') {
                // No other functionality is taking place that could affect
                // the active page, reset to 1, or maintain active:

                if (!self.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self._state.activePage;
                }
            }
        }, 0);

        mixitup.Mixer.prototype.addFilter('getOperation', 'pagination', function(operation, args) {
            var self        = this,
                isPreFetch  = false;

            if (!self.pagination) {
                return operation;
            }

            if (args && typeof args[1] === 'boolean') {
                isPreFetch = true;

                // The operation is being pre-fetched, so don't update the pagers or stats yet.

                return operation;
            }

            if (self.pagination.generatePagers && self._dom.pagerList) {
                self._renderPagers(operation);
            }

            if (self.pagination.generateStats && self._dom.pageStats) {
                self._renderStats(operation);
            }

            return operation;
        });

        mixitup.Mixer.prototype.extend(
        /** @lends mixitup.Mixer */
        {
            /**
             * @private
             * @param   {object}              command
             * @param   {mixitup.Operation}   operation
             * @return  {void}
             */

            _parsePaginationCommand: function(command, operation) {
                var self = this;

                switch (typeof command) {
                    case 'object':
                        // e.g. mixer.paginate({page: 3, limit: 2});

                        typeof command.page === 'number' && (operation.newPage = command.page);
                        typeof command.limit === 'number' && (operation.newLimit = command.limit);

                        if (operation.newLimit !== operation.startLimit) {
                            // A new limit has been sent via the API, calculate total pages

                            operation.newTotalPages = operation.newLimit ?
                                Math.max(Math.ceil(operation.startState.matching.length / operation.newLimit), 1) :
                                1;
                        }

                        if (operation.newPage === 'next') {
                            operation.newPage = self._getNextPage();
                        } else if (operation.newPage === 'prev') {
                            operation.newPage = self._getPrevPage();
                        }

                        break;
                    case 'number':
                        // e.g. mixer.paginate(3);

                        command = Math.max(1, Math.min(Infinity, command));

                        // TODO: replace Infinity with the highest possible page index

                        operation.newPage = command;

                        break;
                    case 'string':
                        // e.g. mixer.paginate('next');

                        if (command === 'next') {
                            operation.newPage = self._getNextPage();
                        } else if (command === 'prev') {
                            operation.newPage = self._getPrevPage();
                        }

                        break;
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

                page = self._state.activePage + 1;

                if (page > self._state.totalPages) {
                    page = self.pagination.loop ? 1 : self._state.activePage;
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

                page = self._state.activePage - 1;

                if (page < 1) {
                    page = self.pagination.loop ? self._state.totalPages : self._state.activePage;
                }

                return page;
            },

            /**
             * @private
             * @param   {Operation}     operation
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

                    self._dom.pagerList.innerHTML = '';

                    h.addClass(self._dom.pagerList, self.pagination.pagerListClassDisabled);

                    return;
                }

                activeIndex = operation.newPage - 1;

                if (self.pagination.maxPagers < Infinity && operation.newTotalPages > self.pagination.maxPagers) {
                    allowedIndices = self._getAllowedIndices(operation);
                }

                // Render prev button

                classList.push(self.pagination.pagerClass);
                classList.push(self.pagination.pagerPrevClass);

                // If first and not looping, disable the prev button

                if (operation.newPage === 1 && !self.pagination.loop) {
                    classList.push(self.pagination.pagerClassDisabled);
                }

                //
                pagerHtml = self.pagination.templatePrevPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Render per-page pagers

                for (i = 0; i < operation.newTotalPages; i++) {
                    pagerHtml = self._renderPager(i, operation, allowedIndices);

                    // Replace gaps between pagers with a truncation maker, but only once

                    if (!pagerHtml && i < activeIndex && !truncatedBefore) {
                        pagerHtml = self.pagination.templateTruncated;

                        truncatedBefore = true;
                    }

                    if (!pagerHtml && i > activeIndex && !truncatedAfter) {
                        pagerHtml = self.pagination.templateTruncated;

                        truncatedAfter = true;
                    }

                    buttonList.push(pagerHtml);
                }

                // Render next button

                classList = [];

                classList.push(self.pagination.pagerClass);
                classList.push(self.pagination.pagerNextClass);

                // If last page and not looping, disable the next button

                if (operation.newPage === operation.newTotalPages && !self.pagination.loop) {
                    classList.push(self.pagination.pagerClassDisabled);
                }

                //
                pagerHtml = self.pagination.templateNextPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Replace markup

                html = buttonList.join(' ');

                self._dom.pagerList.innerHTML = html;

                if (operation.newTotalPages > 1) {
                    h.removeClass(self._dom.pagerList, self.pagination.pagerListClassDisabled);
                } else {
                    h.addClass(self._dom.pagerList, self.pagination.pagerListClassDisabled);
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

                paddingRange  = self.pagination.maxPagers - 2;

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
                    self.pagination.maxPagers < Infinity &&
                    allowedIndices.length &&
                    allowedIndices.indexOf(i) < 0
                ) {
                    // maxPagers is set, and this pager is not in the allowed range

                    return '';
                }

                classList.push(self.pagination.pagerClass);

                if (i === 0) {
                    classList.push(self.pagination.pagerClassFirst);
                }

                if (i === operation.newTotalPages - 1) {
                    classList.push(self.pagination.pagerClassLast);
                }

                if (i === activePage) {
                    classList.push(self.controls.activeClass);
                }

                //
                output = self.pagination.templatePager
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

                    h.addClass(self._dom.pageStats, self.pagination.pageStatsClassDisabled);

                    return;
                }

                totalTargets = operation.matching.length;

                if (totalTargets) {
                    template = operation.newLimit === 1 ?
                        self.pagination.templatePageStatsSingle :
                        self.pagination.templatePageStats;
                } else {
                    template = self.pagination.templatePageStatsFail;
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
                    h.removeClass(self._dom.pageStats, self.pagination.pageStatsClassDisabled);
                } else {
                    h.addClass(self._dom.pageStats, self.pagination.pageStatsClassDisabled);
                }
            },

            /**
             * @private
             * @param   {*[]}       args
             * @return  {Object}    instruction
             */

            _parsePaginateArgs: function(args) {
                var self        = this,
                    instruction = new mixitup.UserInstruction(),
                    arg         = null,
                    i           = -1;

                instruction.animate = self.animation.enable;

                for (i = 0; i < args.length; i++) {
                    arg = args[i];

                    if (arg !== null) {
                        if (typeof arg === 'object' || typeof arg === 'number') {
                            instruction.command = arg;
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
                    paginate: 'next'
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
                    paginate: 'prev'
                }, instruction.animate, instruction.callback);
            }
        });    };

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