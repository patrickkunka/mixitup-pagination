/* globals mixitup, h */

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

        if (!mixer.config.pagination || mixer.config.pagination.limit < 0 || mixer.config.pagination.limit === Infinity) {
            // Pagination is disabled for this instance. Do not handle.

            commands[i] = null;

            continue;
        }

        if (!button || h.hasClass(button, mixer.classNamesPager.active) || h.hasClass(button, mixer.classNamesPager.disabled)) {
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