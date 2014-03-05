/**!
 * MixItUp Pagination v1.0.1
 * A Premium Extension for MixItUp
 *
 * @copyright Copyright 2014 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   To be used under the same terms as MixItUp core.
 *            https://mixitup.kunkalabs.com/licenses/
 */ 

(function($, undf){
	$.extend(true, $.MixItUp.prototype, {

		/* Extend Action Hooks
		---------------------------------------------------------------------- */

		_actions: {
			_constructor: {
				post: {
					pagination: function(){
						var self = this;

						self.pagination = {
							limit: 0,
							loop: false,
							generatePagers: true,
							pagerClass: '',
							prevButtonHTML: '&laquo;',
							nextButtonHTML: '&raquo;'
						};

						$.extend(self.selectors, {
							pagersWrapper: '.pager-list',
							pager: '.pager'
						});
						
						$.extend(self.load, {
							page: 1
						});

						self._activePage = null;
						self._totalPages = null;

						self._$pagersWrapper = $();
					}
				}
			},
			_init: {
				post: {
					pagination: function(){
						var self = this;

						self._activePage = self.load.page * 1;
					}
				}
			},
			_bindHandlers: {
				post: {
					pagination: function(){
						var self = this;

						if(self.pagination.generatePagers){
							self._$pagersWrapper = $(self.selectors.pagersWrapper);
						};

						if(self.controls.live){
							self._$body.on('click.mixItUp.'+self._id, self.selectors.pager, function(){
								self._processClick($(this), 'page');
							});
						} else {
							self._$pagersWrapper.on('click.mixItUp.'+self._id, self.selectors.pager, function(){;
								self._processClick($(this), 'page');
							});
						}
					}
				}
			},
			_processClick: {
				post: {
					pagination: function(args){
						var self = this,
							pageNumber = null,
							$button = args[0],
							type = args[1];

						if(type === 'page'){
							pageNumber = $button.attr('data-page') || false;

							if(pageNumber === 'prev'){
								pageNumber = self._getPrevPage();
							} else if(pageNumber === 'next'){
								pageNumber = self._getNextPage();
							} else if(pageNumber){
								pageNumber = pageNumber * 1;
							} else {
								return false;
							}
							
							if(!$button.hasClass(self.controls.activeClass)){
								self.paginate(pageNumber);
							}
						}
					}
				}
			},
			_buildState: {
				post: {
					pagination: function(){
						var self = this;

						$.extend(self._state, {
							limit: self.pagination.limit,
							activePage: self._activePage,
							totalPages: self._totalPages
						});
					}
				}
			},
			_sort: {
				post: {
					pagination: function(){
						var self = this;

						if(self.pagination.limit > 0){
							self._printSort();
						}
					}
				}
			},
			_filter: {
				post: {
					pagination: function(){
						var self = this,
							startPageAt = self.pagination.limit * (self.load.page - 1),
							endPageAt = (self.pagination.limit * self.load.page) - 1,
							$inPage = null,
							$notInPage = null;

						self._activePage = self.load.page;
						self._totalPages = self.pagination.limit ? Math.ceil(self._$show.length / self.pagination.limit) : 1;

						if(self.pagination.limit > 0){

							$inPage = self._$show.filter(function(index){
								return index >= startPageAt && index <= endPageAt;
							});

							$notInPage = self._$show.filter(function(index){
								return index < startPageAt || index > endPageAt;
							});

							self._$show = $inPage;
							self._$hide = self._$hide.add($notInPage);

							if(self._sorting){
								self._printSort(true);
							}
						}

						if(self.pagination.generatePagers && self._$pagersWrapper.length){
							self._generatePagers();	
						};
					}
				}
			},
			multiMix: {
				pre: {
					pagination: function(args){
						var self = this,
							args = self._parseMultiMixArgs(args);

						if(args.command.paginate !== undf){
							typeof args.command.paginate === 'object' ? 
								$.extend(self.pagination, args.command.paginate) :
								self.load.page = args.command.paginate;

						} else if(args.command.filter !== undf || args.command.sort !== undf){
							self.load.page = 1;
						}
					}	
				}
			},
			destroy: {
				post: {
					pagination: function(){
						var self = this;

						self._$pagersWrapper.off('.mixItUp').html('');
					}
				}
			}
		},

		/* Private Methods
		---------------------------------------------------------------------- */

		/**
		 * Get Next Page
		 * @return {number} page
		 */

		_getNextPage: function(){
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
		 * Get Previous Page
		 * @return {number} page
		 */

		_getPrevPage: function(){
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
		 * Generate Pagination Controls
		 */

		_generatePagers: function(){
			var self = this,
				pagerTag = self._$pagersWrapper[0].nodeName === 'UL' ? 'li' : 'span',
				pagerClass = self.pagination.pagerClass ? self.pagination.pagerClass+' ' : '',

				prevButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-prev" data-page="prev"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>',
				prevButtonHTML = (self._activePage > 1) ? 
					prevButtonHTML : self.pagination.loop ? prevButtonHTML :
					'<'+pagerTag+' class="'+pagerClass+'pager page-prev disabled"><span>'+self.pagination.prevButtonHTML+'</span></'+pagerTag+'>';

				nextButtonHTML = '<'+pagerTag+' class="'+pagerClass+'pager page-next" data-page="next"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>',
				nextButtonHTML = (self._activePage < self._totalPages) ? 
					nextButtonHTML : self.pagination.loop ? nextButtonHTML :
					'<'+pagerTag+' class="'+pagerClass+'pager page-next disabled"><span>'+self.pagination.nextButtonHTML+'</span></'+pagerTag+'>';

				totalButtons = self._totalPages > 5 ? 5 : self._totalPages,
				pagerButtonsHTML = '',
				pagersHTML = '',
				wrapperClass = '';

			self._execAction('_generatePagers', 0);

			for(var i = 0; i < totalButtons; i++){
				var pagerNumber = null,
					classes = '';

				if(i === 0){
					pagerNumber = 1;
					if(self._activePage > 3 && self._totalPages > 5){
						classes = ' page-first';
					}
				} else {
					if(totalButtons < 5){
						pagerNumber = i+1;
					} else {
						if(i === 4){
							pagerNumber = self._totalPages;
							if(self._activePage < self._totalPages - 2 && self._totalPages > 5){
								classes = ' page-last';
							}
						} else{
							if(self._activePage > 3 && self._activePage < self._totalPages - 2){
								pagerNumber = self._activePage - (2 - i);
							} else if(self._activePage < 4){
								pagerNumber = i + 1;
							} else if(self._activePage >= self._totalPages - 2){
								pagerNumber = self._totalPages - (4 - i);
							}
						}
					}
				}

				classes = (pagerNumber == self._activePage) ? classes+' '+self.controls.activeClass : classes;

				pagerButtonsHTML += '<'+pagerTag+' class="'+pagerClass+'pager page-number'+classes+'" data-page="'+pagerNumber+'"><span>'+pagerNumber+'</span></'+pagerTag+'> ';
			}

			pagersHTML = self._totalPages > 1 ? prevButtonHTML+' '+pagerButtonsHTML+' '+nextButtonHTML : '';
			
			wrapperClass = self._totalPages > 1 ? '' : 'no-pagers';

			self._$pagersWrapper.html(pagersHTML).removeClass('no-pagers').addClass(wrapperClass);

			self._execAction('_generatePagers', 1);
		},

		/**
		 * Parse Paginate Arguments
		 * @param {array} args
		 * @return {object} output
		 */

		_parsePaginateArgs: function(args){
			var self = this,
				output = {
					command: null,
					animate: true,
					callback: null
				};

			for(var i = 0; i < args.length; i++){
				var arg = args[i];

				if(arg !== null){	
					if(typeof arg === 'object' || typeof arg === 'number'){
						output.command = arg;
					} else if(typeof arg === 'boolean'){
						output.animate = arg;
					} else if(typeof arg === 'function'){
						output.callback = arg;
					}
				}
			}

			return self._execFilter('_parsePaginateArgs', output, arguments);
		},

		/* Public Methods
		---------------------------------------------------------------------- */

		/**
		 * Paginate
		 * @param {array} arguments
		 */

		paginate: function(){
			var self = this,
				args = self._parsePaginateArgs(arguments);

			self.multiMix({paginate: args.command}, args.animate, args.callback);
		},

		/**
		 * nextPage
		 * @param {array} arguments
		 */

		nextPage: function(){
			var self = this,
				args = self._parsePaginateArgs(arguments);

			self.multiMix({paginate: self._getNextPage()}, args.animate, args.callback);
		},

		/**
		 * prevPage
		 * @param {array} arguments
		 */

		prevPage: function(){
			var self = this,
				args = self._parsePaginateArgs(arguments);

			self.multiMix({paginate: self._getPrevPage()}, args.animate, args.callback);
		}

	});

})(jQuery);