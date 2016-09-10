/* global mixitup */

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