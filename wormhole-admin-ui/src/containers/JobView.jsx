import React, { Component } from 'react'
import Header from '../components/Header'
import JobList from '../components/JobList'

import './view.css'

class JobView extends Component {
  render () {
    return (
      <div className="view datasource-view">
        <Header selectedKey={2} />
        <div className="container">
          <JobList />
        </div>
      </div>
    )
  }
}

export default JobView
