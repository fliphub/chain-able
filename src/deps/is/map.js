const toS = require('./toS')

/**
 * @desc Checks if `value` is classified as a `Map` object.
 * @param  {*} x value
 * @return {boolean} isMap
 *
 * @since 3.0.0
 * @memberOf is
 * @func isMap
 * @see https://github.com/jonschlinkert/kind-of
 *
 * @example
 *
 *  isMap(new Map())
 *  //=> true
 *  isMap(new Map.entries())
 *  //=> false
 *  isMap(new Set())
 *  //=> false
 *  isMap({})
 *  //=> false
 *  isMap('')
 *  //=> false
 *  isMap(1)
 *  //=> false
 *  isMap(new WeakMap)
 *  // => false
 *
 * @example
 *
 *  const e = {}
 *  eh[Symbol.toStringTag] = '[object Map]'
 *  isMap(eh)
 *
 * @example
 *
 *  class Eh extends Map()
 *  isMap(new Eh())
 *  //=> true
 *
 */
module.exports = x => x instanceof Map || toS(x) === '[object Map]'
