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
    var _MixItUp = null,
        mixItUp = null,
        _Target = null,
        _h = null;

    if (window._MixItUp !== undf) {
        _MixItUp = window._MixItUp;
        _h = window._MixItUp.prototype._h;
        _Target = window._MixItUp.prototype._Target;
        mixItUp = window._MixItUp.prototype.mixItUp;
    } else {
        console.error('[MixItUp] MixItUp core not found');

        return;
    }

    if (!_MixItUp.prototype._extensions.dragndrop) {
        _MixItUp.prototype._extensions.dragndrop = true;
    
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
                    nextButtonHTML: '&raquo;'
                },
                self.load, {
                    page: 1
                },
                _activePage: null,
                _totalPages: -1,

                _dom: {
                    _pagersWrapper: null
                }
        }, 1);
        
        /**
         * _getFinalMixData
         * @extends _MixItUp.prototype._getFinalMixData
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_getFinalMixData', 'pagination', function() {
            var self = this;

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

        _MixItUp.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (self.pagination.generatePagers) {
                self._dom._pagersWrapper = document.querySelector(self.selectors.pagersWrapper);
            }
        }, 1);
        
        /**
         * _bindEvents
         * @extends _MixItUp.prototype._bindHandlers
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_bindEvents', 'pagination', function() {
            var self = this;

            if (!self.controls.live) {
                _h._on(self._dom._pagersWrapper, 'click', self.handler);
            }
        }, 1);

        /**
         * _unbindEvents
         * @extends _MixItUp.prototype._bindHandlers
         * @priority 0
         */
        
        _MixItUp.prototype.addAction('_unbindEvents', 'pagination', function() {
            var self = this;

            _h._off(self._dom._pagersWrapper, 'click', self.handler);
        }, 0);
        
        /**
         * _handleClick
         * @extends _MixItUp.prototype._handleClick
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_processClick', 'pagination', function(args) {
            var self = this,
                pageNumber = null,
                e = args[0],
                pageButton = _h.closestParent(
                    e.target,
                    self.selectors.pager,
                    true
                );

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
            }
        }, 1);
        
        /**
         * _buildState
         * @extends _MixItUp.prototype._buildState
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_buildState', 'pagination', function(){
            var self = this;

            _h._extend(self._state, {
                limit: self.pagination.limit,
                activePage: self._activePage,
                totalPages: self._totalPages
            });
        }, 1);
        
        /**
         * _sort
         * @extends _MixItUp.prototype._sort
         * @priority 1
         */
        
        _MixItUp.prototype.addAction('_sort', 'pagination', function(){
            var self = this;

            if (self.pagination.limit > 0) {
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
                startPageAt = self.pagination.limit * (self.load.page - 1),
                endPageAt = (self.pagination.limit * self.load.page) - 1,
                inPage = [],
                notInPage = [],
                target = null,
                i = -1;

            self._activePage = self.load.page;
            self._totalPages = self.pagination.limit ? Math.ceil(self._show.length / self.pagination.limit) : 1;

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
                    self._hide.push(target);

                    if (self._toShow.indexOf(target)) {
                        self._toShow.splice(self._toShow.indexOf(target), 1);
                    }

                    target._isShown && self._toHide.push(target);
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
            var self = this,
                args = self._parseMultiMixArgs(args);

            if (args.command.paginate !== undf) {
                typeof args.command.paginate === 'object' ? 
                    _h._extend(self.pagination, args.command.paginate) :
                    self.load.page = args.command.paginate;
            } else if (args.command.filter !== undf || args.command.sort !== undf) {
                self.load.page = 1;
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
                    page = self._activePage + 1,
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
                    page = self._activePage - 1,
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

                    prevButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-prev" data-page="prev"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>',
                    prevButtonHTML = (self._activePage > 1) ? 
                        prevButtonHTML : self.pagination.loop ? prevButtonHTML :
                        '<'+pagerTag+' class="'+pagerClass+'pager page-prev disabled"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';

                    nextButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-next" data-page="next"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>',
                    nextButtonHTML = (self._activePage < self._totalPages) ? 
                        nextButtonHTML : self.pagination.loop ? nextButtonHTML :
                        '<'+pagerTag+' class="'+pagerClass+'pager page-next disabled"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';

                    totalButtons = (
                                        self.pagination.maxPagers !== false &&
                                        self._totalPages > self.pagination.maxPagers
                                    ) ? 
                                        self.pagination.maxPagers : 
                                        self._totalPages,
                    pagerButtonsHTML = '',
                    pagersHTML = '',
                    wrapperClass = '';

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
                
                wrapperClass = self._totalPages > 1 ? '' : 'no-pagers';

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
             */

            paginate: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                self.multiMix({paginate: args.command}, args.animate, args.callback);
            },

            /**
             * nextPage
             * @shorthand self.multiMix
             * @param {Mixed} arguments
             */

            nextPage: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                self.multiMix({paginate: self._getNextPage()}, args.animate, args.callback);
            },

            /**
             * prevPage
             * @shorthand self.multiMix
             * @param {Mixed} arguments
             */

            prevPage: function() {
                var self = this,
                    args = self._parsePaginateArgs(arguments);

                self.multiMix({paginate: self._getPrevPage()}, args.animate, args.callback);
            }
        });
    }

    /* Module Definitions
    ---------------------------------------------------------------------- */

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixItUp;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixItUp;
        });
    } else if (window._MixItUp === undf || typeof window._MixItUp !== 'function') {
        window.mixItUp = mixItUp;
    }
})(jQuery);