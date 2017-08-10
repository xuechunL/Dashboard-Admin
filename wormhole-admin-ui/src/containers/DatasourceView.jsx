import React, { Component } from 'react'

import Header from '../components/Header'
import SourceList from '../components/SourceList'

import './view.css'

class DatasourceView extends Component {
  render () {
    return (
      <div className="view datasource-view">
        <Header selectedKey={1} />
        <div className="container">
          <SourceList />
        </div>
      </div>
    )
  }
}

export default DatasourceView
