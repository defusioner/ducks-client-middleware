const initMiddleware = require('./index')

test('[simple action] should register an action to the redux pipeline', () => {
  const dispatch = jest.fn()
  const next = jest.fn()
  const action = {
    type: 'DO_SOMETHING'
  }

  initMiddleware({})({ dispatch })(next)(action)

  expect(next).toHaveBeenCalledWith(action)
})

test('[action as a function] should execute an action and register it to the redux pipeline', () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const next = jest.fn()

  const action = jest.fn(params => ({
    type: 'DO_SOMETHING',
    params
  }))

  initMiddleware({})({ dispatch, getState })(next)(action)

  expect(action).toHaveBeenCalledWith(dispatch, getState)
})

test('[action with a promise] should execute an action with a promise that resolves', async () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const next = jest.fn()
  const client = 'client'
  const promise = jest.fn(() => Promise.resolve())

  const REQUEST = 'REQUEST'
  const SUCCESS = 'SUCCESS'
  const FAIL = 'FAIL'

  const action = () => ({
    types: [REQUEST, SUCCESS, FAIL],
    promise
  })

  await initMiddleware({ client })({ dispatch, getState })(next)(action())

  expect(next).toHaveBeenCalledWith({ type: REQUEST })
  expect(next).toHaveBeenCalledWith({ type: SUCCESS })
  expect(promise).toHaveBeenCalledWith(client)
})

test('[action in debounce] should resolve an action after some time', async () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const next = jest.fn()
  const promise = jest.fn(() => Promise.resolve())

  const REQUEST = 'REQUEST'
  const SUCCESS = 'SUCCESS'
  const FAIL = 'FAIL'

  const action = () => ({
    types: [REQUEST, SUCCESS, FAIL],
    promise,
    debounce: 1000
  })

  await initMiddleware({})({ dispatch, getState })(next)(action())

  expect(next).toHaveBeenCalledWith({ type: REQUEST })
  expect(next).toHaveBeenCalledWith({ type: SUCCESS })
})

test('[reject in debounce] should reject an action after some time', async () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const next = jest.fn()
  const error = { message: 'server error' }
  const promise = jest.fn(() => Promise.reject(error))

  const REQUEST = 'REQUEST'
  const SUCCESS = 'SUCCESS'
  const FAIL = 'FAIL'

  const action = () => ({
    types: [REQUEST, SUCCESS, FAIL],
    promise,
    debounce: 100
  })

  await expect(
    initMiddleware({})({ dispatch, getState })(next)(action())
  ).rejects.toEqual(error)

  expect(next).toHaveBeenCalledWith({ type: REQUEST })
  expect(next).toHaveBeenCalledWith({ type: FAIL })
})

test('[action with a promise] should execute an action with a promise that rejects, and handle the error', async () => {
  const dispatch = jest.fn()
  const getState = jest.fn()
  const next = jest.fn()
  const handleError = jest.fn()
  const error = { message: 'server error' }

  const promise = () => Promise.reject(error)

  const REQUEST = 'REQUEST'
  const SUCCESS = 'SUCCESS'
  const FAIL = 'FAIL'

  const action = () => ({
    types: [REQUEST, SUCCESS, FAIL],
    promise
  })

  await expect(
    initMiddleware({
      handleError
    })({ dispatch, getState })(next)(action())
  ).rejects.toEqual(error)

  expect(next).toHaveBeenCalledWith({ type: REQUEST })
  expect(next).toHaveBeenCalledWith({ type: FAIL })
  expect(handleError).toHaveBeenCalledWith({
    dispatch,
    error,
    getState
  })
})
