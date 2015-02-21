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
 * @depends   mixitup.js v3.0.0
 */ 

(function($, undf) {
    'use strict';

    var _applyExtension = function(_MixItUp) {
        var _Target = _MixItUp.prototype._Target,
            _h = _MixItUp.prototype._h;
    
        /* Add Actions (_MixItUp)
        ---------------------------------------------------------------------- */
    
        /**
         * _constructor
         * @extends _MixItUp
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_constructor', 'pagination', function() {
            var self = this;

            _h._extend(self, {
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
                load: {
                    page: 1
                },
                _activePage: -1,
                _totalPages: -1,

                _dom: {
                    _pagersWrapper: null
                }
            });
        }, 1);
        
        /**
         * _getFinalMixData
         * @extends _MixItUp.prototype._getFinalMixData
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            self._activePage = self.load.page * 1;
            self.pagination.maxPagers = (
                typeof self.pagination.maxPagers === 'number' && 
                self.pagination.maxPagers < 5
            ) ? 
                5 : 
                self.pagination.maxPagers;
        }, 1);

        /**
         * _cacheDom
         */

        _MixItUp.prototype.addAction('_cacheDom', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (self.pagination.generatePagers) {
                self._dom._pagersWrapper = self.pagination.pagersWrapperIsChild ? 
                    self._dom._container.querySelector(self.selectors.pagersWrapper) :
                    document.querySelector(self.selectors.pagersWrapper);
            }
        }, 1);
        
        /**
         * _bindEvents
         * @extends _MixItUp.prototype._bindEvents
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            if (!self.controls.live) {
                _h._on(self._dom._pagersWrapper, 'click', self._handler);
            }
        }, 1);

        /**
         * _unbindEvents
         * @extends _MixItUp.prototype._unbindHandlers
         * @priority 0
         */
        
        _MixItUp.prototype.addAction('_unbindEvents', 'pagination', function() {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            _h._off(self._dom._pagersWrapper, 'click', self._handler);
        }, 0);
        
        /**
         * _handleClick
         * @extends _MixItUp.prototype._handleClick
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_handleClick', 'pagination', function(args) {
            var self = this,
                pageNumber = null,
                e = args[0],
                pageButton = _h._closestParent(
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
            
            if (!_h._hasClass(pageButton, self.controls.activeClass)) {
                self.paginate(pageNumber);
            }
        }, 1);
        
        /**
         * _buildState
         * @extends _MixItUp.prototype._buildState
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_buildState', 'pagination', function() {
            var self = this; 

            if (!self.pagination || self.pagination.limit < 0) return;

            _h._extend(self._state, {
                limit: self.pagination.limit,
                activePage: self._activePage,
                totalPages: self._totalPages
            });
        }, 1);
        
        _MixItUp.prototype.addFilter('_buildState', 'pagination', function(state) {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            return _h._extend(state, {
                limit: self.pagination.limit,
                activePage: self._activePage,
                totalPages: self._totalPages
            });
        });
        
        /**
         * _sort
         * @extends _MixItUp.prototype._sort
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_sort', 'pagination', function(){
            var self = this;

            if (self.pagination.limit > -1) {
                self._printSort();
            }
        }, 1);
        
        /**
         * _filter
         * @extends _MixItUp.prototype._filter
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_filter', 'pagination', function() {
            var self = this,
                startPageAt = -1,
                endPageAt = -1,
                inPage = [],
                notInPage = [],
                target = null,
                i = -1;

            if (!self.pagination || self.pagination.limit < 0) return;

            self._activePage = self.load.page;
            self._totalPages = self.pagination.limit ? 
                Math.max(Math.ceil(self._show.length / self.pagination.limit), 1) :
                1;

            if (self.pagination.maintainActivePage) {
                self.load.page = self._activePage = (self._activePage > self._totalPages) ?
                    self._totalPages :
                    self._activePage;
            }

            startPageAt = self.pagination.limit * (self.load.page - 1);
            endPageAt = (self.pagination.limit * self.load.page) - 1;

            if (self.pagination.limit > -1) {
                for (i = 0; target = self._show[i]; i++) {
                    if (i >= startPageAt && i <= endPageAt) {
                        inPage.push(target);
                    }
                }

                for (i = 0; target = self._show[i]; i++) {
                    if (i < startPageAt || i > endPageAt) {
                        notInPage.push(target);
                    }
                }

                self._show = inPage;    

                for (i = 0; target = notInPage[i]; i++) {
                    if (self._show.indexOf(target) < 0) {
                        self._hide.push(target);
                    }

                    if (self._toShow.indexOf(target) > -1) {
                        self._toShow.splice(self._toShow.indexOf(target), 1);
                    }

                    if (target._isShown) {
                        self._toHide.push(target);
                    }
                }

                if (self._isSorting) {
                    self._printSort(true);
                }
            }

            if (self.pagination.generatePagers && self._dom._pagersWrapper) {
                self._generatePagers(); 
            }
        }, 1);
        
        /**
         * multiMix
         * @extends _MixItUp.prototype.multiMix
         * @priority 0
         */
        
        _MixItUp.prototype.addAction('multiMix', 'pagination', function(args) {
            var self = this;

            if (!self.pagination || self.pagination.limit < 0) return;

            args = self._parseMultiMixArgs(args);

            if (args.command.paginate !== undf) {
                typeof args.command.paginate === 'object' ? 
                    _h._extend(self.pagination, args.command.paginate) :
                    self.load.page = args.command.paginate;
            } else if (args.command.filter !== undf || args.command.sort !== undf) {
                if (!self.pagination.maintainActivePage) {
                    self.load.page = 1;
                } else {
                    self.load.page = self._activePage;
                }
            }
        }, 0);
    
        /* Add Private Methods
        ---------------------------------------------------------------------- */
        
        _MixItUp.prototype.extend({
            
            /**
             * _getNextPage
             * @return {Number} page
             */

            _getNextPage: function() {
                var self = this,
                    page = self._activePage + 1;

                page = self._activePage < self._totalPages ? 
                    page :
                        self.pagination.loop ?
                            1 :
                            self._activePage;

                return self._execFilter('_getNextPage', page * 1);
            },

            /**
             * _getPreviousPage
             * @return {number} page
             */

            _getPrevPage: function() {
                var self = this,
                    page = self._activePage - 1;

                page = self._activePage > 1 ?
                    page :
                        self.pagination.loop ?
                            self._totalPages :
                            self._activePage;

                return self._execFilter('_getPrevPage', page * 1);
            },

            /**
             * _generatePagers
             */

            _generatePagers: function() {
                var self = this,
                    pagerTag = self._dom._pagersWrapper.nodeName === 'UL' ? 'li' : 'span',
                    pagerClass = self.pagination.pagerClass ? self.pagination.pagerClass+' ' : '',
                    prevButtonHTML = '',
                    nextButtonHTML = '',
                    pagerButtonsHTML = '',
                    pagersHTML = '',
                    totalButtons = (
                        self.pagination.maxPagers !== false &&
                        self._totalPages > self.pagination.maxPagers
                    ) ? 
                        self.pagination.maxPagers : 
                        self._totalPages;
                

                    prevButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-prev" data-page="prev"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';
                    prevButtonHTML = (self._activePage > 1) ? 
                        prevButtonHTML : self.pagination.loop ? prevButtonHTML :
                            '<'+pagerTag+' class="'+pagerClass+'pager page-prev disabled"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';

                    nextButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-next" data-page="next"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';
                    nextButtonHTML = (self._activePage < self._totalPages) ? 
                        nextButtonHTML : self.pagination.loop ? nextButtonHTML :
                            '<'+pagerTag+' class="'+pagerClass+'pager page-next disabled"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';

                self._execAction('_generatePagers', 0);

                for (var i = 0; i < totalButtons; i++) {
                    var pagerNumber = null,
                        classes = '';

                    if(i === 0){
                        pagerNumber = 1;
                        if(
                            self.pagination.maxPagers !== false &&
                            self._activePage > (self.pagination.maxPagers - 2) && 
                            self._totalPages > self.pagination.maxPagers
                        ){
                            classes = ' page-first';
                        }
                    } else {
                        if(
                            self.pagination.maxPagers === false ||
                            totalButtons < self.pagination.maxPagers
                        ){
                            pagerNumber = i + 1;
                        } else {
                            if(i === self.pagination.maxPagers - 1){
                                pagerNumber = self._totalPages;
                                if(self._activePage < self._totalPages - 2 && self._totalPages > self.pagination.maxPagers){
                                    classes = ' page-last';
                                }
                            } else{
                                if(
                                    self._activePage > self.pagination.maxPagers - 2 &&
                                    self._activePage < self._totalPages - 2
                                ){
                                    pagerNumber = self._activePage - (2 - i);
                                } else if(self._activePage < self.pagination.maxPagers - 1){
                                    pagerNumber = i + 1;
                                } else if(self._activePage >= self._totalPages - 2){
                                    pagerNumber = self._totalPages - (self.pagination.maxPagers - 1 - i);
                                }
                            }
                        }
                    }

                    classes = (pagerNumber == self._activePage) ? classes+' '+self.controls.activeClass : classes;

                    pagerButtonsHTML += '<'+pagerTag+' class="'+pagerClass+'pager page-number'+classes+'" data-page="'+pagerNumber+'"><span>'+pagerNumber+'</span></'+pagerTag+'> ';
                }

                pagersHTML = self._totalPages > 1 ? prevButtonHTML+' '+pagerButtonsHTML+' '+nextButtonHTML : '';

                self._dom._pagersWrapper.innerHTML = pagersHTML;

                if (self._totalPages > 1) {
                    _h._removeClass(self._dom._pagersWrapper, 'no-pagers');
                } else {
                    _h._addClass(self._dom._pagersWrapper, 'no-pagers');
                }

                self._execAction('_generatePagers', 1);
            },

            /**
             * _parsePaginateArgs
             * @param {array} args
             * @return {object} output
             */

            _parsePaginateArgs: function(args){
                var self = this,
                    output = {
                        command: null,
                        animate: self.animation.enable,
                        callback: null
                    };

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];

                    if (arg !== null) {   
                        if (typeof arg === 'object' || typeof arg === 'number') {
                            output.command = arg;
                        } else if (typeof arg === 'boolean') {
                            output.animate = arg;
                        } else if (typeof arg === 'function') {
                            output.callback = arg;
                        }
                    }
                }

                return self._execFilter('_parsePaginateArgs', output, arguments);
            }
        });
        
        /* Add Public Methods
        ---------------------------------------------------------------------- */
        
        _MixItUp.prototype.extend({
            
            /**
             * paginate
             * @shorthand self.multiMix
             * @param {Mixed} arguments
             * @return {Object} promise
             */

            paginate: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: args.command}, args.animate, args.callback);
            },

            /**
             * nextPage
             * @shorthand self.multiMix
             * @param {Mixed} arguments
             * @return {Object} promise
             */

            nextPage: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: self._getNextPage()}, args.animate, args.callback);
            },

            /**
             * prevPage
             * @shorthand self.multiMix
             * @param {Mixed} arguments
             * @return {Object} promise
             */

            prevPage: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                return self.multiMix({paginate: self._getPrevPage()}, args.animate, args.callback);
            }
        });

        return _MixItUp;
    };

    /* Module Definitions
    ---------------------------------------------------------------------- */

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = _applyExtension;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return _applyExtension;
        });
    } else if (window.mixItUp && typeof window.mixItUp === 'function') {
        var _MixItUp = window.mixItUp.prototype._MixItUp;

        _applyExtension(_MixItUp);
    } else {
        console.error('[MixItUp] MixItUp core not found');
    }
})(window);