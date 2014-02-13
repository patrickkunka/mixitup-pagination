API Methods
=========

1. [Overview](#overview)
1. [Methods Details](#method-details)

<h2 name="overview">Overview</h2>

The Pagination extension adds three new methods to the MixItUp API.

<h2 name="method-details">Method Details</h2>

*Optional parameters are shown in square-brackets.*

1. [paginate](#paginate)
1. [prevPage](#prevPage)
1. [nextPage](#nextPage)

<h3 name="method-paginate">paginate</h3>

```
.mixItUp('paginate', paginateCommand [,animate] [,callback])
```

Change the current page or page limit, triggering a pagination animation.

Parameters | paginateCommand | animate | callback
--- | --- | --- | ---
Type | Number/Object | Boolean | Function
Default | - | `true` | `null`
Description | The number of the page to go to, and also (when passed as an object) the number of items to show per page. | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

This is the first and most important method of any MixItUp project and allows us to turn a DOM element into a MixItUp container.

With no parameters, MixItUp will be instantiated with the default configuration options. For advanced configuration, any number of options may be passed as an object literal. See Configuration Object.

```
$('#Container').mixItUp('paginate', 3);
```
> Go to page 3

<br/>

```
$('#Container').mixItUp('paginate', {limit: 10});
```
> Change the limit to 10 target elements per page

<br/>

```
$('#Container').mixItUp('paginate', {
	page: 1,
	limit: 8
});
```
> Go to page 1 and set the limit to 8 target elements per page

<h3 name="method-prevPage">prevPage</h3>

Go to the previous page.

```
.mixItUp('prevPage' [,animate] [,callback])
```

Parameters  | animate | callback
--- | --- | ---
Type | Boolean | Function
Default | `true` | `null`
Description | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

If the `pagination.loop` configuration option is set to `true` MixItUp will loop from the last to first and first to last page.

```
$('#Container').mixItUp('prevPage');
```
> Go to the previous page

This method is a short-hand for `self.multiMix({paginate: self._getPrevPage()});`

<h3 name="method-nextPage">nextPage</h3>

Go to the next page.

```
.mixItUp('nextPage' [,animate] [,callback])
```

Parameters  | animate | callback
--- | --- | ---
Type | Boolean | Function
Default | `true` | `null`
Description | A boolean indicating whether to animate the filtering operation (asynchronously), or perform it instantly (synchronously). | An optional callback function to be called after the filter operation has completed.

If the `pagination.loop` configuration option is set to `true` MixItUp will loop from the last to first and first to last page.

```
$('#Container').mixItUp('nextPage');
```
> Go to the next page

This method is a short-hand for self.multiMix({paginate: self._getNextPage()});

<br/>

-------
*&copy; 2014 KunkaLabs Limited*