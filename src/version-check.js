/* global mixitupPagination, mixitup, h */
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