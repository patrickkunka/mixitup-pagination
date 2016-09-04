{{>banner}}

(function(window) {
    'use strict';

    var mixitupPagination = function(mixitup) {
        var h = mixitup.h;

        {{>version-check}}

        {{>config-load}}

        {{>config-pagination}}

        {{>config-selectors}}

        {{>config}}

        {{>control-definition}}

        {{>control}}

        {{>command-paginate}}

        {{>operation}}

        {{>state}}

        {{>mixer-dom}}

        {{>mixer}}
    };

    mixitupPagination.NAME                    = '{{name}}'
    mixitupPagination.EXTENSION_VERSION       = '{{version}}';
    mixitupPagination.REQUIRE_CORE_VERSION    = '{{coreVersion}}';

    {{>module-definitions}}
})(window);