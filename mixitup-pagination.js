/**!
 * MixItUp Pagination v2.0.0
 * A Premium Extension for MixItUp
 *
 * @copyright Copyright 2014 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   To be used under the same terms as MixItUp core.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 * @depends   mixitup.js >= 3.0.0
 */

(function(window, undf) {
    'use strict';

    var applyExtension = null;

    applyExtension = function(mixItUp) {
        var UserInstruction = mixItUp.prototype.UserInstruction,
            Operation       = mixItUp.prototype.Operation,
            Target          = mixItUp.prototype.Target,
            Mixer           = mixItUp.prototype.Mixer,
            State           = mixItUp.prototype.State,
            _h              = mixItUp.prototype._h;

        /* Constructors
        ---------------------------------------------------------------------- */

        /**
         * Mixer
         * @priority 1
         */

        Mixer.prototype.addAction('_constructor', 'pagination', function() {
            var self = this;

            _h.extend(self, {
                selectors: {
                    pagersWrapper: '.pager-list',
                    pager: '.pager'
                },
                pagination: {
                    limit: -1,
                    loop: false,
                    generatePagers: true,
                    maxPagers: 5,
                    pagerClass: '',
                    prevButtonHTML: '&laquo;',
                    nextButtonHTML: '&raquo;',
                    pagersWrapperIsChild: true,
                    maintainActivePage: true
                },
                callbacks: {
                    onPagerClick: null
                },
                load: {
                    page: 1
                },
                _dom: {
                    pagersWrapper: null
                }
            });
        }, 1);

        /**
         * Operation
         * @priority 1
         */

        Operation.prototype.addAction('_constructor', 'pagination', function() {
            var self = this;

            _h.extend(this, {
                startPage: -1,
                newPage: -1,
                startLimit: -1,
                newLimit: -1,
                startTotalPages: -1,
                newTotalPages: -1
            });
        }, 1);

        /**
         * State
         * @priority 1
         */

        State.prototype.addAction('_constructor', 'pagination', function() {
            var self = this;

            _h.extend(this, {
                limit: -1,
                activePage: -1,
                totalPages: -1
            });
        }, 1);

        /* Methods
        ---------------------------------------------------------------------- */

        /**
         * _init
         * @priority 1
         */

        Mixer.prototype.addAction('_init', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            self._state.limit       = self.pagination.limit;
            self._state.activePage  = self.load.page;
        }, 1);

        /**
         * _cacheDom
         */

        /**
         * _getFinalMixData
         * @priority 1
         */

        Mixer.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            self.pagination.maxPagers = (
                typeof self.pagination.maxPagers === 'number' &&
                self.pagination.maxPagers < 5
            ) ?
                5 :
                self.pagination.maxPagers;
        }, 1);

        /**
         * _cacheDom
         * @priority 1
         */

        Mixer.prototype.addAction('_cacheDom', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (self.pagination.generatePagers) {
                self._dom.pagersWrapper = self.pagination.pagersWrapperIsChild ?
                    self._dom.container.querySelector(self.selectors.pagersWrapper) :
                    document.querySelector(self.selectors.pagersWrapper);
            }
        }, 1);

        /**
         * _bindEvents
         * @priority 1
         */

        Mixer.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (!self.controls.live) {
                _h.on(self._dom.pagersWrapper, 'click', self._handler);
            }
        }, 1);

        /**
         * _unbindEvents
         * @priority 0
         */

        Mixer.prototype.addAction('_unbindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            _h.off(self._dom.pagersWrapper, 'click', self._handler);
        }, 0);

        /**
         * _handleClick
         * @param {Mixed[]} args
         * @priority 1
         */

        Mixer.prototype.addAction('_handleClick', 'pagination', function(args) {
            var self        = this,
                pageNumber  = null,
                e           = args[0],
                pageButton  = _h.closestParent(
                    e.target,
                    self.selectors.pager,
                    true
                );

            if (!self.pagination || self.pagination.limit < 0) return;

            if (!pageButton) return;

            pageNumber = pageButton.getAttribute('data-page') || false;

            if (pageNumber === 'prev') {
                pageNumber = self._getPrevPage();
            } else if (pageNumber === 'next') {
                pageNumber = self._getNextPage();
            } else if (pageNumber) {
                pageNumber = pageNumber * 1;
            } else {
                return false;
            }

            if (!_h.hasClass(pageButton, self.controls.activeClass)) {
                if (typeof self.callbacks.onPagerClick === 'function') {
                    self.callbacks.onPagerClick.call(pageButton, self._state, self, e);
                }

                _h.triggerCustom(pageButton, 'pagerClick', {
                    state: self._state,
                    instance: self,
                    event: e
                });

                self.paginate(pageNumber);
            }
        }, 1);

        /**
         * _buildState
         * @param {State} state
         * @param {Mixed[]} args
         * @return {State}
         * @priority 1
         */

        Mixer.prototype.addFilter('_buildState', 'pagination', function(state, args) {
            var self        = this,
                operation   = args[0];

            if (!self.pagination || self.pagination.limit < 0) {
                return state;
            }

            _h.extend(state, {
                limit: operation.newLimit,
                activePage: operation.newPage,
                totalPages: operation.newTotalPages
            });

            return state;
        });

        /**
         * _sort
         * @param {Mixed[]} args
         * @priority 1
         */

        Mixer.prototype.addAction('_sort', 'pagination', function(args) {
            var self        = this,
                operation   = args && args[0];

            if (!self.pagination || self.pagination.limit < 0) return;

            self._printSort(false, operation);
        }, 1);

        /**
         * _filter
         * @param {Mixed[]} args
         * @priority 1
         */

        Mixer.prototype.addAction('_filter', 'pagination', function(args) {
            var self        = this,
                operation   = args && args[0],
                startPageAt = -1,
                endPageAt   = -1,
                inPage      = [],
                notInPage   = [],
                target      = null,
                index       = -1,
                i           = -1;

            if (!self.pagination || self.pagination.limit < 0) return;

            operation.newTotalPages = operation.newLimit ?
                Math.max(Math.ceil(operation.show.length / operation.startLimit), 1) :
                1;

            if (self.pagination.maintainActivePage) {
                operation.newPage = (operation.newPage > operation.newTotalPages) ?
                    operation.newTotalPages :
                    operation.newPage;
            }

            startPageAt = self.pagination.limit * (operation.newPage - 1);
            endPageAt   = (self.pagination.limit * operation.newPage) - 1;

            if (operation.newLimit > -1) {
                for (i = 0; target = operation.show[i]; i++) {
                    // For each target in "show", include in page, only if within the range

                    if (i >= startPageAt && i <= endPageAt) {
                        inPage.push(target);
                    } else {
                        // Else move to "notInPage""

                        notInPage.push(target);
                    }
                }

                // "show" is replaced with "inPage""

                operation.show = inPage;

                // For anything not in page, make sure it is correctly assigned

                for (i = 0; target = operation.toHide[i]; i++) {
                    if (!target._isShown) {
                        operation.toHide.splice(i, 1);

                        target._isShown = false;

                        i--;
                    }
                }

                for (i = 0; target = notInPage[i]; i++) {
                    // For each target not in page, move into "hide"

                    operation.hide.push(target);

                    if ((index = operation.toShow.indexOf(target)) > -1) {
                        // Any targets due to be shown will no longer be shown

                        operation.toShow.splice(index, 1);
                    }

                    if (target._isShown) {
                        // If currently shown, move to "toHide"

                        operation.toHide.push(target);
                    }
                }

                if (operation.willSort) {
                    self._printSort(true, operation);
                }
            }
        }, 1);

        /**
         * getOperation
         * @param {Operation} operation
         * @priority 0
         */

        Mixer.prototype.addAction('getOperation', 'pagination', function(operation) {
            var self            = this,
                command         = null,
                paginateCommand = null;

            if (!self.pagination || self.pagination.limit < 0) return;

            command = operation.command;

            paginateCommand = command.paginate;

            operation.startPage  = operation.newPage  = operation.startState.activePage;
            operation.startLimit = operation.newLimit = operation.startState.limit;

            operation.startTotalPages = operation.startState.totalPages;

            if (paginateCommand) {
                switch (typeof paginateCommand) {
                    case 'object':
                        typeof paginateCommand.page === 'number' && (operation.newPage = paginateCommand.page);
                        typeof paginateCommand.limit === 'number' && (operation.newLimit = paginateCommand.limit);

                        if (operation.newLimit !== operation.startLimit) {
                            operation.newTotalPages = operation.newLimit ?
                                Math.max(Math.ceil(operation.show.length / operation.newLimit), 1) :
                                1;
                        }

                        if (operation.newPage === 'next') {
                            operation.newPage = self._getNextPage();
                        } else if (operation.newPage === 'prev') {
                            operation.newPage = self._getPrevPage();
                        }

                        break;
                    case 'number':
                        operation.newPage = paginateCommand;

                        // TODO: handle numbers outside available range

                        break;
                    case 'string':
                        // TODO: make this DRYer - repeated above

                        if (paginateCommand === 'next') {
                            operation.newPage = self._getNextPage();
                        } else if (paginateCommand === 'prev') {
                            operation.newPage = self._getPrevPage();
                        }

                        break;
                }
            } else if (command.filter !== undf || command.sort !== undf) {
                if (!self.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self._state.activePage;
                }
            }
        }, 0);

        /**
         * multiMix
         * @param {Operation} operation
         */

        Mixer.prototype.addFilter('multiMix', 'pagination', function(operation) {
            var self = this;

            if (self.pagination.generatePagers && self._dom.pagersWrapper) {
                self._generatePagers(operation);
            }
        });

        /**
         * _cleanUp
         * @priority 1
         */

        Mixer.prototype.addAction('_cleanUp', 'pagination', function() {
            var self = this;

            if (self.pagination.generatePagers && self._dom.pagersWrapper) {
                self._generatePagers(self._lastOperation);
            }
        }, 1);

        /* Add Private Methods
        ---------------------------------------------------------------------- */

        Mixer.prototype.extend({

            /**
             * _getNextPage
             * @return {Number} page
             */

            _getNextPage: function() {
                var self = this,
                    page = self._state.activePage + 1;

                page = self._state.activePage < self._state.totalPages ?
                    page :
                        self.pagination.loop ?
                            1 :
                            self._state.activePage;

                return self._execFilter('_getNextPage', page * 1);
            },

            /**
             * _getPreviousPage
             * @return {Number} page
             */

            _getPrevPage: function() {
                var self = this,
                    page = self._state.activePage - 1;

                page = self._state.activePage > 1 ?
                    page :
                        self.pagination.loop ?
                            self._state.totalPages :
                            self._state.activePage;

                return self._execFilter('_getPrevPage', page * 1);
            },

            /**
             * _generatePagers
             * @param {Operation} operation
             */

            _generatePagers: function(operation) {
                var self                = this,
                    pagerTag            = self._dom.pagersWrapper.nodeName === 'UL' ? 'li' : 'span',
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

                self._dom.pagersWrapper.innerHTML = pagersHTML;

                if (operation.newTotalPages > 1) {
                    _h.removeClass(self._dom.pagersWrapper, 'no-pagers');
                } else {
                    _h.addClass(self._dom.pagersWrapper, 'no-pagers');
                }

                self._execAction('_generatePagers', 1);
            },

            /**
             * _parsePaginateArgs
             * @param {Mixed[]} args
             * @return {Object} instruction
             */

            _parsePaginateArgs: function(args) {
                var self        = this,
                    instruction = new UserInstruction();

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
            }
        });

        /* Add Public Methods
        ---------------------------------------------------------------------- */

        Mixer.prototype.extend({

            /**
             * paginate
             * @shorthand multiMix
             * @param {*[]} arguments
             * @return {Promise} -> {State}
             */

            paginate: function() {
                var self = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: instruction.command}, instruction.animate, instruction.callback);
            },

            /**
             * nextPage
             * @shorthand multiMix
             * @param {*[]} arguments
             * @return {Promise} -> {State}
             */

            nextPage: function() {
                var self = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: 'next'}, instruction.animate, instruction.callback);
            },

            /**
             * prevPage
             * @shorthand multiMix
             * @param {*[]} argumentss
             * @return {Promise} -> {State}
             */

            prevPage: function() {
                var self = this,
                    instruction = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: 'prev'}, instruction.animate, instruction.callback);
            }
        });

        return Mixer;
    };


    /* Module Definitions
    ---------------------------------------------------------------------- */

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = applyExtension;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return applyExtension;
        });
    } else if (window.mixItUp && typeof window.mixItUp === 'function') {
        applyExtension(window.mixItUp);
    } else {
        console.error('[MixItUp-pagination] MixItUp core not found');
    }
})(window);