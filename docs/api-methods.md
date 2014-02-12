API Methods
=========

1. [Overview](#overview)
1. [Methods Details](#method-details)

<h2 name="overview">Overview</h2>

The Pagination extension adds three new methods to the MixItUp API.

<h2 name="method-details">Method Details</h2>

!!To do

*Optional parameters are shown in square-brackets.*

1. [instantiate](#instantiate)

<h3 name="method-page">page</h3>

!!To do

```
.mixItUp([configurationObject])
```

Instantiate MixItUp via a jQuery object.

Parameters | configurationObject
--- | --- 
Type | Object
Default | `null`
Description | See Configuration Object

This is the first and most important method of any MixItUp project and allows us to turn a DOM element into a MixItUp container.

With no parameters, MixItUp will be instantiated with the default configuration options. For advanced configuration, any number of options may be passed as an object literal. See Configuration Object.

```
$('#Container').mixItUp();
```
> Instantiate MixItUp on the element with ID "Container", with its default configuration options

<br/>

-------
*&copy; 2014 KunkaLabs Limited*