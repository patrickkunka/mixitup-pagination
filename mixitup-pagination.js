/* global define */
/**!
 * MixItUp Pagination v2.0.0
 * A Premium Extension for MixItUp
 *
 * Requires mixitup.js >= 3.0.0
 *
 * @copyright Copyright 2015 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   To be used under the same terms as MixItUp core.
 *            https://mixitup.kunkalabs.com/licenses/
 */

(function(window) {
    'use strict';

    var mixItUpPagination = null;

    mixItUpPagination = function(mixitup) {
        var h = mixitup.h;

        if (
            !mixitup.CORE_VERSION ||
            !h.compareVersions(mixItUpPagination.REQUIRE_CORE_VERSION, mixitup.CORE_VERSION)
        ) {
            throw new Error(
                '[MixItUp-Pagination] MixItUp Pagination v' +
                mixItUpPagination.EXTENSION_VERSION +
                ' requires at least MixItUp v' +
                mixItUpPagination.REQUIRE_CORE_VERSION
            );
        }

        // Define new config object:

        mixitup.ConfigPagination = function() {
            this.limit                  = -1;
            this.loop                   = false;
            this.generatePagers         = true;
            this.maxPagers              = Infinity;
            this.maintainActivePage     = true;
            this.pagerClass             = 'mixitup-pager';
            this.pagerClassDisabled     = 'mixitup-pager-disabled';
            this.pagerClassFirst        = 'mixitup-pager-first';
            this.pagerClassLast         = 'mixitup-pager-last';
            this.pagerPrevClass         = 'mixitup-pager-prev';
            this.pagerNextClass         = 'mixitup-pager-next';
            this.pagerListClassDisabled = 'mixitup-pager-list-disabled';
            this.templatePager          = '<span class="{{classes}}" data-page="{{pageNumber}}">{{pageNumber}}</span>';
            this.templatePrevPage       = '<span class="{{classes}}" data-page="prev">&laquo;</span>';
            this.templateNextPage       = '<span class="{{classes}}" data-page="next">&raquo;</span>';
            this.templateEllipses       = '&hellip;';

            h.seal(this);
        };

        // Extend constructors:

        mixitup.Config.prototype.addAction('construct', 'pagination', function() {
            this.pagination         = new mixitup.ConfigPagination();
        });

        mixitup.Mixer.prototype.addAction('construct', 'pagination', function() {
            this.pagination         = new mixitup.ConfigPagination();
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

        mixitup.ConfigSelectors.prototype.addAction('construct', 'pagination', function() {
            this.pagerList          = '.mixitup-pager-list';
        }, 1);

        mixitup.ConfigCallbacks.prototype.addAction('construct', 'pagination', function() {
            this.onMixPagerClick    = null;
        }, 1);

        mixitup.ConfigLoad.prototype.addAction('construct', 'pagination', function() {
            this.page               = 1;
        }, 1);

        mixitup.MixerDom.prototype.addAction('construct', 'pagination', function() {
            this.pagerList          = null;
        }, 1);

        // Extend mixitup.Mixer methods:

        mixitup.Mixer.prototype.addFilter('_init', 'pagination', function(state, args) {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) {
                return state;
            }

            state.limit       = self.pagination.limit;
            state.activePage  = self.load.page;

            return state;
        });

        mixitup.Mixer.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (typeof self.pagination.maxPagers === 'number') {
                // Restrict max pagers to a minimum of 5. There must always
                // be a first, last, and one on either side of the active pager.
                // e.g. « 1 ... 4 5 6 ... 10 »

                self.pagination.maxPagers = Math.max(5, self.pagination.maxPagers);
            }
        }, 1);

        mixitup.Mixer.prototype.addAction('_cacheDom', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (!self.pagination.generatePagers) return;

            self._dom.pagerList = self._dom.document.querySelector(self.selectors.pagerList);
        }, 1);

        mixitup.Mixer.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            // As MixItUp always builds the pager list itself, we will only bind it once,
            // regardless of whether or not `controls.live` is enabled. Users should not
            // be programatically adding and removing pagers, unless they are going
            // exclusively through the API.

            h.on(self._dom.pagerList, 'click', self._handler);
        }, 1);

        mixitup.Mixer.prototype.addAction('_unbindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            h.off(self._dom.pagerList, 'click', self._handler);
        }, 0);

        mixitup.Mixer.prototype.addAction('_handleClick', 'pagination', function(args) {
            var self        = this,
                pageCommand = '',
                pageNumber  = -1,
                pager       = null,
                e           = args[0];

            if (!self.pagination || self.pagination.limit < 0) return;

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

            if (typeof self.callbacks.onMixPagerClick === 'function') {
                self.callbacks.onPagerClick.call(pager, self._state, self, e);
            }

            h.triggerCustom(self._dom.container, 'mixPagerClick', {
                state: self._state,
                instance: self,
                event: e
            }, self._dom.document);

            self.paginate(pageNumber);
        }, 1);

        mixitup.Mixer.prototype.addFilter('_buildState', 'pagination', function(state, args) {
            var self        = this,
                operation   = args[0];

            if (!self.pagination || self.pagination.limit < 0) {
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

            if (!self.pagination || operation.newLimit < 0) return;

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
            // from args - at has to be passed directly in the mixer. A todo has
            // been placed there for consideration too.

            if (!self.pagination || self.pagination.limit < 0) return;

            command         = operation.command;
            paginateCommand = command.paginate;

            operation.startPage  = operation.newPage  = operation.startState.activePage;
            operation.startLimit = operation.newLimit = operation.startState.limit;

            operation.startTotalPages = operation.startState.totalPages;

            if (paginateCommand) {
                self._parsePaginationCommand(paginateCommand, operation);
            } else if (typeof command.filter !=='undefined' || typeof command.sort !== 'undefined') {
                // No other functionality is taking place that could affect
                // the active page, reset to 1, or maintain active:

                if (!self.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self._state.activePage;
                }
            }
        }, 0);

        mixitup.Mixer.prototype.addFilter('getOperation', 'pagination', function(operation) {
            var self = this;

            if (self.pagination.generatePagers && self._dom.pagerList) {
                // Update the pagers

                self._renderPagers(operation);
            }

            return operation;
        });

        // Add new mixitup.Mixer methods:

        mixitup.Mixer.prototype.extend({

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
                    pagerHtml           = '',
                    buttonList          = [],
                    classList           = [],
                    html                = '',
                    i                   = -1;

                // Render prev button

                classList.push(self.pagination.pagerClass);
                classList.push(self.pagination.pagerPrevClass);

                // If first and not looping, disable the prev button

                if (operation.newPage === 1 && !self.pagination.loop) {
                    classList.push(self.pagination.pagerClassDisabled);
                }

                pagerHtml = self.pagination.templatePrevPage.replace(/{{classes}}/g, classList.join(' '));

                buttonList.push(pagerHtml);

                // Render per-page pagers

                for (i = 0; i < operation.newTotalPages; i++) {
                    buttonList.push(self._renderPager(i, operation));
                }

                // Render next button

                classList = [];

                classList.push(self.pagination.pagerClass);
                classList.push(self.pagination.pagerNextClass);

                // If last page and not looping, disable the next button

                if (operation.newPage === operation.newTotalPages && !self.pagination.loop) {
                    classList.push(self.pagination.pagerClassDisabled);
                }

                pagerHtml = self.pagination.templateNextPage.replace(/{{classes}}/g, classList.join(' '));

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

                // « 1 ... 4 *5* 6 ... 10 »         maxPagers = 5
                // « 1 ... 3 4 *5* 6 ... 10 »       maxPagers = 6
                // « 1 ... 3 4 *5* 6 7 ... 10 »     maxPagers = 7
                // « *1* 2 3 4 5 6 ... 10 »         maxPagers = 7

                // Max pagers essentially means that directly surrounding the active pager at
                // any time, are a maximum of max - 2 siblings (padding range), evenly distributed (accounting for first and last)

                // If the first or last is also the active pager, then that value increases to max - 1 siblings

                // By default we would try to split that figure and place an even amount on either side of the active pager

                // If the active pager is too close to the front or back for this to work, we offset as needed

                // If the figure is an even number, the remainder is placed behind the active pager.. hmm how?

                // Suggest creating an array of valid indices before hand, then checking against it if exists

                // - calculate "padding range"
                // - Insert 0 into array to mark first pager as allowed
                // - Find the center of the padding range and assign it as active pager. If even range, Ceil the center as above.
                // - If the first index of the padding range is less/equal 0, offset until 1
                // - If the last number of the padding range is greater/equal than totalPages, negative offset until within range
                // - (both can't be true)
                // - Map indices into array from start index, for the padding range
                // - Map last into array to mark last pager

                if (
                    self.pagination.maxPagers < Infinity &&
                    allowedIndices &&
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

                output = self.pagination.templatePager
                    .replace(/{{classes}}/g, classList.join(' '))
                    .replace(/{{pageNumber}}/g, (i + 1));

                return output;
            },

            /**
             * @private
             * @param   {*[]}       args
             * @return  {Object}    instruction
             */

            _parsePaginateArgs: function(args) {
                var self        = this,
                    instruction = new mixitup.UserInstruction();

                instruction.animate = self.animation.enable;

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];

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

                return self.multiMix({paginate: instruction.command}, instruction.animate, instruction.callback);
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            nextPage: function() {
                var self        = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: 'next'}, instruction.animate, instruction.callback);
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            prevPage: function() {
                var self = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: 'prev'}, instruction.animate, instruction.callback);
            }
        });
    };

    mixItUpPagination.EXTENSION_VERSION       = '2.0.0';
    mixItUpPagination.REQUIRE_CORE_VERSION    = '3.0.0';

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixItUpPagination;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixItUpPagination;
        });
    } else if (window.mixitup && typeof window.mixitup === 'function') {
        mixItUpPagination(window.mixitup);
    } else {
        console.error('[MixItUp-pagination] MixItUp core not found');
    }
})(window);