import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List, ListItem } from 'material-ui/List'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import SelectField from 'material-ui/SelectField'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import MenuItem from 'material-ui/MenuItem'

import { fetchPortals } from '../actions/portalActions'
import { updateDatasource } from '../actions/datasourceActions'
import { updateJob } from '../actions/jobActions'
import { fetchData } from '../utils/httpUtils'

import { muiTheme } from '../muiTheme'

import './PortalCard.css'

const propTypes = {
  job: PropTypes.object,
  edit: PropTypes.bool,
  type: PropTypes.string.isRequired,
  portals: PropTypes.array,
  datasource: PropTypes.object,
  fetchPortals: PropTypes.func,
  updateJob: PropTypes.func,
  updateDatasource: PropTypes.func,
}

class PortalCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      portals: [],
      tipMsg: 'Add at least one Portal',
      openSnackbar: false,
      addedPortals: [],
      availablePortals: [],
      selectedPortal: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentWillMount () {
    fetchData(`/portals`).then(function (json) {
      console.log('inital props', this.props)
      this.setState({
        portals: json || [],
        availablePortals: json || [],
      })
      this.props.fetchPortals(json || [])
      // FIXME: why this.props.availablePortals == undefined???
      console.log('new props', this.props)
      console.log('new state', this.state)
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  // FIXME optimze method
  getAddedPortals () {
    let addedPortals = []

    if (this.props.type === 'datasource') {
      console.log('DATATSOURE PORTALS GROUP')
      const { datasource } = this.props
      console.log('datasource', datasource)
      console.log('portals', this.state.portals)

      datasource.portals.map((x) => {
        this.props.portals.map((p) => {
          if (p.id === x)
            addedPortals.push(p)
        })
      })
    } else {
      const job = this.props.job
      console.log('job', job)
      console.log('portals', this.state.portals)

      job.portals.map(x => {
        this.props.portals.map(p => {
          if (p.id === x)
            addedPortals.push(p)
        })
      })
    }

    return addedPortals
  }

  getAvailablePortals () {
    const portals = this.props.portals
    const addedPortals = this.getAddedPortals()

    console.log('addedPortals', addedPortals)

    const availablePortals = new Set([...portals].filter(x => !addedPortals.includes(x)))

    console.log('availablePortals', availablePortals)

    return Array.from(availablePortals)
  }

  handleRequestClose () {
    this.setState({
      openSnackbar: false,
    })
  }

  handleChange (event, index, value) {
    console.log('value', value)
    this.setState({
      selectedPortal: value,
    })
  }

  handleAdd () {
    const selectedPortal = this.state.selectedPortal
    if (selectedPortal === null) {
      this.setState({
        openSnackbar: true,
      })
      return
    }

    if (this.props.type === 'datasource') {
      console.log('DATATSOURE ADD PORTAL')
      const datasource = this.props.datasource
      datasource.portals.push(selectedPortal)
      this.props.updateDatasource(datasource)
    } else {
      console.log('JOB ADD PORTAL')
      const job = this.props.job
      job.portals.push(selectedPortal)
      this.props.updateJob(job)
    }

    const portals = this.state.portals
    console.log('portals', portals)

    const othersPortals = portals.filter((item) => {
      console.log('item', item.id)
      return item.id !== selectedPortal
    })
    console.log('othersPortals', othersPortals)

    this.setState({
      availablePortals: othersPortals,
      selectedPortal: null,
    })
  }

  renderAddedPortals (addedPortals) {
    return (
      <List className="list">
        {
          addedPortals.map((ap, index) => {
            return (
              <ListItem key={index}>
                Portal Name: # {ap.id}&nbsp;&nbsp;&nbsp;&nbsp;
                Host IP: {ap.host}
              </ListItem>
            )
          })
        }
        <Divider />
      </List>
    )
  }

  renderAvailablePortals (availablePortals) {
    const styles = {
      custom: {
        width: 160,
        marginRight: 25,
      }
    }
    return (
      <div className="add-portal">
        <SelectField
          className="select"
          style={styles.custom}
          multiple={false}
          hintText="Select a host"
          value={this.state.selectedPortal}
          onChange={this.handleChange}
          disabled={availablePortals.length === 0}
        >
          {
            availablePortals.map((ap, index) => {
              return (
                <MenuItem
                  key={index}
                  insetChildren={true}
                  value={ap.id}
                  primaryText={ap.host}
                />
              )
            })
          }
        </SelectField>
        <IconButton tooltip="Add Portal" onClick={this.handleAdd}>
          <ContentAdd className="icon-add" />
        </IconButton>
      </div>
    )
  }

  render () {
    const addedPortals = this.getAddedPortals()
    console.log('added portal', addedPortals)
    const availablePortals = this.getAvailablePortals()
    console.log('available portals', availablePortals)
    const { edit } = this.props
    return (
      <Card className="card card-portals">
        <CardHeader
          title="Portal Group"
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          {
            addedPortals.length > 0
              ? this.renderAddedPortals(addedPortals)
              : <span></span>
          }
          {
            edit ? this.renderAvailablePortals(availablePortals) : <span></span>
          }
        </CardText>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.tipMsg}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </Card>
    )
  }
}

PortalCard.propTypes = propTypes
PortalCard.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { datasource, portals, job } = state
  return {
    datasource,
    portals,
    job,
  }
}

export default connect(mapStateToProps, { fetchPortals, updateDatasource, updateJob })(PortalCard)
