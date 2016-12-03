/* global mixitupPagination */

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = mixitupPagination;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return mixitupPagination;
    });
} else if (window.mixitup && typeof window.mixitup === 'function') {
    mixitupPagination(window.mixitup);
} else {
    throw new Error('[MixItUp Pagination] MixItUp core not found');
}