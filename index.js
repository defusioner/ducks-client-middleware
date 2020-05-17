export const createDebouncePromise = (func, wait) =>
  new Promise((res, rej) =>
    setTimeout(() => {
      try {
        const result = func()
        res(result)
      } catch (e) {
        rej(e)
      }
    }, wait)
  )

export default function clientMiddleware({ client, handleError }) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      const { promise, types, debounce, ...rest } = action
      if (!promise) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types
      next({ ...rest, type: REQUEST })

      const actionPromise = debounce
        ? createDebouncePromise(() => promise(client), debounce)
        : promise(client)

      actionPromise
        .then(result => next({ ...rest, result, type: SUCCESS }))
        .catch(error => {
          handleError({ error, dispatch, getState })

          next({ ...rest, error, type: FAILURE })
        })

      return actionPromise
    }
  }
}
