export const memoize = <ARG, R>(fn: (arg: ARG) => R): ((arg: ARG) => R) => {
  const cache = new Map()
  return (arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)
    }
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}
