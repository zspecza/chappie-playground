'use strict'

module.exports = (name, dependencies, plugin) => {
  if (typeof name !== 'string') {
    throw new TypeError(
      `Expected name to be a string but got ${typeof name} "${name}"`
    )
  }
  if (dependencies && !Array.isArray(dependencies)) {
    throw new TypeError(
      `Expected dependencies to be an array or null but got ${typeof dependencies} "${dependencies}"`
    )
  }
  if (!plugin) {
    throw new ReferenceError(
      'Expected a plugin function passed as third argument, but third argument was not supplied.'
    )
  }
  if (typeof plugin !== 'function') {
    throw new TypeError(
      `Expected plugin to be a function but got ${typeof plugin} "${plugin}"`
    )
  }
  return (opts = {}) => {
    plugin = plugin.bind(null, opts)
    Object.defineProperty(plugin, 'name', { get: () => name })
    plugin.dependencies = dependencies
    plugin.isChappiePlugin = true
    return plugin
  }
}
