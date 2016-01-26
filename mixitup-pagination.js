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

(function(window, undf) {
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
            this.maxPagers              = 5;
            this.pagerClass             = '';
            this.prevButtonHTML         = '&laquo;';
            this.nextButtonHTML         = '&raquo;';
            this.maintainActivePage     = true;

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
            this.pagerList          = '.pager-list';
            this.pager              = '.pager';
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

        mixitup.Mixer.prototype.addAction('_init', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            self._state.limit       = self.pagination.limit;
            self._state.activePage  = self.load.page;
        }, 1);

        mixitup.Mixer.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (typeof self.pagination.maxPagers === 'number') {
                // Restrict max pagers to a minimum of 5

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

            pager = h.closestParent(e.target, self.selectors.pager, true);

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
            });

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

                if (!target._isShown) {
                    operation.toHide.splice(i, 1);

                    target._isShown = false;

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

                if (target._isShown) {
                    // If currently shown, move to `toHide`

                    operation.toHide.push(target);
                }
            }
        }, 1);

        mixitup.Mixer.prototype.addAction('getOperation', 'pagination', function(operation) {
            var self            = this,
                command         = null,
                paginateCommand = null;

            if (!self.pagination || self.pagination.limit < 0) return;

            command         = operation.command;
            paginateCommand = command.paginate;

            operation.startPage  = operation.newPage  = operation.startState.activePage;
            operation.startLimit = operation.newLimit = operation.startState.limit;

            operation.startTotalPages = operation.startState.totalPages;

            if (paginateCommand) {
                self._parsePaginationCommand(paginateCommand, operation);
            } else if (command.filter !== undf || command.sort !== undf) {
                // No other functionality is taking place that could affect
                // the active page, reset to 1, or maintain active:

                if (!self.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self._state.activePage;
                }
            }

            if (self.pagination.generatePagers && self._dom.pagersList) {
                // Update the pagers

                self._generatePagers(operation);
            }
        }, 0);

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

                if (self._state.activePage >= self._state.totalPages) {
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

                if (self._state.activePage <= self._state.totalPages) {
                    page = self.pagination.loop ? self._state.totalPages : self._state.activePage;
                }

                return page;
            },

            /**
             * @private
             * @param   {Operation}     operation
             * @return  {void}
             */

            _generatePagers: function(operation) {
                // TODO: replace all of this with some sort of templating concept

                var self                = this,
                    pagerTag            = self._dom.pagerList.nodeName === 'UL' ? 'li' : 'span',
                    pagerClass          = self.pagination.pagerClass ? self.pagination.pagerClass+' ' : '',
                    prevButtonHTML      = '',
                    nextButtonHTML      = '',
                    pagerButtonsHTML    = '',
                    pagersHTML          = '',
                    totalButtons        = (
                        self.pagination.maxPagers !== false &&
                        operation.newTotalPages > self.pagination.maxPagers
                    ) ?
                        self.pagination.maxPagers :
                        operation.newTotalPages;

                prevButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-prev" data-page="prev"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';
                prevButtonHTML = (operation.newPage > 1) ?
                    prevButtonHTML : self.pagination.loop ? prevButtonHTML :
                        '<'+pagerTag+' class="'+pagerClass+'pager page-prev disabled"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';

                nextButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-next" data-page="next"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';
                nextButtonHTML = (operation.newPage < self._totalPages) ?
                    nextButtonHTML : self.pagination.loop ? nextButtonHTML :
                        '<'+pagerTag+' class="'+pagerClass+'pager page-next disabled"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';

                self._execAction('_generatePagers', 0);

                // TODO: this method needs a major refactor - some sort of templating system would be better

                for (var i = 0; i < totalButtons; i++) {
                    var pagerNumber = null,
                        classes     = '';

                    if(i === 0) {
                        pagerNumber = 1;
                        if(
                            self.pagination.maxPagers !== false &&
                            operation.newPage > (self.pagination.maxPagers - 2) &&
                            operation.newTotalPages > self.pagination.maxPagers
                        ){
                            classes = ' page-first';
                        }
                    } else {
                        if (
                            self.pagination.maxPagers === false ||
                            totalButtons < self.pagination.maxPagers
                        ) {
                            pagerNumber = i + 1;
                        } else {
                            if (i === self.pagination.maxPagers - 1) {
                                pagerNumber = operation.newTotalPages;

                                if (operation.newPage < operation.newTotalPages - 2 && operation.newTotalPages > self.pagination.maxPagers) {
                                    classes = ' page-last';
                                }
                            } else {
                                if (
                                    operation.newPage > self.pagination.maxPagers - 2 &&
                                    operation.newPage < operation.newTotalPages - 2
                                ) {
                                    pagerNumber = operation.newPage - (2 - i);
                                } else if (operation.newPage < self.pagination.maxPagers - 1) {
                                    pagerNumber = i + 1;
                                } else if (operation.newPage >= operation.newTotalPAges - 2) {
                                    pagerNumber = operation.newTotalPAges - (self.pagination.maxPagers - 1 - i);
                                }
                            }
                        }
                    }

                    classes = (pagerNumber == operation.newPage) ? classes+' '+self.controls.activeClass : classes;

                    pagerButtonsHTML += '<'+pagerTag+' class="'+pagerClass+'pager page-number'+classes+'" data-page="'+pagerNumber+'"><span>'+pagerNumber+'</span></'+pagerTag+'> ';
                }

                pagersHTML = operation.newTotalPages > 1 ? prevButtonHTML+' '+pagerButtonsHTML+' '+nextButtonHTML : '';

                self._dom.pagerList.innerHTML = pagersHTML;

                if (operation.newTotalPages > 1) {
                    h.removeClass(self._dom.pagerList, 'no-pagers'); // this should be configurable
                } else {
                    h.addClass(self._dom.pagerList, 'no-pagers');
                }

                self._execAction('_generatePagers', 1);
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

                return self._execFilter('_parsePaginateArgs', instruction, arguments);
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