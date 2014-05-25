/**!
 * MixItUp Pagination v1.1.0
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
	
	/* Add Actions
	---------------------------------------------------------------------- */
	
	/**
	 * Constructor
	 * @extends _constructor
	 */
	
	$.MixItUp.prototype.addAction('_constructor', 'pagination', function(){
		var self = this;

		self.pagination = {
			limit: 0,
			loop: false,
			generatePagers: true,
			maxPagers: 5,
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
	}, 1);
	
	/**
	 * Initialize
	 * @extends $.MixItUp.prototype._init
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_init', 'pagination', function(){
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
	 * Bind Handlers
	 * @extends $.MixItUp.prototype._bindHandlers
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_bindHandlers', 'pagination', function(){
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
	}, 1);
	
	/**
	 * Process Click
	 * @extends $.MixItUp.prototype._processClick
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_processClick', 'pagination', function(args){
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
	}, 1);
	
	/**
	 * Build State
	 * @extends $.MixItUp.prototype._buildState
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_buildState', 'pagination', function(){
		var self = this;

		$.extend(self._state, {
			limit: self.pagination.limit,
			activePage: self._activePage,
			totalPages: self._totalPages
		});
	}, 1);
	
	/**
	 * Sort
	 * @extends $.MixItUp.prototype._sort
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_sort', 'pagination', function(){
		var self = this;

		if(self.pagination.limit > 0){
			self._printSort();
		}
	}, 1);
	
	/**
	 * Filter
	 * @extends $.MixItUp.prototype._filter
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('_filter', 'pagination', function(){
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
	}, 1);
	
	/**
	 * MultiMix
	 * @extends $.MixItUp.prototype.multiMix
	 * @priority 0
	 */
	
	$.MixItUp.prototype.addAction('multiMix', 'pagination', function(args){
		var self = this,
			args = self._parseMultiMixArgs(args);

		if(args.command.paginate !== undf){
			typeof args.command.paginate === 'object' ? 
				$.extend(self.pagination, args.command.paginate) :
				self.load.page = args.command.paginate;

		} else if(args.command.filter !== undf || args.command.sort !== undf){
			self.load.page = 1;
		}
	}, 0);
	
	/**
	 * Destory
	 * @extends $.MixItUp.prototype.destroy
	 * @priority 1
	 */
	
	$.MixItUp.prototype.addAction('destroy', 'pagination', function(){
		var self = this;

		self._$pagersWrapper.off('.mixItUp').html('');
	}, 1);
	
	/* Add Private Methods
	---------------------------------------------------------------------- */
	
	$.MixItUp.prototype.extend({
		
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

			for(var i = 0; i < totalButtons; i++){
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
					animate: self.animation.enable,
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
		}
	});
	
	/* Add Public Methods
	---------------------------------------------------------------------- */
	
	$.MixItUp.prototype.extend({
		
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