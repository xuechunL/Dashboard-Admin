import React, { Component } from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// import { now } from '../utils/dates'
import { initEnhancer } from '../utils/reduxUtils'
// import AlertsWrapper from '../components/AlertsWrapper'
// import { getControlsState, getFormDataFromControls } from '../stores/store'
// import { initJQueryAjaxCSRF } from '../utils/utils'
// import ExploreViewContainer from '../components/ExploreViewContainer'
import { exploreReducer } from '../reducers/exploreReducer'
import './Admin.css'

// const exploreViewContainer = document.getElementById('root')
// const bootstrapData = JSON.parse(exploreViewContainer.getAttribute('data-bootstrap'))
// const controls = getControlsState(bootstrapData, bootstrapData.form_data)
// delete bootstrapData.form_data


// Initial state
const bootstrappedState = {}

const store = createStore(exploreReducer, bootstrappedState,
  compose(applyMiddleware(thunk), initEnhancer(false)),
)


class Admin extends Component {
  // constructor(props) {
  //   super(props)
  //   // this.state = bootstrappedState
  // }

  render(){
    return(
      <div className="admin">
        <Provider store={store}>
          <div>
          </div>
        </Provider>
      </div>
    )
  }
}

export default Admin
