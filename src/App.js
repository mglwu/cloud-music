import React from 'react'
import {HashRouter} from 'react-router-dom'
import {renderRoutes} from 'react-router-config'
import {Provider} from 'react-redux'
import routes from './routes'
import store from './store'

import './index.scss'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>{renderRoutes(routes)}</HashRouter>
    </Provider>
  )
}

export default App
