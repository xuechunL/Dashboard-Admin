import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import reducer from './reducers'
import DatasourceView from './containers/DatasourceView'
import DatasourceConfig from './components/DatasourceConfig'
import JobView from './containers/JobView'
import JobConfig from './components/JobConfig'

/* loading */
(function () {
  const bodyElement = document.querySelector('body')
  bodyElement.classList.add('loading')

  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') {
      const loaderElement = document.querySelector('#initial-loader')

      bodyElement.classList.add('loaded')
      setTimeout(function () {
        bodyElement.removeChild(loaderElement)
        bodyElement.classList.remove('loading', 'loaded')
      }, 100)
    }
  })
})()

/* initial global store */
const store = createStore(reducer)

injectTapEventPlugin()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={DatasourceView} />
        <Route exact path="/datasource/list" component={DatasourceView} />
        <Route exact path="/datasource/add" component={DatasourceConfig} />
        <Route exact path="/datasource/edit/:id" component={DatasourceConfig} />
        <Route exact path="/datasource/view/:id" component={DatasourceConfig} />
        <Route exact path="/job/list" component={JobView} />
        <Route exact path="/job/add" component={JobConfig} />
      </Switch>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
)
