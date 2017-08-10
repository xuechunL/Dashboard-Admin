import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { List, ListItem } from 'material-ui/List'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import { muiTheme } from '../muiTheme'
import { updateJob, fetchSchemas } from '../actions/jobActions'
import { isEmpty } from '../validators'
import { fetchData } from '../utils/httpUtils'
import { fetchDatasources } from '../actions/datasourceActions'

const propTypes = {
  job: PropTypes.object,
  datasources: PropTypes.array,
  updateJob: PropTypes.func,
  fetchDatasources: PropTypes.func,
}

class SourceRoute extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newSources: [],
      sources: [],
      schemas: [],
      tables: [],
    }

    this.handleSelectSource = this.handleSelectSource.bind(this)
    this.handleSoureRouteChange = this.handleSoureRouteChange.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentWillMount () {
    fetchData(`/datasources`).then(function (json) {
      console.log(json)
      this.props.fetchDatasources(json || [])
      console.log('props', this.props)
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  getSchemas (datasource) {
    const host = datasource.db.host
    const port = datasource.db.port
    const { job } = this.props
    let source = datasource

    fetchData(`/schemainfo/${host}/${port}`).then(function (json) {
      console.log(json)
      const { schemas } = this.state
      console.log('added schemas', [...schemas, ...json])
      this.setState({
        schemas: [...schemas, ...json]
      })

      source.sync_schema = json
      // TODO: generate sources

      //FIXME: default all schemas selected ??
      job.sources.push(source)
      console.log('update job', job)
      this.props.updateJob(job)
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  handleSelectSource (event, index, values) {
    console.log(values)
    this.setState({
      sources: values
    })

    values.map(s => this.getSchemas(s))
  }

  mapToSource (value) {
    const { job } = this.props
    const { sources } = this.state
    const { newSources } = this.state
    let source = {
      db: null,
      sync_schema: []
    }

    // FIXME: 如何构造对应的 sources
    console.log(sources)
    sources.map(item => {
      item.sync_schema.map(sc => {
        if (sc.schema === value.schema) {
          console.log('sc', sc)
          console.log('source', item)
          source.db = item.db
          source.sync_schema.push(sc)
          newSources.push(source)
        }
      })
    })
    console.log('test schema in source', newSources)
  }

  //FIXME:
  selectAllTablesInSchema (value, event) {
    console.log(value)
    const target = event.target

    if (target.value) {
      console.log('select all tables in schema')
      // FIXME: selected add tables Checkbox
      this.mapToSource(value)
    }
  }
  //FIXME:
  selectTable (value, event) {
    console.log(value)

  }

  handleSoureRouteChange (event) {
    const target = event.target
    const { job } = this.props
    switch (target.name) {
      case 'schema':
        job.route[0].schema_pattern = target.value
        break
      case 'table':
        job.route[0].table_pattern = target.value
        break
      default:
        break
    }

    this.props.updateJob(job)
  }

  render () {
    const { datasources } = this.props
    const { sources } = this.state
    return (
      <div>
        {
          isEmpty(datasources)
            ? <div className="no-available-data">No Available Datasource</div>
            : <List className="list">
              <Subheader>Source</Subheader>
              <SelectField
                multiple={true}
                hintText="Select Sources"
                value={sources}
                onChange={this.handleSelectSource}
              >
                {
                  datasources.map((d) => {
                    const name = `#${d.id}: ${d.db.host}`
                    return (
                      <MenuItem
                        key={d.id}
                        insetChildren={true}
                        checked={sources && sources.indexOf(d) > -1}
                        value={d}
                        primaryText={name}
                      />
                    )
                  })
                }
              </SelectField><br />
              <List>
                {
                  this.state.schemas.map((sc, index) => {
                    return (
                      <ListItem
                        key={index}
                        primaryText={`Schema: ${sc.schema}`}
                        leftCheckbox={
                          <Checkbox onCheck={event => this.selectAllTablesInSchema(sc, event)} />
                        }
                        initiallyOpen={true}
                        primaryTogglesNestedList={true}
                        nestedItems={
                          sc.table.map((t, index) => {
                            return (
                              <ListItem
                                key={index}
                                primaryText={`Table: ${t}`}
                                leftCheckbox={
                                  <Checkbox onCheck={event => this.selectTable(t, event)} />
                                }
                              />
                            )
                          })
                        }
                      />
                    )
                  })
                }
              </List>
              <Divider />
              <TextField
                name="schema"
                hintText="Input Schema Pattern"
                floatingLabelText="Input Schema Pattern"
                floatingLabelFixed={true}
                onChange={this.handleSoureRouteChange}
              /><br />
              <TextField
                name="table"
                hintText="Input Table Pattern"
                floatingLabelText="Input Table Pattern"
                floatingLabelFixed={true}
                onChange={this.handleSoureRouteChange}
              /><br />
            </List>
        }
      </div>
    )
  }
}

SourceRoute.propTypes = propTypes
SourceRoute.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { datasources, job } = state
  return {
    datasources,
    job,
  }
}

export default connect(mapStateToProps, { fetchDatasources, updateJob })(SourceRoute)
