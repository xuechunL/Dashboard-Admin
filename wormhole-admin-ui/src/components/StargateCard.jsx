import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import SelectField from 'material-ui/SelectField'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import MenuItem from 'material-ui/MenuItem'

import { fetchStargates, updateJob } from '../actions/jobActions'
import { fetchData } from '../utils/httpUtils'

import { muiTheme } from '../muiTheme'

const propTypes = {
  job: PropTypes.object,
  updateJob: PropTypes.func,
  stargates: PropTypes.array,
  fetchStargates: PropTypes.func,
}

class StargateCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tipMsg: 'Add at least one Stargate',
      openSnackbar: false,
      addedStargates: [],
      availableStargates: [],
      selectedStargate: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentWillMount () {
    fetchData(`/stargates`).then(function (json) {
      this.setState({
        stargates: json || [],
        availableStargates: json || [],
      })
      this.props.fetchStargates(json || [])
      // FIXME: why this.props.availableStargates == undefined???
      console.log('new props', this.props)
      console.log('new state', this.state)
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  // FIXME optimze method
  getAddedStargates () {
    const job = this.props.job
    const stargates = this.props.stargates
    console.log('job stargates', job.stargates)
    console.log('props stargates', stargates)

    let addedStargates = []
    job.stargates.map((x) => {
      stargates.map((p) => {
        if (p.id === x)
          addedStargates.push(p)
      })
    })

    return addedStargates
  }

  getAvailableStargates () {
    const stargates = this.props.stargates
    console.log('stargates', stargates)
    const addedStargates = this.getAddedStargates()
    console.log('addedStargates', addedStargates)

    const availableStargates = new Set([...stargates].filter(x => !addedStargates.includes(x)))

    console.log('availableStargates', availableStargates)

    return Array.from(availableStargates)
  }

  handleRequestClose () {
    this.setState({
      openSnackbar: false,
    })
  }

  handleChange (event, index, value) {
    console.log('value', value)
    this.setState({
      selectedStargate: value,
    })
    // FIXME: state.selectedStargate ??
    console.log('selected stargate ids', this.state.selectedStargate)
  }

  // FIXME: add stargate
  handleAdd () {
    const job = this.props.job
    const selectedStargate = this.state.selectedStargate
    console.log('selectedStargate', selectedStargate)
    if (selectedStargate === null) {
      this.setState({
        openSnackbar: true,
      })
      return
    }

    job.stargates.push(selectedStargate)

    const stargates = this.props.stargates
    console.log('stargates', stargates)

    const othersStargates = stargates.filter((item) => {
      console.log('item', item.id)
      return item.id !== selectedStargate
    })
    console.log('othersStargates', othersStargates)

    // FIXME: selectedStargate ??
    this.setState({
      availableStargates: othersStargates,
      selectedStargate: null,
    })

    this.props.updateJob(job)
    console.log('new job stargates', this.props.job)
  }

  renderAddedPortals (addedStargates) {
    return (
      <List className="list">
        {
          addedStargates.map((ap, index) => {
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

  render () {
    const styles = {
      custom: {
        width: 160,
        marginRight: 25,
      }
    }

    const addedStargates = this.getAddedStargates()
    console.log('added stargates', addedStargates)
    const availableStargates = this.getAvailableStargates()
    console.log('available stargates', availableStargates)
    return (
      <Card className="card card-stargates">
        <CardHeader
          title="Stargate Group"
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          {
            addedStargates.length > 0
              ? this.renderAddedPortals(addedStargates) : <span>{''}</span>
          }
          <div className="add-portal">
            <SelectField
              className="select"
              style={styles.custom}
              multiple={false}
              hintText="Select a host"
              value={this.state.selectedStargate}
              onChange={this.handleChange}
              disabled={availableStargates.length === 0}
            >
              {
                availableStargates.map((ap, index) => {
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
            <IconButton tooltip="Add Stargate" onClick={this.handleAdd}>
              <ContentAdd className="icon-add" />
            </IconButton>
          </div>
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

StargateCard.propTypes = propTypes
StargateCard.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { job, stargates } = state
  return {
    job,
    stargates,
  }
}

export default connect(mapStateToProps, { fetchStargates, updateJob })(StargateCard)
