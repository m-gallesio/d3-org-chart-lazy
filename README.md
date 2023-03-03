An extension to [d3-org-chart](https://github.com/bumbeishvili/org-chart) which enables lazy loading.

Please note that this package **IS STILL IN ALPHA** and subject to breaking changes. Use it at your own risk and feel free to report any issues.

# Installation

This package is [available on npm](https://www.npmjs.com/package/d3-org-chart-lazy) and includes its own TypeScript definitions.
The original `d3-org-chart` must be also installed for this plugin to work.
If your project uses TypeScript, installing its typings is also recommended.

```
npm install d3-org-chart
npm install d3-org-chart-lazy
npm install @types/d3-org-chart-lazy --save-dev
```

# Usage

Via import:

```javascript

import { LazyOrgChart } from "d3-org-chart-lazy";

const chart = new LazyOrgChart()
	.hasChildren(item => item.hasChildren)
	.loadChildren(item => repository.get("/children/" + item.id))
	.afterUpdate(() => { console.log("Done"); })
	// ... any other configuration from the original OrgChart

```

Via `script` tag:

```html

<script src="/path/to/d3.js"></script>
<script src="/path/to/d3-flextree.js"></script>
<script src="/path/to/d3-org-chart.js"></script>
<script src="/path/to/d3-org-chart-lazy.js"></script>

<script>

const chart = new d3.LazyOrgChart()
	.hasChildren(item => item.hasChildren)
	.loadChildren(item => repository.get("/children/" + item.id))
	.afterUpdate(() => { console.log("Done"); })
	// ... any other configuration from the original OrgChart

</script>

```

# API

This package exports a single `LazyOrgChart` class which extends the original `OrgChart`.
All the properties and methods of `OrgChart` can be used verbatim.

Additionally, the following three options are available.
All of them follow the original get/set conventions, which mean they can be either:
- called with no arguments: gets the option's value
- called with an argument of matching type: sets the option's value and returns the chart object

## `hasChildren` (mandatory)
A function which, given a data item, returns a `boolean` indicating whether the node is known to have children to load.

## `loadChildren` (mandatory)
A function which, given a data item, returns a `Promise` which will resolve with the node's children. This loading logic will depend on the actual technology being used (e.g. a `fetch` wrapper).

## `afterUpdate` (optional)
A hook to performs extra actions after the tree is redrawn.

# License

This plugin it MIT licensed.
Additionally, if the mantainers of `d3-org-chart` consider this plugin useful I give **full permission** to them to integrate its code into the original `d3-org-chart` library without credit.
Portions of the code are adapter from the original `d3-org-chart` library.
