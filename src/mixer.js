/* global mixitup, h */

/**
 * The mixitup.Mixer class is extended with the following methods relating to
 * the Pagination extension.
 *
 * For the full list of methods, please refer to the MixItUp core documentation.
 *
 * @constructor
 * @namespace
 * @name        Mixer
 * @memberof    mixitup
 * @public
 * @since       3.0.0
 */

mixitup.Mixer.registerAction('afterConstruct', 'pagination', function() {
    this.classNamesPager        = new mixitup.UiClassNames();
    this.classNamesPageList     = new mixitup.UiClassNames();
    this.classNamesPageStats    = new mixitup.UiClassNames();
});

/**
 * @private
 * @return  {void}
 */

mixitup.Mixer.registerAction('afterAttach', 'pagination', function() {
    var self = this,
        el   = null,
        i    = -1;

    if (self.config.pagination.limit < 0) return;

    // Map pagination ui classNames

    // jscs:disable
    self.classNamesPager.base               = h.getClassname(self.config.classNames, 'pager');
    self.classNamesPager.active             = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierActive);
    self.classNamesPager.disabled           = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierDisabled);
    self.classNamesPager.first              = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierFirst);
    self.classNamesPager.last               = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierLast);
    self.classNamesPager.prev               = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierPrev);
    self.classNamesPager.next               = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierNext);
    self.classNamesPager.truncationMarker   = h.getClassname(self.config.classNames, 'pager', self.config.classNames.modifierTruncationMarker);

    self.classNamesPageList.base            = h.getClassname(self.config.classNames, 'page-list');
    self.classNamesPageList.disabled        = h.getClassname(self.config.classNames, 'page-list', self.config.classNames.modifierDisabled);

    self.classNamesPageStats.base           = h.getClassname(self.config.classNames, 'page-stats');
    self.classNamesPageStats.disabled       = h.getClassname(self.config.classNames, 'page-stats', self.config.classNames.modifierDisabled);
    // jscs:enable

    if (self.config.pagination.generatePageList && self.dom.pageListEls.length > 0) {
        for (i = 0; (el = self.dom.pageListEls[i]); i++) {
            self.renderPageListEl(el, self.lastOperation);
        }
    }

    if (self.config.pagination.generatePageStats && self.dom.pageStatsEls.length > 0) {
        for (i = 0; (el = self.dom.pageStatsEls[i]); i++) {
            self.renderPageStatsEl(el, self.lastOperation);
        }
    }
});

mixitup.Mixer.registerAction('afterSanitizeConfig', 'pagination', function() {
    var self            = this,
        onMixStart      = self.config.callbacks.onMixStart,
        onMixEnd        = self.config.callbacks.onMixEnd,
        onPaginateStart = self.config.callbacks.onPaginateStart,
        onPaginateEnd   = self.config.callbacks.onPaginateEnd,
        didPaginate     = false;

    if (self.config.pagination.limit < 0) return;

    self.classNamesPager        = new mixitup.UiClassNames();
    self.classNamesPageList     = new mixitup.UiClassNames();
    self.classNamesPageStats    = new mixitup.UiClassNames();

    self.config.callbacks.onMixStart = function(prevState, nextState) {
        if (
            prevState.activePagination.limit !== nextState.activePagination.limit ||
            prevState.activePagination.page !== nextState.activePagination.page
        ) {
            didPaginate = true;
        }

        if (typeof onMixStart === 'function') onMixStart.apply(self.dom.container, arguments);

        if (!didPaginate) return;

        mixitup.events.fire('paginateStart', self.dom.container, {
            state: prevState,
            futureState: nextState,
            instance: self
        }, self.dom.document);

        if (typeof onPaginateStart === 'function') onPaginateStart.apply(self.dom.container, arguments);
    };

    self.config.callbacks.onMixEnd = function(state) {
        if (typeof onMixEnd === 'function') onMixEnd.apply(self.dom.container, arguments);

        if (!didPaginate) return;

        didPaginate = false;

        mixitup.events.fire('paginateEnd', self.dom.container, {
            state: state,
            instance: self
        }, self.dom.document);

        if (typeof onPaginateEnd === 'function') onPaginateEnd.apply(self.dom.container, arguments);
    };
});

/**
 * @private
 * @param   {mixitup.Operation} operation
 * @param   {mixitup.State}     state
 * @return  {mixitup.Operation}
 */

mixitup.Mixer.registerFilter('operationGetInitialState', 'pagination', function(operation, state) {
    var self = this;

    if (self.config.pagination.limit < 0) return operation;

    operation.newPagination = state.activePagination;

    return operation;
});

/**
 * @private
 * @param   {mixitup.State} state
 * @return  {mixitup.State}
 */

mixitup.Mixer.registerFilter('stateGetInitialState', 'pagination', function(state) {
    var self = this;

    if (self.config.pagination.limit < 0) return state;

    state.activePagination = new mixitup.CommandPaginate();

    state.activePagination.page     = self.config.load.page;
    state.activePagination.limit    = self.config.pagination.limit;

    return state;
});

/**
 * @private
 * @return  {void}
 */

mixitup.Mixer.registerAction('afterGetFinalMixData', 'pagination', function() {
    var self = this;

    if (self.config.pagination.limit < 0) return;

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

    if (self.config.pagination.limit < 0) return;

    if (!self.config.pagination.generatePageList) return;

    switch (self.config.controls.scope) {
        case 'local':
            parent = self.dom.container;

            break;
        case 'global':
            parent = self.dom.document;

            break;
        default:
            throw new Error(mixitup.messages.ERROR_CONFIG_INVALID_CONTROLS_SCOPE);
    }

    self.dom.pageListEls  = parent.querySelectorAll(self.config.selectors.pageList);
    self.dom.pageStatsEls = parent.querySelectorAll(self.config.selectors.pageStats);
});

/**
 * @private
 * @param   {mixitup.State}     state
 * @param   {mixitup.Operation} operation
 * @return  {mixitup.State}
 */

mixitup.Mixer.registerFilter('stateBuildState', 'pagination', function(state, operation) {
    var self        = this;

    if (self.config.pagination.limit < 0) return state;

    // Map pagination-specific properties into state

    state.activePagination  = operation.newPagination;
    state.totalPages        = operation.newTotalPages;

    return state;
});

/**
 * @private
 * @param   {mixitup.UserInstruction}     instruction
 * @return  {mixitup.UserInstruction}
 */

mixitup.Mixer.registerFilter('instructionParseMultimixArgs', 'pagination', function(instruction) {
    var self = this;

    if (self.config.pagination.limit < 0) return instruction;

    if (instruction.command.paginate && !(instruction.command.paginate instanceof mixitup.CommandPaginate)) {
        instruction.command.paginate = self.parsePaginateArgs([instruction.command.paginate]).command;
    }

    return instruction;
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

    if (self.config.pagination.limit < 0) return;

    // Calculate the new total pages as a matter of course (i.e. a change in filter)

    // New matching array has already been set at this point

    operation.newTotalPages = operation.newPagination.limit ?
        Math.max(Math.ceil(operation.matching.length / operation.newPagination.limit), 1) :
        1;

    if (self.config.pagination.maintainActivePage) {
        operation.newPagination.page = (operation.newPagination.page > operation.newTotalPages) ?
            operation.newTotalPages :
            operation.newPagination.page;
    }

    // Keep config in sync with latest limit

    self.config.pagination.limit = operation.newPagination.limit;

    if (operation.newPagination.anchor) {
        // Start page at an anchor element

        for (i = 0; target = operation.matching[i]; i++) {
            if (target.dom.el === operation.newPagination.anchor) break;
        }

        startPageAt = i;
        endPageAt   = i + operation.newPagination.limit - 1;
    } else {
        // Start page based on limit and page index

        startPageAt = operation.newPagination.limit * (operation.newPagination.page - 1);
        endPageAt   = (operation.newPagination.limit * operation.newPagination.page) - 1;

        if (isNaN(startPageAt)) {
            startPageAt = 0;
        }
    }

    if (operation.newPagination.limit < 0) return;

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
 * @private
 * @param   {mixitup.Operation}         operation
 * @param   {mixitup.CommandMultimix}   command
 * @return  {mixitup.Operation}
 */

mixitup.Mixer.registerFilter('operationUnmappedGetOperation', 'pagination', function(operation, command) {
    var self = this;

    if (self.config.pagination.limit < 0) return operation;

    operation.startState      = self.state;
    operation.startPagination = self.state.activePagination;
    operation.startTotalPages = self.state.totalPages;

    operation.newPagination = new mixitup.CommandPaginate();

    operation.newPagination.limit = operation.startPagination.limit;
    operation.newPagination.page  = operation.startPagination.page;

    if (command.paginate) {
        self.parsePaginateCommand(command.paginate, operation);
    } else if (command.filter || command.sort) {
        h.extend(operation.newPagination, operation.startPagination);

        // Reset to 1, or maintain active:

        if (!self.config.pagination.maintainActivePage) {
            operation.newPagination.page = 1;
        } else {
            operation.newPagination.page = self.state.activePagination.page;
        }
    }

    return operation;
});

/**
 * @private
 * @param   {mixitup.Operation} operation
 * @param   {object}            command
 * @param   {boolean}           [isPreFetch=false]
 * @return  {mixitup.Operation}
 */

mixitup.Mixer.registerFilter('operationMappedGetOperation', 'pagination', function(operation, command, isPreFetch) {
    var self = this,
        el   = null,
        i    = -1;

    if (self.config.pagination.limit < 0) return operation;

    if (isPreFetch) {
        // The operation is being pre-fetched, so don't update the pagers or stats yet.

        return operation;
    }

    if (self.config.pagination.generatePageList && self.dom.pageListEls.length > 0) {
        for (i = 0; (el = self.dom.pageListEls[i]); i++) {
            self.renderPageListEl(el, operation);
        }
    }

    if (self.config.pagination.generatePageStats && self.dom.pageStatsEls.length > 0) {
        for (i = 0; (el = self.dom.pageStatsEls[i]); i++) {
            self.renderPageStatsEl(el, operation);
        }
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

    parsePaginateCommand: function(command, operation) {
        var self = this;

        // e.g. mixer.paginate({page: 3, limit: 2});
        // e.g. mixer.paginate({action: 'next'});
        // e.g. mixer.paginate({anchor: anchorTarget, limit: 5});

        if (command.page > -1) {
            if (command.page === 0) throw new Error(mixitup.messages.ERROR_PAGINATE_INDEX_RANGE);

            // TODO: replace Infinity with the highest possible page index

            operation.newPagination.page = Math.max(1, Math.min(Infinity, command.page));
        } else if (command.action === 'next') {
            operation.newPagination.page = self.getNextPage();
        } else if (command.action === 'prev') {
            operation.newPagination.page = self.getPrevPage();
        } else if (command.anchor) {
            operation.newPagination.anchor = command.anchor;
        }

        if (command.limit > -1) {
            operation.newPagination.limit = command.limit;
        }

        if (operation.newPagination.limit !== operation.startPagination.limit) {
            // A new limit has been sent via the API, calculate total pages

            operation.newTotalPages = operation.newPagination.limit ?
                Math.max(Math.ceil(operation.startState.matching.length / operation.newPagination.limit), 1) :
                1;
        }

        if (operation.newPagination.limit <= 0 || operation.newPagination.limit === Infinity) {
            operation.newPagination.page = 1;
        }
    },

    /**
     * @private
     * @return  {number}    page
     */

    getNextPage: function() {
        var self = this,
            page = -1;

        page = self.state.activePagination.page + 1;

        if (page > self.state.totalPages) {
            page = self.config.pagination.loop ? 1 : self.state.activePagination.page;
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

        page = self.state.activePagination.page - 1;

        if (page < 1) {
            page = self.config.pagination.loop ? self.state.totalPages : self.state.activePagination.page;
        }

        return page;
    },

    /**
     * @private
     * @param   {HTMLElement}        pageListEl
     * @param   {mixitup.Operation}  operation
     * @return  {void}
     */

    renderPageListEl: function(pageListEl, operation) {
        var self                = this,
            activeIndex         = -1,
            pagerHtml           = '',
            buttonList          = [],
            model               = null,
            renderer            = null,
            allowedIndices      = [],
            truncatedBefore     = false,
            truncatedAfter      = false,
            disabled            = null,
            el                  = null,
            html                = '',
            i                   = -1;

        if (
            operation.newPagination.limit < 0 ||
            operation.newPagination.limit === Infinity ||
            (operation.newTotalPages < 2 && self.config.pagination.hidePageListIfSinglePage)
        ) {
            // Empty the pager list, and add disabled class

            pageListEl.innerHTML = '';

            h.addClass(pageListEl, self.classNamesPageList.disabled);

            return;
        }

        activeIndex = operation.newPagination.page - 1;

        renderer = typeof (renderer = self.config.render.pager) === 'function' ?  renderer : null;

        if (self.config.pagination.maxPagers < Infinity && operation.newTotalPages > self.config.pagination.maxPagers) {
            allowedIndices = self.getAllowedIndices(operation);
        }

        // Render prev button

        model = new mixitup.ModelPager();

        model.isPrev = true;
        model.classList.push(self.classNamesPager.base, self.classNamesPager.prev);

        // If first and not looping, disable the prev button

        if (operation.newPagination.page === 1 && !self.config.pagination.loop) {
            model.classList.push(self.classNamesPager.disabled);

            model.isDisabled = true;
        }

        model.classNames = model.classList.join(' ');

        if (renderer) {
            pagerHtml = renderer(model);
        } else {
            pagerHtml = h.template(self.config.templates.pagerPrev)(model);
        }

        buttonList.push(pagerHtml);

        // Render per-page pagers

        for (i = 0; i < operation.newTotalPages; i++) {
            pagerHtml = self.renderPager(i, operation, allowedIndices);

            if (pagerHtml || (i < activeIndex && truncatedBefore) || i > activeIndex && truncatedAfter) {
                if (pagerHtml) {
                    buttonList.push(pagerHtml);
                }

                continue;
            }

            // Replace gaps between pagers with a truncation maker, but only once

            model = new mixitup.ModelPager();

            model.isTruncationMarker = true;

            model.classList.push(self.classNamesPager.base, self.classNamesPager.truncationMarker);
            model.classNames = model.classList.join(' ');

            if (renderer) {
                pagerHtml = renderer(model);
            } else {
                pagerHtml = h.template(self.config.templates.pagerTruncationMarker)(model);
            }

            buttonList.push(pagerHtml);

            // Prevent multiple truncation markers

            if (i < activeIndex) {
                truncatedBefore = true;
            }

            if (i > activeIndex) {
                truncatedAfter = true;
            }
        }

        // Render next button

        model = new mixitup.ModelPager();

        model.isNext = true;
        model.classList.push(self.classNamesPager.base, self.classNamesPager.next);

        // If last page and not looping, disable the next button

        if (operation.newPagination.page === operation.newTotalPages && !self.config.pagination.loop) {
            model.classList.push(self.classNamesPager.disabled);
        }

        model.classNames = model.classList.join(' ');

        if (renderer) {
            pagerHtml = renderer(model);
        } else {
            pagerHtml = h.template(self.config.templates.pagerNext)(model);
        }

        buttonList.push(pagerHtml);

        // Replace markup

        html = buttonList.join(' ');

        pageListEl.innerHTML = html;

        // Add disabled attribute to disabled buttons

        disabled = pageListEl.querySelectorAll('.' + self.classNamesPager.disabled);

        for (i = 0; el = disabled[i]; i++) {
            if (typeof el.disabled === 'boolean') {
                el.disabled = true;
            }
        }

        if (truncatedBefore || truncatedAfter) {
            h.addClass(pageListEl, self.classNamesPageList.truncated);
        } else {
            h.removeClass(pageListEl, self.classNamesPageList.truncated);
        }

        if (operation.newTotalPages > 1) {
            h.removeClass(pageListEl, self.classNamesPageList.disabled);
        } else {
            h.addClass(pageListEl, self.classNamesPageList.disabled);
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
            activeIndex         = operation.newPagination.page - 1,
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
     * Renderes individual, per-page pagers.
     *
     * @private
     * @param   {number}              i
     * @param   {mixitup.Operation}   operation
     * @param   {number[]}            [allowedIndices]
     * @return  {string}
     */

    renderPager: function(i, operation, allowedIndices) {
        var self        = this,
            renderer    = null,
            activePage  = operation.newPagination.page - 1,
            model       = new mixitup.ModelPager(),
            output      = '';

        if (
            self.config.pagination.maxPagers < Infinity &&
            allowedIndices.length &&
            allowedIndices.indexOf(i) < 0
        ) {
            // maxPagers is set, and this pager is not in the allowed range

            return '';
        }

        renderer = typeof (renderer = self.config.render.pager) === 'function' ?  renderer : null;

        model.isPageLink = true;

        model.classList.push(self.classNamesPager.base);

        if (i === 0) {
            model.classList.push(self.classNamesPager.first);
        }

        if (i === operation.newTotalPages - 1) {
            model.classList.push(self.classNamesPager.last);
        }

        if (i === activePage) {
            model.classList.push(self.classNamesPager.active);
        }

        model.classNames = model.classList.join(' ');
        model.pageNumber = i + 1;

        if (renderer) {
            output = renderer(model);
        } else {
            output = h.template(self.config.templates.pager)(model);
        }

        return output;
    },

    /**
     * @private
     * @param   {HTMLElement}       pageStatsEl
     * @param   {mixitup.Operation} operation
     * @return  {void}
     */

    renderPageStatsEl: function(pageStatsEl, operation) {
        var self            = this,
            model           = new mixitup.ModelPageStats(),
            renderer        = null,
            output          = '',
            template        = '';

        if (
            operation.newPagination.limit < 0 ||
            operation.newPagination.limit === Infinity ||
            (operation.newTotalPages < 2 && self.config.pagination.hidePageStatsIfSinglePage)
        ) {
            // Empty the pager list, and add disabled class

            pageStatsEl.innerHTML = '';

            h.addClass(pageStatsEl, self.classNamesPageStats.disabled);

            return;
        }

        renderer = typeof (renderer = self.config.render.pageStats) === 'function' ?  renderer : null;

        model.totalTargets = operation.matching.length;

        if (model.totalTargets) {
            template = operation.newPagination.limit === 1 ?
                self.config.templates.pageStatsSingle :
                self.config.templates.pageStats;
        } else {
            template = self.config.templates.pageStatsFail;
        }

        if (model.totalTargets && operation.newPagination.limit > 0) {
            model.startPageAt = ((operation.newPagination.page - 1) * operation.newPagination.limit) + 1;
            model.endPageAt   = Math.min(model.startPageAt + operation.newPagination.limit - 1, model.totalTargets);
        } else {
            model.startPageAt = model.endPageAt = 0;
        }

        if (renderer) {
            output = renderer(model);
        } else {
            output = h.template(template)(model);
        }

        pageStatsEl.innerHTML = output;

        if (model.totalTargets) {
            h.removeClass(pageStatsEl, self.classNamesPageStats.disabled);
        } else {
            h.addClass(pageStatsEl, self.classNamesPageStats.disabled);
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

            if (arg === null) continue;

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
                instruction.command.action = arg;
            } else if (typeof arg === 'boolean') {
                instruction.animate = arg;
            } else if (typeof arg === 'function') {
                instruction.callback = arg;
            }
        }

        h.freeze(instruction);

        // NB: Don't freeze command as may need to be sanitized later by other methods

        return instruction;
    },

    /**
     * Changes the current page and/or the current page limit.
     *
     * @example
     *
     * .paginate(page [, animate] [, callback])
     *
     * @example <caption>Example 1: Changing the active page</caption>
     *
     * console.log(mixer.getState().activePagination.page); // 1
     *
     * mixer.paginate(2)
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.page === 2); // true
     *     });
     *
     * @example <caption>Example 2: Progressing to the next page</caption>
     *
     * console.log(mixer.getState().activePagination.page); // 1
     *
     * mixer.paginate('next')
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.page === 2); // true
     *     });
     *
     * @example <caption>Example 3: Starting a page from an abitrary "anchor" element</caption>
     *
     * var anchorEl = mixer.getState().show[3];
     *
     * mixer.paginate(anchorEl)
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.anchor === anchorEl); // true
     *         console.log(mixer.getState().show[0] === anchorEl); // true
     *     });
     *
     * @example <caption>Example 4: Changing the page limit</caption>
     *
     * var anchorEl = mixer.getState().show[3];
     *
     * console.log(mixer.getState().activePagination.limit); // 8
     *
     * mixer.paginate({
     *    limit: 4
     * })
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.limit === 4); // true
     *     });
     *
     * @example <caption>Example 5: Changing the active page and page limit</caption>
     *
     * mixer.paginate({
     *    limit: 4,
     *    page: 2
     * })
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.page === 2); // true
     *         console.log(mixer.getState().activePagination.limit === 4); // true
     *     });
     *
     * @public
     * @instance
     * @param       {(number|string|object|HTMLElement)}    page
     *     A page number, string (`'next'`, `'prev'`), HTML element reference, or command object.
     * @param       {boolean}   [animate=true]
     *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
     * @param       {function}  [callback=null]
     *      An optional callback function to be invoked after the operation has completed.
     * @return      {Promise.<mixitup.State>}
     *     A promise resolving with the current state object.
     */

    paginate: function() {
        var self        = this,
            instruction = self.parsePaginateArgs(arguments);

        return self.multimix({
            paginate: instruction.command
        }, instruction.animate, instruction.callback);
    },

    /**
     * A shorthand for `.paginate('next')`. Moves to the next page.
     *
     * @example
     *
     * .nextPage()
     *
     * @example <caption>Example: Moving to the next page</caption>
     *
     * console.log(mixer.getState().activePagination.page); // 1
     *
     * mixer.nextPage()
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.page === 2); // true
     *     });
     *
     * @public
     * @instance
     * @return      {Promise.<mixitup.State>}
     *     A promise resolving with the current state object.
     */

    nextPage: function() {
        var self        = this,
            instruction = self.parsePaginateArgs(arguments);

        return self.multimix({
            paginate: {
                action: 'next'
            }
        }, instruction.animate, instruction.callback);
    },

    /**
     * A shorthand for `.paginate('prev')`. Moves to the previous page.
     *
     * @example
     *
     * .prevPage()
     *
     * @example <caption>Example: Moving to the previous page</caption>
     *
     * console.log(mixer.getState().activePagination.page); // 5
     *
     * mixer.prevPage()
     *     .then(function(state) {
     *         console.log(mixer.getState().activePagination.page === 4); // true
     *     });
     *
     * @public
     * @instance
     * @return      {Promise.<mixitup.State>}
     *     A promise resolving with the current state object.
     */

    prevPage: function() {
        var self = this,
            instruction = self.parsePaginateArgs(arguments);

        return self.multimix({
            paginate: {
                action: 'prev'
            }
        }, instruction.animate, instruction.callback);
    }
});