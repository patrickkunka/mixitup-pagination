/* globals mixitup, h */

/**
 * @param   {object}        command
 * @param   {*[]}           args
 * @return  {object|null}
 */

mixitup.Control.addFilter('handleClick', 'pagination', function(command, args) {
    var self            = this,
        page            = '',
        pageNumber      = -1,
        mixer           = null,
        button          = null,
        e               = args[0],
        i               = -1;

    if (!self.pagination || self.pagination.limit < 0 || self.pagination.limit === Infinity) return;

    button = h.closestParent(e.target, self.selector, true, self._dom.document);

    if (!button) return;

    page = button.getAttribute('data-page');

    if (page === 'prev') {
        command.page = 'prev';
    } else if (page === 'next') {
        command.page = 'next';
    } else if (pageNumber) {
        command.page = parseInt(page);
    }

    if (h.hasClass(button, self.bound[0].controls.activeClass)) {
        // Button is already active, do not handle

        return null;
    }

    for (i = 0; mixer = self.bound[i]; i++) {
        if (mixer._lastClicked) {
            mixer._lastClicked = button;
        }
    }

    return command;
});