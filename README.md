MixItUp Pagination Extension
=========

## <a name='TOC'>Table of Contents</a>

1. [Introduction](#introduction)
1. [Configuration Object](#config)
1. [API Methods](#methods)
1. [State Object](#state)

## <a name='introduction'>Introduction</a>

The pagination extension adds the ability to apply a dynamic subset restriction to all MixItUp target elements. Currently, this is a client-side only functionality, so the entire set of target elements should be loaded into the DOM.

Page numbers, and total pages are dynamically calculated based on the current filter and sort parameters, and the pagination "limit" set in the configuration object.

Pagination controls, if enabled, are therefore also dynamically generated, added and removed, based on the above parameters. Create an empty element in your document with the class '.pager-list', and pagination controls will be appended to this element.

## <a name='config'>Configuration Object</a>

The pagination extension extends the MixItUp configuration object with the following properties (shown with their default values):

``` javascript

{
	pagination: {
		limit: 0,
		page: 1,
		generatePagers: false,
		pagerClass: ''
	},
	selectors: {
		pagersWrapper: '.pager-list',
		pager: '.pager'
	}
}

```

## <a name='methods'>API Methods</a>

The following API methods are added:

1. [paginate](#page)

### paginate

``` javascript
.mixItUp('paginate', arg, [,animate] [,callback])
```

Examples:

``` javascript

$('#Container').mixItUp('paginate', 2);

// go to page 2
```

``` javascript

$('#Container').mixItUp('paginate', {
	limit: 8,
	page: 1
});

// Switch limit to 8 items per page, and go to page 1.
```

The **multiMix** method is also extended:

``` javascript

$('#Container').mixItUp('multiMix', {
	filter: '.category-2',
	pagination: {
		limit: 10
	},
});

// Filter items with class 'category-2', and show 10 items per page.
```

## <a name='state'>State Object</a>

The state object is also extended with the following properties:

``` javascript

{
	limit: ... , // number of items per page
	activePage: ... , // current page
	totalPages: ... , // total number of pages
}

```

## License

Copyright 2012-2014 KunkaLabs Limited.

Not to be used or redistributed without express permission.
