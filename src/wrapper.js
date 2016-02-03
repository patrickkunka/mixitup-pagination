{{>banner}}

(function(window) {
    'use strict';

    var mixitupPagination = function(mixitup) {
        var h = mixitup.h;

        {{>version-check}}

        {{>config-callbacks}}

        {{>config-load}}

        {{>config-pagination}}

        {{>config-selectors}}

        {{>config}}

        {{>operation}}

        {{>state}}

        {{>mixer-dom}}

        {{>events}}

        {{>mixer}}
    };

    mixitupPagination.EXTENSION_VERSION       = '{{version}}';
    mixitupPagination.REQUIRE_CORE_VERSION    = '{{coreVersion}}';

    {{>module-definitions}}
})(window);