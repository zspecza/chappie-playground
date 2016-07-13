'use strict'

const R = require('ramda')

module.exports = class Chappie {
  constructor (opts) {
    if (opts.use && Array.isArray(opts.use)) {
      return this.use(...opts.use)
    }
  }
  use (...plugins) {
    const inspect = R.pipe(
      R.flatten,
      R.concat(this.plugins || []),
      R.reduce((plugins, plugin, i) => {
        if (typeof plugin !== 'function') {
          throw new TypeError(
            `Invalid ${typeof plugin} ${plugin} passed to Chappie::use(). Expected a function.`
          )
        } else if (!plugin.isChappiePlugin) {
          throw new TypeError(
            `Function ${i + 1} passed to Chappie::use() is not a valid Chappie plugin. Please ensure you are registering your plugin with the "chappie-core-plugin" npm package.`
          )
        } else if (plugin.dependencies.length) {
          plugin.dependencies.forEach((dependency) => {
            const dependencyMissing = !plugins.some((plugin) => plugin.name === dependency)
            if (dependencyMissing) {
              throw new ReferenceError(
                `Plugin "${plugin.name}" depends on "${dependency}". Ensure it is installed and called before "${plugin.name}".`
              )
            }
          })
        }
        return plugins.concat(plugin)
      }, [])
    )
    this.plugins = inspect(plugins)
    return this
  }
  run (fn = (v) => v) {
    return this.plugins
      .reduce((prev, next, i) => prev.then(next).then(() => this), Promise.resolve(this))
      .then(fn)
  }
}
