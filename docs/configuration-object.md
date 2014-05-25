Configuration Object
=========

1. [Overview](#overview)
1. [Object Defaults](#object-defaults)
1. [Options by Group](#options-by-group)
1. [Option Details](#option-details)

<h2 name='overview'>Overview</h2>

The Pagination extension extends the MixItUp configuration object with the following properties and groups.

<h2 name='object-defaults'>Object defaults</h2>

Options groups added or extended by the pagination extension are listed below.

```
{
	load: {
		page: 1
	},
	
	pagination: {
		limit: 0,
		loop: false,
		generatePagers: true,
		maxPagers: 5,
		pagerClass: '',
		prevButtonHTML: '«',
		nextButtonHTML: '»'
	},
	
	selectors: {
		pagersWrapper: '.pager-list',
		pager: '.pager'
	}
}
```

<h2 name='options-by-group'>Options by Group</h2>

### load

This group defines MixItUp's initial behaviour on first load.

1. [page](#loadpage)

### pagination

This group is added by the pagination extension and contains properties relating to pagination.

1. [limit](#paginationlimit)
1. [loop](#paginationloop)
1. [generatePagers](#paginationgeneratepagers)
1. [maxPagers](#paginationmaxpagers)
1. [pagerClass](#paginationpagerclass)
1. [prevButtonHTML](#paginationprevbuttonhtml)
1. [nextButtonHTML](#paginationnextbuttonhtml)

### selectors

This group allows the customisation of the default selector strings used for target elements, and clickable user-interface elements.

1. [pagersWrapper](#selectorspagerswrapper)
1. [pager](#paginationpager)

<h2 name='option-details'>Option Details</h2>

<h3 name='loadpage'>load.page</h3>

type: **Number** / default `1`

The page to load when MixItUp first instantiates.

Page numbers are 1-indexed (starting from 1, not 0). By default, the first page is loaded.

```
$('#Container').mixItUp({
	load: {
		page: 4
	}
});
```
> Show page 4 when MixItUp first loads

<br/>
<hr/>

<h3 name='paginationlimit'>pagination.limit</h3>

type: **Number** / default `0`

The maximum number of target elements per page.

A limit of 0 disables page limiting, and no pages are therefore created by default.

```
$('#Container').mixItUp({
	pagination: {
		limit: 8
	}
});
```
> Set a limit of 8 target elements per page.

<h3 name='paginationloop'>pagination.loop</h3>

type: **Boolean** / default `false`

Enable or disable page looping.

By default, when the last page is active, the next page button is disabled, and similarly when the first page active, the previous page button is disabled.

When set to `true`, the user may page from the last page to the first and from the first to last as with an infinite carousel.

This option also affects the behaviour of the nextPage and prevPage API methods.

```
$('#Container').mixItUp({
	pagination: {
		loop: true
	}
});
```
> Enabling looping

<h3 name='paginationgeneratePagers'>pagination.generatePagers</h3>

type: **Boolean** / default `true`

Enable or disable the automatic generation of pagination buttons, or “pagers”.

This may be set to `false` if you are interacting directly via the API.

See Pagination Controls for more information.

```
$('#Container').mixItUp({
	pagination: {
		generatePagers: false
	}
});
```
> Disable automatic generation of pagination buttons

<h3 name='paginationmaxPagers'>pagination.maxPagers</h3>

type: **Integer** or **Boolean** / default `5`

Set the maximum number of pager controls to be generated. By default, a maximum of 5 buttons will be generated.

If there are more than 5 pages, buttons for those pages not within the nearest 5-page range will be dynamically hidden and shown depending on the current active page. 

The minimum number of pagers is 5. This property may also be set to `false` to allow for an infinite number of pager buttons.

```
$('#Container').mixItUp({
	pagination: {
		maxPagers: 10
	}
});
```
> Allow up to 10 pager buttons to be generated at any time

```
$('#Container').mixItUp({
	pagination: {
		maxPagers: false
	}
});
```
> Disable pager button limiting

<h3 name='paginationpagerClass'>pagination.pagerClass</h3>

type: **String** / default `''`

An optional class to add to generated pagination buttons, for styling purposes.

```
$('#Container').mixItUp({
	pagination: {
		pagerClass: 'btn'
	}
});
```
> Add the class "btn" to all pagers

<h3 name='paginationprevbuttonhtml'>pagination.prevButtonHTML</h3>

type: **String** / default `'«'`

The HTML content of the generated “previous page” button (with class `page-prev`). 

By default this is the HTML character code for a left double angle quote, but can be customized to a string, glyph of icon-font character of your choice.

```
$('#Container').mixItUp({
	pagination: {
		prevButtonHTML: 'Newer Posts',
		nextButtonHTML: 'Older Posts',	
	}
});
```
> Change previous and next button HTML to custom text.

<h3 name='paginationnextbuttonhtml'>pagination.nextButtonHTML</h3>

type: **String** / default `'»'`

The HTML content of the generated "next page" button (with class page-next).

By default this is the HTML character code for a right double angle quote, but can be customized to a string, glyph of icon-font character of your choice.

```
$('#Container').mixItUp({
	pagination: {
		prevButtonHTML: 'Newer Posts',
		nextButtonHTML: 'Older Posts',	
	}
});
```
> Change previous and next button HTML to custom text.

<br/>
<hr/>

<h3 name='selectorspagerswrapper'>selectors.pagersWrapper</h3>

type: **String** / default `'.pager-list'`

A selector used to find the wrapper in which pagination controls are generated.

```
$('#Container').mixItUp({
	selectors: {
		pagersWrapper: '.pagination-controls'
	}
});
```
> Generate pagination controls inside the element with the class ".pagination-controls"

<h3 name='selectorspager'>selectors.pager</h3>

type: **String** / default `'.pager'`

A selector used to bind click events on pager buttons.

You may wish to change this if you are building your own physical controls. This does not affect the markup generated for pagination buttons, which are always given the class "pager".

```
$('#Container').mixItUp({
	selectors: {
		pager: '.pager-btn'
	}
});
```
> Bind click event handlers for pagination to any element with the class "pager-btn"

<br/>

-------
*&copy; 2014 KunkaLabs Limited*