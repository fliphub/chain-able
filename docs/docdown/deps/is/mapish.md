# mapish.js API documentation

<!-- div class="toc-container" -->

<!-- div -->

## `is.prototype`
* <a href="#is-prototype-exports">`is.prototype.exports`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `is.prototype`

<!-- div -->

<h3 id="is-prototype-exports"><a href="#is-prototype-exports">#</a>&nbsp;<code>is.prototype.exports(x)</code></h3>
[&#x24C8;](https://github.com/fluents/chain-able/blob/master/src/deps/is/mapish.js#L30 "View in source") [&#x24C9;][1]



#### Since
3.0.0

#### Arguments
1. `x` *(&#42;)*: value to check

#### Returns
*(boolean)*: isMapish

#### Example
```js
isMapish(new Map)
   //=> true

   isMapish(new Chain)
   //=> true

   isMapish({})
   //=> false

   isMapish(1)
   //=> false
```
---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #is.prototype "Jump back to the TOC."
