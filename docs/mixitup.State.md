# mixitup.State

## Overview

`mixitup.State` objects expose various pieces of data detailing the state of
a MixItUp instance. They are provided at the start and end of any operation via
callbacks and events, with the most recent state stored between operations
for retrieval at any time via the API.

### Contents

- [activePagination](#activePagination)
- [totalPages](#totalPages)


<h3 id="activePagination">activePagination</h3>




The currently active pagination command as set by a control click or API call.


|Type | Default
|---  | ---
|`mixitup.CommandPagination`| `null`


<h3 id="totalPages">totalPages</h3>




The total number of pages produced as a combination of the current page
limit and active filter.


|Type | Default
|---  | ---
|`number`| `-1`


