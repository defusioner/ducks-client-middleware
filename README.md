A middleware to the popular redux approach (https://github.com/erikras/ducks-modular-redux)

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

### Initialize parameters

| Name                                 | Description                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| client                               | Your Api client (fetch, axios, etc.) that you use in action creators as client.get, etc. |
| handleError ({ dispatch, getState }) | Callback to handle client errors. Dispatch and getState are bypassed from the middleware |  |

### Action creator parameters (to use, add a field to the return of your action creator)

- `debounce: number` - adds a debounce on request. Could be used for visual purposes during too fast requests (e.g.: convenient loader display)
- `persist: (state) => any` - adds data persistence between `START`, `SUCCESS` and `FAIL` action steps. The persisted data is stored under `action.__persisted__`. Could be used to undo an effect created on one request start, on its fail


## Examples

```
export const login = name => ({
  types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
  promise: client => client.post('/login', {
    data: {
      name
    }
  }),
  debounce: 500
})
```

In a real application this action creator will be used as is:

`App.js`
```
import { connect } from 'react-redux'

const App = ({ login }) => {
    // Somewhere here we call login
}

export default connect(null, { login })(App)
```
