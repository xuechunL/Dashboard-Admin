import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import { GridList } from 'material-ui/GridList'
import { Card, CardHeader } from 'material-ui/Card'
import { updateDatasource, fetchDatasource } from '../actions/datasourceActions'
import { updateJob } from '../actions/jobActions'
import { fetchData } from '../utils/httpUtils'

import { muiTheme } from '../muiTheme'

const propTypes = {
  job: PropTypes.object,
  edit: PropTypes.bool,
  type: PropTypes.string.isRequired,
  sourceID: PropTypes.number,
  datasource: PropTypes.object,
  fetchDatasource: PropTypes.func,
  updateDatasource: PropTypes.func,
}

class TextFieldGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      host: '',
      port: 0,
      username: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentWillMount () {
    if (this.props.type === 'datasource' && this.props.sourceID !== 0) {
      fetchData(`/datasources/${this.props.sourceID}`).then(function (json) {
        console.log(json)
        const { db } = json
        this.setState({
          host: db.host || '',
          port: db.port || 0,
          username: db.username || '',
          password: db.password || '',
        })
        this.props.fetchDatasource(json || {})
        console.log('datasource view props', this.props)
      }.bind(this), function (error) {
        console.error('error', error)
      })
    } else {
      const { target } = this.props.job
      console.log('JOB TEXTFIELD', target)
      this.setState(target)
    }
  }

  handleChange (event) {
    const target = event.target
    const { datasource } = this.props
    const { job } = this.props

    switch (target.name) {
      case 'host': {
        this.setState({
          host: target.value
        })
        if (this.props.type === 'datasource')
          datasource.db.host = target.value
        else
          job.target.host = target.value
        break
      }
      case 'port': {
        this.setState({
          port: target.value
        })
        if (this.props.type === 'datasource')
          datasource.db.port = +target.value
        else
          job.target.port = +target.value
        break
      }
      case 'username': {
        this.setState({
          username: target.value
        })
        if (this.props.type === 'datasource')
          datasource.db.username = target.value
        else
          job.target.username = target.value
        break
      }
      case 'password': {
        this.setState({
          password: target.value
        })
        if (this.props.type === 'datasource')
          datasource.db.password = target.value
        else
          job.target.password = target.value
        break
      }
      default:
        break
    }
    this.props.updateDatasource(datasource)

    console.log('new props', this.props)
  }

  render () {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        overflowY: 'auto',
      },
      maxWidth: {
        width: 120,
      }
    }

    return (
      <Card className="card card-input" style={styles.root}>
        <CardHeader
          title="Source Info"
          actAsExpander={false}
          showExpandableButton={false}
        />
        <GridList
          cols={2}
          cellHeight={50}
          padding={1}
          style={styles.gridList}
        >
          <TextField
            floatingLabelText="Host IP"
            hintText="Host IP"
            value={this.state.host}
            name="host"
            style={styles.maxWidth}
            onChange={this.handleChange}
            disabled={!this.props.edit}
          /><TextField
            floatingLabelText="Port"
            hintText="Port"
            name="port"
            style={styles.maxWidth}
            value={this.state.port}
            disabled={!this.props.edit}
            onChange={this.handleChange}
          /><br />
          <br />
          <TextField
            floatingLabelText="Username"
            hintText="Username"
            name="username"
            style={styles.maxWidth}
            value={this.state.username}
            disabled={!this.props.edit}
            onChange={this.handleChange}
          /><TextField
            hintText="Password"
            floatingLabelText="Password"
            name="password"
            style={styles.maxWidth}
            value={this.state.password}
            disabled={!this.props.edit}
            onChange={this.handleChange}
            type="password"
          /><br />
          <br />
        </GridList>
      </Card>
    )
  }
}

TextFieldGroup.propTypes = propTypes
TextFieldGroup.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { job, datasource } = state
  return {
    job,
    datasource,
  }
}

export default connect(mapStateToProps, { updateDatasource, fetchDatasource, updateJob })(TextFieldGroup)
