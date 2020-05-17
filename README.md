A middleware to the popular redux approach (https://github.com/erikras/ducks-modular-redux)

## Features

- `debounce: number` - adds an optional debounce on promises. To use it, add `debounce` field to the return of your action creator

## Usage

`npm i ducks-client-middleware`

In your store initialize file:

```
import initClientMiddleware from 'ducks-client-middleware'
import apiClient from '<your-api-client>'

const store = configureStore({
  reducer: ...,
  middleware: [
    ...
    initClientMiddleware({
      client: apiClient
    })
  ]
```

## Parameters

| Name                                 | Description                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| client                               | Your Api client (fetch, axios, etc.) that you use in action creators as client.get, etc. |
| handleError ({ dispatch, getState }) | Callback to handle client errors. Dispatch and getState are bypassed from the middleware |  |

## Examples

```
export const login = name => ({
  types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
  promise: (client) => client.post('/login', {
    data: {
      name: name
    }
  }),
  debounce: 500
})
```
