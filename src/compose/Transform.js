const TraverseChain = require('../TraverseChain')
const isObj = require('../deps/is/obj')
const isTrue = require('../deps/is/true')
const isFalse = require('../deps/is/false')
const isUndefined = require('../deps/is/undefined')
const ObjectKeys = require('../deps/util/keys')
const dotPropPaths = require('../deps/dot/paths')
const TRANSFORMERS_KEY = require('../deps/meta/transformers')
const OBSERVERS_KEY = require('../deps/meta/observers')

/**
 * @param  {Class | Composable} SuperClass composable class
 * @return {TransformChain} class
 * @example
 *    compose(class {})
 *    //=> TransformChain
 */
module.exports = SuperClass => {
  /**
   * @class TransformChain
   * @member TransformChain
   * @extends {ChainedMap}
   * @memberOf compose
   * @category Chainable
   *
   * @tests TransformChain
   * @types TransformChain
   *
   * @symb 🤖
   * @type {Map}
   *
   * @see deps/traverse
   * @see TraverseChain
   *
   * {@link https://github.com/iluwatar/java-design-patterns/tree/master/state state-pattern}
   * {@link https://github.com/iluwatar/java-design-patterns/tree/master/strategy strategy-pattern}
   */
  return class Transform extends SuperClass {
    // -------------------------------------------

    /**
     * @desc traverse `this`, or `this.entries`
     * @since 1.0.2
     *
     * @param  {boolean | traversable} [useThis=false] use the instance properties that are `mapish` as well
     * @return {TraverseChain} @chainable
     *
     * @see TraverseChain
     * @see js-traverse
     *
     * @example
     *  TAKE FROM TRAVERSECHAIN
     */
    traverse(useThis = false) {
      /* prettier-ignore */
      return new TraverseChain(this)
        .obj(isFalse(useThis)
          ? this.entries(true)
          : isTrue(useThis)
            ? this
            : useThis
        )
    }

    /**
     * @since 1.0.2
     * @memberOf TransformChain
     *
     * @param  {string | Function} key currently just string
     * @param  {Function} value callback accepting the value as only arg to transform with
     * @return {TransformChain} @chainable
     *
     * @TODO dot-prop here
     *
     * @example
     *
     *   // coerce values with .id into the value they hold
     *   chain
     *     .transform('dis', val => (typeof val === 'string' ? val : val.id))
     *
     *   chain.set('dis', 'eh')
     *   chain.get('dis')
     *   //=> 'eh'
     *
     *   chain.set('dis', {id: 'eh'})
     *   chain.get('dis')
     *   //=> 'eh'
     *
     *
     * @example
     *
     *    import {format} from 'date-fns/esm'
     *    import {Chain} from 'chain-able'
     *
     *    const chain = new Chain()
     *    chain.transform('created_at', date => format(date, 'MM/DD/YYYY'))
     *    chain.set('created_at', new Date())
     *
     *    // is formatted human-readable pretty!
     *    const {created_at} = chain.entries()
     *    //=> '02/11/2014'
     *
     */
    transform(key, value) {
      return this.meta(TRANSFORMERS_KEY, key, value)
    }

    /**
     * @memberOf TransformChain
     *
     * @override
     * @inheritdoc
     * @since 1.0.0
     *
     * @param {Primitive} key key to set with
     * @param {any} val value to set for key
     * @param {undefined | string | Array<string>} dotPropKey special key used for initializing dot prop values in an optimized way to keep reference
     * @return {Chainable} @chainable
     *
     * @see this.observe, this.transform
     */
    set(key, val, dotPropKey) {
      let value = val

      // get
      const transformers = this.meta(TRANSFORMERS_KEY, key)
      for (let t = 0; t < transformers.length; t++) {
        value = transformers[t].call(this, value, this)
      }

      super.set(key, value)

      const data = {key: dotPropKey, value}
      if (isUndefined(dotPropKey)) {
        data.key = isObj(value) ? dotPropPaths(key, value) : key
      }

      // get
      const observers = this.meta(OBSERVERS_KEY)
      for (let o = 0; o < observers.length; o++) {
        observers[o](data)
      }

      return this
    }

    // --- remap ---
    /**
     * @desc remap properties from 1 to another, for example, apis with inconsistent naming
     * @memberOf TransformChain
     * @since 1.0.0
     * @symb 🗺
     *
     * @param  {string | Object} from property name string, or {[from]: to}
     * @param  {string} [to=undefined] property name to change key to
     * @return {Chain} @chainable
     *
     * @see TransformChain.transform
     * @IDEA could also be a function, but then might as well use .transform
     *
     * @example
     *
     *  chain
     *    .remap('dis', 'dat')
     *    .from({dis: true})
     *
     *  chain.entries()
     *  //=> {dat: true}
     *
     * @example
     *
     *  chain
     *    .remap({dis: 'dat'})
     *    .from({dis: 1, other: true}}
     *
     *  chain.entries()
     *  //=> {dist: 1, other: true}
     *
     */
    remap(from, to) {
      let remap = from
      if (!isObj(from)) remap = {[from]: to}

      /* prettier-ignore */
      ObjectKeys(remap).forEach(key => this.transform(key, val => {
        this.set(remap[key], val)
        return val
      }))

      return this
    }
  }
}
