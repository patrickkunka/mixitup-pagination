/**!
 * MixItUp Pagination v2.0.0-beta
 *
 * Build 5afe0e99-5991-4178-a3b1-0b5c21a39796
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

        mixitup.ConfigClassnames.registerAction('afterConstruct', 'pagination', function() {
            this.elementPager               = 'control';
            this.elementPageList            = 'page-list';
            this.elementPageStats           = 'page-stats';
            this.modifierFirst              = 'first';
            this.modifierLast               = 'last';
            this.modifierPrev               = 'prev';
            this.modifierNext               = 'next';
            this.modifierTruncationMarker   = 'truncation-marker';
        });

        mixitup.ConfigLoad.registerAction('afterConstruct', 'pagination', function() {
            this.page = 1;
        });

        //
        mixitup.ConfigPagination = function() {
            this.loop                       = false;
            this.generatePageList           = true;
            this.generatePageStats          = true;
            this.maintainActivePage         = true;
            this.hidePageListIfSinglePage   = false;
            this.hidePageStatsIfSinglePage  = false;
            this.limit                      = Infinity;
            this.maxPagers                  = 5;
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

        mixitup.ConfigSelectors.registerAction('afterConstruct', 'pagination', function() {
            this.pageList  = '.mixitup-page-list';
            this.pageStats = '.mixitup-page-stats';
        });

        mixitup.Config.registerAction('beforeConstruct', 'pagination', function() {
            this.pagination = new mixitup.ConfigPagination();
        });

        mixitup.UiClassnames.registerAction('afterConstruct', 'pagination', function() {
            this.first              = '';
            this.last               = '';
            this.prev               = '';
            this.next               = '';
            this.first              = '';
            this.last               = '';
            this.truncated          = '';
            this.truncationMarker   = '';
        });

        mixitup.controlDefinitions.push(new mixitup.ControlDefinition('pager', '[data-page]', true, 'pageList'));

        /**
         * @param   {mixitup.MultimixCommand[]} commands
         * @param   {ClickEvent}                e
         * @return  {object|null}
         */

        mixitup.Control.registerFilter('commandsHandleClick', 'pagination', function(commands, e) {
            var self            = this,
                command         = {},
                page            = '',
                pageNumber      = -1,
                mixer           = null,
                button          = null,
                i               = -1;

            if (!self.selector || self.selector !== '[data-page]') {
                // Static control or non-pager live control

                return commands;
            }

            button = h.closestParent(e.target, self.selector, true, self.bound[0].dom.document);

            for (i = 0; mixer = self.bound[i]; i++) {
                command = commands[i];

                if (!mixer.config.pagination || mixer.config.pagination.limit < 0 || mixer.config.pagination.newLimit === Infinity) {
                    // Pagination is disabled for this instance. Do not handle.

                    commands[i] = null;

                    continue;
                }

                if (!button || h.hasClass(button, mixer.classnamesPager.active) || h.hasClass(button, mixer.classnamesPager.disabled)) {
                    // No button was clicked or button is already active. Do not handle.

                    commands[i] = null;

                    continue;
                }

                page = button.getAttribute('data-page');

                if (page === 'prev') {
                    command.paginate = 'prev';
                } else if (page === 'next') {
                    command.paginate = 'next';
                } else if (pageNumber) {
                    command.paginate = parseInt(page);
                }

                if (mixer.lastClicked) {
                    mixer.lastClicked = button;
                }
            }

            return commands;
        });

        mixitup.CommandMultimix.registerAction('afterConstruct', 'pagination', function() {
            this.paginate = null;
        });

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

        mixitup.Operation.registerAction('afterConstruct', 'pagination', function() {
            this.startPage          = -1;
            this.newPage            = -1;
            this.startLimit         = -1;
            this.newLimit           = -1;
            this.startTotalPages    = -1;
            this.newTotalPages      = -1;
            this.startAnchor        = null;
            this.newAnchor          = null;
        });

        mixitup.State.registerAction('afterConstruct', 'pagination', function() {
            this.limit              = -1;
            this.page               = -1;
            this.totalPages         = -1;
            this.anchor             = null;
        });

        mixitup.MixerDom.registerAction('afterConstruct', 'pagination', function() {
            this.pageList  = null;
            this.pageStats = null;
        });

        mixitup.Mixer.registerAction('afterConstruct', 'pagination', function() {
            this.classnamesPager        = new mixitup.UiClassnames();
            this.classnamesPageList     = new mixitup.UiClassnames();
            this.classnamesPageStats    = new mixitup.UiClassnames();
        });

        /**
         * @private
         * @return  {void}
         */

        mixitup.Mixer.registerAction('afterAttach', 'pagination', function() {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.newLimit === Infinity) {
                return;
            }

            // Map pagination ui classnames

            // jscs:disable
            self.classnamesPager.base               = h.getClassname(self.config.classnames, 'pager');
            self.classnamesPager.active             = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierActive);
            self.classnamesPager.disabled           = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierDisabled);
            self.classnamesPager.first              = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierFirst);
            self.classnamesPager.last               = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierLast);
            self.classnamesPager.prev               = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierPrev);
            self.classnamesPager.next               = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierNext);
            self.classnamesPager.truncationMarker   = h.getClassname(self.config.classnames, 'pager', self.config.classnames.modifierTruncationMarker);

            self.classnamesPageList.base            = h.getClassname(self.config.classnames, 'page-list');
            self.classnamesPageList.disabled        = h.getClassname(self.config.classnames, 'page-list', self.config.classnames.modifierDisabled);

            self.classnamesPageStats.base           = h.getClassname(self.config.classnames, 'page-stats');
            self.classnamesPageStats.disabled       = h.getClassname(self.config.classnames, 'page-stats', self.config.classnames.modifierDisabled);
            // jscs:enable
        });

        /**
         * @private
         * @param   {mixitup.State} state
         * @return  {mixitup.State}
         */

        mixitup.Mixer.registerFilter('stateGetInitialState', 'pagination', function(state) {
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

        mixitup.Mixer.registerAction('afterGetFinalMixData', 'pagination', function() {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.newLimit === Infinity) return;

            if (typeof self.config.pagination.maxPagers === 'number') {
                // Restrict max pagers to a minimum of 5. There must always
                // be a first, last, and one on either side of the active pager.
                // e.g. « 1 ... 4 5 6 ... 10 »

                self.config.pagination.maxPagers = Math.max(5, self.config.pagination.maxPagers);
            }
        });

        /**
         * @private
         * @return  {void}
         */

        mixitup.Mixer.registerAction('afterCacheDom', 'pagination', function() {
            var self    = this,
                parent  = null;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) return;

            if (!self.config.pagination.generatePageList) return;

            switch (self.config.controls.scope) {
                case 'local':
                    parent = self.dom.container;

                    break;
                case 'global':
                    parent = self.dom.document;

                    break;
                default:
                    throw new Error(mixitup.messages[102]);
            }

            self.dom.pageList  = parent.querySelector(self.config.selectors.pageList);
            self.dom.pageStats = parent.querySelector(self.config.selectors.pageStats);
        });

        /**
         * @private
         * @param   {mixitup.State}     state
         * @param   {mixitup.Operation} operation
         * @return  {mixitup.State}
         */

        mixitup.Mixer.registerFilter('stateBuildState', 'pagination', function(state, operation) {
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

        mixitup.Mixer.registerAction('afterFilterOperation', 'pagination', function(operation) {
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
        });

        /**
         * @public
         * @param   {mixitup.Operation}         operation
         * @param   {mixitup.CommandMultimix}   multimixCommand
         * @return  {mixitup.Operation}
         */

        mixitup.Mixer.registerFilter('operationUnmappedGetOperation', 'pagination', function(operation, multimixCommand) {
            var self            = this,
                instruction     = null,
                paginateCommand = null;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) {
                return operation;
            }

            instruction     = self.parsePaginateArgs([multimixCommand.paginate]);
            paginateCommand = instruction.command;

            operation.startState                                = self.state;
            operation.startPage         = operation.newPage     = self.state.page;
            operation.startLimit        = operation.newLimit    = self.state.limit;
            operation.startAnchor       = operation.newAnchor   = self.state.anchor;
            operation.startTotalPages                           = self.state.totalPages;

            if (paginateCommand) {
                self.parsePaginationCommand(paginateCommand, operation);
            } else if (typeof multimixCommand.filter !== 'undefined' || typeof multimixCommand.sort !== 'undefined') {
                // No other functionality is taking place that could affect
                // the active page, reset to 1, or maintain active:

                if (!self.config.pagination.maintainActivePage) {
                    operation.newPage = 1;
                } else {
                    operation.newPage = self.state.page;
                }
            }

            return operation;
        });

        /**
         * @public
         * @param   {mixitup.Operation} operation
         * @param   {object}            command
         * @param   {boolean}           [isPreFetch=false]
         * @return  {mixitup.Operation}
         */

        mixitup.Mixer.registerFilter('operationMappedGetOperation', 'pagination', function(operation, command, isPreFetch) {
            var self = this;

            if (!self.config.pagination || self.config.pagination.limit < 0 || self.config.pagination.limit === Infinity) {
                return operation;
            }

            if (isPreFetch) {
                // The operation is being pre-fetched, so don't update the pagers or stats yet.

                return operation;
            }

            if (self.config.pagination.generatePageList && self.dom.pageList) {
                self.renderPageList(operation);
            }

            if (self.config.pagination.generatePageStats && self.dom.pageStats) {
                self.renderPageStats(operation);
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

            parsePaginationCommand: function(command, operation) {
                var self = this;

                // e.g. mixer.paginate({page: 3, limit: 2});
                // e.g. mixer.paginate({goTo: 'next'});
                // e.g. mixer.paginate({anchor: anchorTarget, limit: 5});

                if (command.page > -1) {
                    if (command.page === 0) throw new Error(mixitup.messages.ERROR_PAGINATION_INDEX_RANGE);

                    // TODO: replace Infinity with the highest possible page index

                    operation.newPage = Math.max(1, Math.min(Infinity, command.page));
                } else if (command.goTo === 'next') {
                    operation.newPage = self.getNextPage();
                } else if (command.goTo === 'prev') {
                    operation.newPage = self.getPrevPage();
                } else if (command.anchor) {
                    operation.newAnchor = command.anchor;
                }

                if (command.limit > -1) {
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

            getNextPage: function() {
                var self = this,
                    page = -1;

                page = self.state.page + 1;

                if (page > self.state.totalPages) {
                    page = self.config.pagination.loop ? 1 : self.state.page;
                }

                return page;
            },

            /**
             * @private
             * @return  {Number}    page
             */

            getPrevPage: function() {
                var self = this,
                    page = -1;

                page = self.state.page - 1;

                if (page < 1) {
                    page = self.config.pagination.loop ? self.state.totalPages : self.state.page;
                }

                return page;
            },

            /**
             * @private
             * @param   {mixitup.Operation}  operation
             * @return  {void}
             */

            renderPageList: function(operation) {
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

                if (
                    operation.newLimit < 0 ||
                    operation.newLimit === Infinity ||
                    (operation.newTotalPages < 2 && self.config.pagination.hidePageListIfSinglePage)
                ) {
                    // Empty the pager list, and add disabled class

                    self.dom.pageList.innerHTML = '';

                    h.addClass(self.dom.pageList, self.classnamesPageList.disabled);

                    return;
                }

                activeIndex = operation.newPage - 1;

                if (self.config.pagination.maxPagers < Infinity && operation.newTotalPages > self.config.pagination.maxPagers) {
                    allowedIndices = self.getAllowedIndices(operation);
                }

                // Render prev button

                classList.push(self.classnamesPager.base);
                classList.push(self.classnamesPager.prev);

                // If first and not looping, disable the prev button

                if (operation.newPage === 1 && !self.config.pagination.loop) {
                    classList.push(self.classnamesPager.disabled);

                    // TODO: if button, actually disable it?
                }

                //
                pagerHtml = self.config.pagination.templatePrevPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Render per-page pagers

                for (i = 0; i < operation.newTotalPages; i++) {
                    pagerHtml = self.renderPager(i, operation, allowedIndices);

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

                classList.push(self.classnamesPager.base);
                classList.push(self.classnamesPager.next);

                // If last page and not looping, disable the next button

                if (operation.newPage === operation.newTotalPages && !self.config.pagination.loop) {
                    classList.push(self.classnamesPager.disabled);
                }

                //
                pagerHtml = self.config.pagination.templateNextPage.replace(/{{classes}}/g, classList.join(' '));
                //

                buttonList.push(pagerHtml);

                // Replace markup

                html = buttonList.join(' ');

                self.dom.pageList.innerHTML = html;

                if (truncatedBefore || truncatedAfter) {
                    h.addClass(self.dom.pageList, self.classnamesPageList.truncated);
                } else {
                    h.removeClass(self.dom.pageList, self.classnamesPageList.truncated);
                }

                if (operation.newTotalPages > 1) {
                    h.removeClass(self.dom.pageList, self.classnamesPageList.disabled);
                } else {
                    h.addClass(self.dom.pageList, self.classnamesPageList.disabled);
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

            getAllowedIndices: function(operation) {
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

            renderPager: function(i, operation, allowedIndices) {
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

                classList.push(self.classnamesPager.base);

                if (i === 0) {
                    classList.push(self.classnamesPager.first);
                }

                if (i === operation.newTotalPages - 1) {
                    classList.push(self.classnamesPager.last);
                }

                if (i === activePage) {
                    classList.push(self.classnamesPager.active);
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

            renderPageStats: function(operation) {
                var self            = this,
                    output          = '',
                    template        = '',
                    startPageAt     = -1,
                    endPageAt       = -1,
                    totalTargets    = -1;

                if (
                    operation.newLimit < 0 ||
                    operation.newLimit === Infinity ||
                    (operation.newTotalPages < 2 && self.config.pagination.hidePageStatsIfSinglePage)
                ) {
                    // Empty the pager list, and add disabled class

                    self.dom.pageStats.innerHTML = '';

                    h.addClass(self.dom.pageStats, self.classnamesPageStats.disabled);

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

                if (totalTargets && operation.newLimit > 0) {
                    startPageAt = ((operation.newPage - 1) * operation.newLimit) + 1;
                    endPageAt   = Math.min(startPageAt + operation.newLimit - 1, totalTargets);
                } else {
                    startPageAt = endPageAt = 0;
                }

                //
                output = template
                    .replace(/{{startPageAt}}/g, startPageAt.toString())
                    .replace(/{{endPageAt}}/g, endPageAt.toString())
                    .replace(/{{totalTargets}}/g, totalTargets.toString());
                //

                self.dom.pageStats.innerHTML = output;

                if (totalTargets) {
                    h.removeClass(self.dom.pageStats, self.classnamesPageStats.disabled);
                } else {
                    h.addClass(self.dom.pageStats, self.classnamesPageStats.disabled);
                }
            },

            /**
             * @private
             * @param   {Array<*>}                  args
             * @return  {mixitup.UserInstruction}   instruction
             */

            parsePaginateArgs: function(args) {
                var self        = this,
                    instruction = new mixitup.UserInstruction(),
                    arg         = null,
                    i           = -1;

                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandPaginate();

                for (i = 0; i < args.length; i++) {
                    arg = args[i];

                    if (arg !== null) {
                        if (typeof arg === 'object' && h.isElement(arg, self.dom.document)) {
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
                    instruction = self.parsePaginateArgs(arguments);

                return self.multimix({
                    paginate: instruction.command
                }, instruction.animate, instruction.callback);
            },

            /**
             * @public
             * @return      {Promise.<mixitup.State>}
             */

            nextPage: function() {
                var self        = this,
                    instruction = self.parsePaginateArgs(arguments);

                return self.multimix({
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
                    instruction = self.parsePaginateArgs(arguments);

                return self.multimix({
                    paginate: {
                        goTo: 'prev'
                    }
                }, instruction.animate, instruction.callback);
            }
        });

        mixitup.Facade.registerAction('afterConstruct', 'pagination', function(mixer) {
            this.paginate = mixer.paginate.bind(mixer);
            this.nextPage = mixer.nextPage.bind(mixer);
            this.prevPage = mixer.prevPage.bind(mixer);
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