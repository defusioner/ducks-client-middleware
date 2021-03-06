const createDebouncePromise = (func, wait) =>
  new Promise(res =>
    setTimeout(() => {
      res(func())
    }, wait)
  )

const initClientMiddleware = ({ client, handleError }) => ({
  dispatch,
  getState
}) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }

  const { promise, types, debounce, persist, ...rest } = action
  if (!promise) {
    return next(action)
  }

  const propsToBind = {
    ...rest,
    ...(persist ? { __persisted__: persist(getState()) } : {})
  }

  const [REQUEST, SUCCESS, FAILURE] = types
  next({ ...propsToBind, type: REQUEST })

  const actionPromise = debounce
    ? createDebouncePromise(() => promise(client), debounce)
    : promise(client)

  actionPromise
    .then(result => next({ ...propsToBind, result, type: SUCCESS }))
    .catch(error => {
      handleError && handleError({ error, dispatch, getState })

      next({ ...propsToBind, type: FAILURE })
    })

  return actionPromise
}

module.exports = initClientMiddleware
