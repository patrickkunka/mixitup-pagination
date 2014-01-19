/**
 * @license
 * MixItUp Pagination v1.0.0-beta
 * Copyright 2014 KunkaLabs Limited.
 * This is a premium extension.
 * https://mixitup.kunkalabs.com
 */

(function($, undf){
	$.extend(true, $.MixItUp.prototype, {
		
		/* Extend Hooks
		---------------------------------------------------------------------- */
		
		_hookInstantiate: {
			pagination: function(){
				var self = this;

				self.pagination = {
					limit: 0,
					page: 1,
					generatePagers: false,
					pagerClass: ''
				};
				
				$.extend(self.selectors, {
					pagersWrapper: '.pager-list',
					pager: '.pager'
				});
				
				self._activePage = null;
				self._totalPages = null;
			}
		},
		
		_hookPostInit: {
			pagination: function(){
				var self = this;
				
				self._activePage = self.pagination.page;
			}
		},
		
		_hookBindHandlers: {
			pagination: function(){
				var self = this;
				
				self._$pagersWrapper = $(self.selectors.pagersWrapper);
				
				if(self.controls.live){
					self._$body.on('click.mixItUp.'+self._id, self.selectors.pager, function(){
						self._processClick($(this), 'page');
					});
				} else {
					self._$pagersWrapper.on('click.mixItUp.'+self._id, self.selectors.pager, function(){;
						self._processClick($(this), 'page');
					});
				};
			}
		},
		
		_hookProcessClick: {
			pagination: function($button, type){
				var self = this,
					pageNumber = null;
		
				if(type === 'page'){
					pageNumber = $button.attr('data-page');
					
					if(pageNumber === 'prev'){
						pageNumber = (self._activePage - 1) * 1;
					} else if(pageNumber === 'next'){
						pageNumber = (self._activePage + 1) * 1;
					} else {
						pageNumber = pageNumber * 1;
					};

					if(!$button.hasClass(self.controls.activeClass)){
						self.paginate(pageNumber);
					};
				};
			}
		},
		
		_hookBuildState: {
			pagination: function(){
				var self = this;

				$.extend(self._state, {
					limit: self.pagination.limit,
					activePage: self._activePage,
					totalPages: self._totalPages
				});
			}
		},
		
		_hookPostSort: {
			pagination: function(){
				var self = this;
				
				if(self.pagination.limit > 0){
					self._printSort();
				};
			}
		},
		
		_hookPostFilter: {
			pagination: function(){
				var self = this,
					startPageAt = self.pagination.limit * (self.pagination.page - 1),
					endPageAt = (self.pagination.limit * self.pagination.page) - 1,
					$inPage = null,
					$notInPage = null;
					
				self._activePage = self.pagination.page;
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
					};
					
					self.pagination.generatePagers && self._generatePagers();
				};
			}
		},
		
		_hookMultiMix: {
			pagination: function(args){
				var self = this;
				if(args.paginate !== undf){
					typeof args.paginate === 'object' ? 
						$.extend(self.pagination, args.paginate) :
						self.pagination.page = args.paginate;
				} else if(args.filter !== undf || args.sort !== undf){
					self.pagination.page = 1;
				};
			}
		},
		
		_hookDestroy: {
			pagination: function(){
				var self = this;
				
				self._$pagersWrapper.off('.mixItUp').html('');
			}
		},
		
		/* Private Methods
		---------------------------------------------------------------------- */
		
		_generatePagers: function(){
			var self = this,
				pagerTag = self._$pagersWrapper[0].nodeName === 'UL' ? 'li' : 'span',
				pagerClass = self.pagination.pagerClass ? self.pagination.pagerClass+' ' : '',
				prevButtonHTML = self._activePage > 1 ? '<'+pagerTag+' class="'+pagerClass+'pager page-prev" data-page="prev"><span>&laquo;</span></'+pagerTag+'>' : '',
				nextButtonHTML = self._activePage < self._totalPages ? '<'+pagerTag+' class="'+pagerClass+'pager page-next" data-page="next"><span>&raquo;</span></'+pagerTag+'>' : '',
				totalButtons = self._totalPages > 5 ? 5 : self._totalPages,
				pagerButtonsHTML = '',
				pagersHTML = '';

			for(var i = 0; i < totalButtons; i++){
				var pagerNumber = null,
					classes = '';
				if(i === 0){
					pagerNumber = 1;
					if(self._activePage > 3 && self._totalPages > 5){
						classes = ' page-first';
					};
				} else {
					if(totalButtons < 5){
						pagerNumber = i+1;
					} else {
						if(i === 4){
							pagerNumber = self._totalPages;
							if(self._activePage < self._totalPages - 2 && self._totalPages > 5){
								classes = ' page-last';
							};
						} else{
							if(self._activePage > 3 && self._activePage < self._totalPages - 2){
								pagerNumber = self._activePage - (2 - i);
							} else if(self._activePage < 4){
								pagerNumber = i + 1;
							} else if(self._activePage >= self._totalPages - 2){
								pagerNumber = self._totalPages - (4 - i);
							};
						};
					};
				};
				
				classes = (pagerNumber === self._activePage) ? classes+' '+self.controls.activeClass : classes;

				pagerButtonsHTML += '<'+pagerTag+' class="'+pagerClass+'pager page-number'+classes+'" data-page="'+pagerNumber+'"><span>'+pagerNumber+'</span></'+pagerTag+'> ';
			};

			pagersHTML = self._totalPages > 1 ? prevButtonHTML+' '+pagerButtonsHTML+' '+nextButtonHTML : '';
			
			self._$pagersWrapper.html(pagersHTML);
		},
		
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
					};
				};
			};

			return output;
		},
		
		/* Public Methods
		---------------------------------------------------------------------- */
		
		paginate: function(){
			var self = this,
				args = self._parsePaginateArgs(arguments);
				
			self.multiMix({paginate: args.command}, args.animate, args.callback);
		}
		
	});
	
})(jQuery);
