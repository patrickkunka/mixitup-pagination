# mixitup.Mixer

## Overview

The mixitup.Mixer class is extended with the following methods relating to
the Pagination extension.

For the full list of methods, please refer to the MixItUp core documentation.

### Contents

- [paginate()](#paginate)
- [nextPage()](#nextPage)
- [prevPage()](#prevPage)


<h3 id="paginate">paginate()</h3>


`.paginate(page [, animate] [, callback])`

Changes the current page and/or the current page limit.

|   |Type | Name | Description
|---|--- | --- | ---
|Param   |`number, string, object, HTMLElement` | `page` | A page number, string (`'next'`, `'prev'`), HTML element reference, or command object.
|Param   |`boolean` | `[animate]` | An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
|Param   |`function` | `[callback]` | An optional callback function to be invoked after the operation has completed.
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example 1: Changing the active page

```js

console.log(mixer.getState().activePagination.page); // 1

mixer.paginate(2)
    .then(function(state) {
        console.log(mixer.getState().activePagination.page === 2); // true
    });
```
###### Example 2: Progressing to the next page

```js

console.log(mixer.getState().activePagination.page); // 1

mixer.paginate('next')
    .then(function(state) {
        console.log(mixer.getState().activePagination.page === 2); // true
    });
```
###### Example 3: Starting a page from an abitrary "anchor" element

```js

var anchorEl = mixer.getState().show[3];

mixer.paginate(anchorEl)
    .then(function(state) {
        console.log(mixer.getState().activePagination.anchor === anchorEl); // true
        console.log(mixer.getState().show[0] === anchorEl); // true
    });
```
###### Example 4: Changing the page limit

```js

var anchorEl = mixer.getState().show[3];

console.log(mixer.getState().activePagination.limit); // 8

mixer.paginate({
   limit: 4
})
    .then(function(state) {
        console.log(mixer.getState().activePagination.limit === 4); // true
    });
```
###### Example 5: Changing the active page and page limit

```js

mixer.paginate({
   limit: 4,
   page: 2
})
    .then(function(state) {
        console.log(mixer.getState().activePagination.page === 2); // true
        console.log(mixer.getState().activePagination.limit === 4); // true
    });
```

<h3 id="nextPage">nextPage()</h3>


`.nextPage()`

A shorthand for `.paginate('next')`. Moves to the next page.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Moving to the next page

```js

console.log(mixer.getState().activePagination.page); // 1

mixer.nextPage()
    .then(function(state) {
        console.log(mixer.getState().activePagination.page === 2); // true
    });
```

<h3 id="prevPage">prevPage()</h3>


`.prevPage()`

A shorthand for `.paginate('prev')`. Moves to the previous page.

|   |Type | Name | Description
|---|--- | --- | ---
|Returns |`Promise.<mixitup.State>` | A promise resolving with the current state object.


###### Example: Moving to the previous page

```js

console.log(mixer.getState().activePagination.page); // 5

mixer.prevPage()
    .then(function(state) {
        console.log(mixer.getState().activePagination.page === 4); // true
    });
```

