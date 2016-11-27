# MixItUp Pagination

MixItUp Pagination is a premium extension for the MixItUp 3, adding dynamic and responsive client-side pagination to filterable and sortable content.

### Features

- Paginate through **filtered** and **sorted** content
- Real-time page limit configuration – ideal for **responsive** grids
- Real-time **dynamically generated controls** and **page statistics** based on the current filter, sort, and page limit values
- New API methods
- New configuration options

### Uses

- Increase usability and reduce excessive scrolling when dealing with large datasets
- Provide visual feedback about content to users as they filter and sort

### Limitations

- Client-side only - the entire target collection must exist in the DOM

*NB: If you're looking to integrate server-side ajax pagination with MixItUp, consider using MixItUp 3's Dataset API.*

## Get Started

### Installing Extensions

Premium extensions are not publicly available via GitHub or NPM and must therefore be downloaded from your KunkaLabs account after purchase. Once downloaded they can be included in your project in a directory of your choosing, and then required as modules, or globally via a script tag.

#### Script Tag

If using a script tag, you simply need to load the pagination distribution script (i.e. `mixitup-pagination.min.js`) **after** mixitup, and the extension will automatically detect the `mixitup` global variable and install itself.

```html
        ...

        <script src="/path/to/mixitup.min.js"></script>
        <script src="/path/to/mixitup-pagination.min.js"></script>
    </body>
</html>
```

#### Module Import

If you are building a modular JavaScript project with Webpack, Browserify, or RequireJS, no global variables are exposed. Firstly require both the MixItUp core *and* the Pagination extension into your module. Then call `mixitup.use()` with the extension passed in as an argument. Your extension will be installed and made available to all MixItUp instances throughout your project.

```js
// ES2015

import mixitup from 'mixitup'; // loaded from node_modules
import mixitupPagination from '../path/to/mixitup-pagination'; // loaded from a directory of your choice within your project

// Call the mixitup factory's .use() method, passing in the extension to install it

mixitup.use(mixitupPagination);
```

```js
// CommonJS

var mixitup = require('mixitup');
var mixitupPagination = require('../path/to/mixitup-pagination');

mixitup.use(mixitupPagination);
```

```js
// AMD

require([
    'mixitup',
    '../path/to/mixitup-pagination'
], function(
    mixitup,
    mixitupPagination
) {
    mixitup.use(mixitupPagination);
});
```

You need only call the `.use()` function once per project, per extension, as module loaders will cache a single reference to MixItUp inclusive of all changes made.

### Using Pagination

MixItUp Pagination extends MixItUp's API and configuration object with various new methods and properties.

By default, pagination functionality is disabled so that you can use MixItUp as normal, even with the extension installed. To enable pagination functionality for a mixer, you simply need to set a value for the `pagination.limit` configuration option.

```js
var mixer = mixitup(containerEl, {
    pagination: {
        limit: 8 // impose a limit of 8 targets per page
    }
});
```

### Page List UI

Given a "page list" element in DOM, MixItUp Pagination will automatically generate a list of "pager" controls allowing the user to move from page to page, as well as providing visual feedback about the current number of pages.

MixItUp Pagination will query the DOM for an element matching the `selectors.pageList` configuration option (`'.mixitup-page-list'` by default). If a matching element is found, a list of pager buttons will be automatically rendered inside this element.

```html
<div class="container">
    <div class="mix"></div>
    <div class="mix"></div>
    ...
</div>

<div class="mixitup-page-list"></div>
```

### Page Stats UI

Given a "page stats" element in the DOM, MixItUp Pagination will automatically render information about the page and matching dataset, for example "5-8 of 32".

MixItUp Pagination will query the DOM for an element matching the `selectors.pageStats` configuration option (`'.mixitup-page-stats'` by default). If a matching element is found, content will be rendered inside this element.

```html
<div class="container">
    <div class="mix"></div>
    <div class="mix"></div>
    ...
</div>

<div class="mixitup-page-list"></div>
<div class="mixitup-page-stats"></div>
```

## Using the API

As with the MixItUp core, the default "pager" controls are optional. If you wish to change the curent page or page limit via the API, MixItUp Pagination adds several new mixer API methods allowing API-based full control.

###### Example: Calling an API method

```js
var mixer = mixitup(containerEl, {
    pagination: {
        limit: 12
    }
});

mixer.paginate(2); // go to page 2
```

Further reading: [Mixer API Methods](./docs/mixitup.Mixer.md)

## Configuration

MixItUp Pagination adds various new properties to the configuration object. If no configuration object is passed, the default settings will be used. However, `pagination.limit` must always be set to a value greater than `0` if you wish to enable pagination on instantiation.

###### Example: Customizing pagination options

```js
var mixer = mixitup(containerEl, {
    pagination: {
        limit: 4,
        maintainActivePage: false,
        loop: true,
        hidePageListIfSinglePage: true
    },
    load: {
        page: 3 // load page 3 on instantiation
    }
});
```

Further reading: [Configuration Object](/docs/mixitup.Config.md)

