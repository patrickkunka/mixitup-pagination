{{>banner}}

(function(window) {
    'use strict';

    var mixitupPagination = function(mixitup) {
        var h = mixitup.h;

        {{>version-check}}

        {{>config-classnames}}

        {{>config-load}}

        {{>config-pagination}}

        {{>config-selectors}}

        {{>config}}

        {{>ui-classnames}}

        {{>control-definition}}

        {{>control}}

        {{>command-multimix}}

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