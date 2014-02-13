Pagination Controls
=========

1. [Overview](#overview)

## Overview

If enabled, pagination controls, or "pagers", are dynamically generated, added and removed based on the current filter, sort, page limit and page number.

An empty element with the class `pager-list` should be added to your markup where you want your controls to be. Pagination buttons will be generated inside this container.</p>

```
<div id="Container">
	<div class="mix"></div>
	<div class="mix"></div>
	<div class="mix"></div>
	...
</div>

<div class="pager-list">
	<!-- Pagination buttons will be generated here -->
</div>
```
> An empty element should be added to your markup to contain the pagination controls

The class of this wrapper may be changed via the `selectors.pagersWrapper` configuration option.

As with all MixItUp operations, pagination may also be controlled directly via the MixItUp API. Physical pagination buttons may therefore be disabled either via the controls.enable or pagination.generatePagers configuration options.

Each pagination button is given specific classes and data attributes for styling and behaviour. Inspect the controls of the pagination sandbox demo to learn more.