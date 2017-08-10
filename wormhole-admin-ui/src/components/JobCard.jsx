import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import { Grid, Row, Col } from 'react-bootstrap'
import { fetchPortals } from '../actions/portalActions'
import { fetchStargates } from '../actions/jobActions'
import { fetchData, postData } from '../utils/httpUtils'
import { muiTheme } from '../muiTheme'
import { isEmpty } from '../validators'

import './JobCard.css'

const propTypes = {
  job: PropTypes.object,
  portals: PropTypes.array,
  stargates: PropTypes.array,
  deleteSuccessfully: PropTypes.func,
  fetchPortals: PropTypes.func,
  fetchStargates: PropTypes.func
}

class JobCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      status: [],
      pause: false,
      tipMsg: '',
      openDialog: false,
      openSnackbar: false,
      openSourcesPopover: false,
      openStatusPopover: false,
      openSchemasPopover: false,
      openTablesPopover: false,
      openPortalsPopover: false,
      openStargatesPopover: false,
    }

    // TODO: merge to 1 handleTouchTap use name
    // TODO: merge to 1 handleRequestClose use name
    this.handleTouchTapSources = this.handleTouchTapSources.bind(this)
    this.handleRequestCloseSources = this.handleRequestCloseSources.bind(this)
    this.handleTouchTapSchemas = this.handleTouchTapSchemas.bind(this)
    this.handleRequestCloseSchemas = this.handleRequestCloseSchemas.bind(this)
    this.handleTouchTapTables = this.handleTouchTapTables.bind(this)
    this.handleRequestCloseTables = this.handleRequestCloseTables.bind(this)
    this.handleTouchTapPortals = this.handleTouchTapPortals.bind(this)
    this.handleRequestClosePortals = this.handleRequestClosePortals.bind(this)
    this.handleTouchTapStargates = this.handleTouchTapStargates.bind(this)
    this.handleRequestCloseStargates = this.handleRequestCloseStargates.bind(this)
    this.handleTouchTapSnackBar = this.handleTouchTapSnackBar.bind(this)
    this.handleTouchTapStatus = this.handleTouchTapStatus.bind(this)
    this.handleRequestCloseStatus = this.handleRequestCloseStatus.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleDeleteJob = this.handleDeleteJob.bind(this)
    this.toggleStatus = this.toggleStatus.bind(this)
    this.restartJob = this.restartJob.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }
  getChildContext () {
    return { muiTheme }
  }
  componentWillMount () {
    fetchData(`/portals`).then(function (json) {
      this.setState({
        portals: json || [],
      })
      this.props.fetchPortals(json || [])
      // FIXME: why this.props.availablePortals == undefined???
      console.log('new props', this.props)
      console.log('new state', this.state)
    }.bind(this), function (error) {
      console.error('error', error)
    })

    fetchData(`/stargates`).then(function (json) {
      this.setState({
        stargates: json || [],
      })
      this.props.fetchStargates(json || [])
      // FIXME: why this.props.availablePortals == undefined???
      console.log('new props', this.props)
      console.log('new state', this.state)
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  onDelete () {
    this.setState({
      openDialog: true,
    })
  }

  deleteFailed (error) {
    this.setState({
      openSnackbar: true,
      tipMsg: error || 'Delete Failed',
    })
  }

  handleDeleteJob () {
    const { job } = this.props
    postData(`/jobs/delete/${job.id}`).then(function () {
      this.setState({
        openSnackbar: true,
        tipMsg: 'Delete Successfully',
      })
      this.props.deleteSuccessfully(job)
    }.bind(this), function (error) {
      console.error('error', error)
      this.deleteFailed(error)
    }.bind(this))
  }

  handleTouchTapSources (event) {
    event.preventDefault()

    this.setState({
      openSourcesPopover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestCloseSources () {
    this.setState({
      openSourcesPopover: false,
    })
  }

  handleTouchTapSchemas (event) {
    event.preventDefault()

    this.setState({
      openSchemasPopover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestCloseSchemas () {
    this.setState({
      openSchemasPopover: false,
    })
  }

  handleTouchTapTables (event) {
    event.preventDefault()

    this.setState({
      openTablesPopover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestCloseTables () {
    this.setState({
      openTablesPopover: false,
    })
  }

  // TODO: portals ip
  handleTouchTapPortals (event) {
    event.preventDefault()

    this.setState({
      openPortalsPopover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClosePortals () {
    this.setState({
      openPortalsPopover: false,
    })
  }

  // TODO: stargates ip
  handleTouchTapStargates (event) {
    event.preventDefault()

    this.setState({
      openStargatesPopover: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestCloseStargates () {
    this.setState({
      openStargatesPopover: false,
    })
  }

  toggleStatus () {
    const { job } = this.props
    if (this.state.pause) {
      // will resume
      this.setState({
        pause: false,
      })
      postData(`/jobs/start/${job.id}`).then(function () {
        this.setState({
          oenSnackbar: true,
          tipMsg: 'Job Resumed'
        })
      }.bind(this), function (error) {
        console.error('error', error)
        this.setState({
          openSnackbar: true,
          tipMsg: 'Resume Failed'
        })
      })
    } else {
      this.setState({
        pause: true,
      })

      postData(`/jobs/pause/${job.id}`).then(function () {
        this.setState({
          openSnackbar: true,
          tipMsg: 'Job Paused'
        })
      }.bind(this), function (error) {
        console.error('error', error)
        this.setState({
          openSnackbar: true,
          tipMsg: 'Pause Failed'
        })
      }.bind(this))
    }
  }

  restartJob () {
    const { job } = this.props
    postData(`/jobs/restart/${job.id}`).then(function () {
      this.setState({
        openSnackbar: true,
        tipMsg: 'Job Restarted'
      })
    }.bind(this), function (error) {
      console.error('error', error)
      this.setState({
        openSnackbar: true,
        tipMsg: 'Restart Failed'
      })
    }.bind(this))
  }

  handleTouchTapSnackBar () {
    this.setState({
      openSnackbar: false,
    })
  }

  handleCloseDialog () {
    this.setState({
      openDialog: false,
    })
  }

  // TODO: link to All jobs 根据 Jobs 字段的 id 使用接口获取状态列表 参数是 jobs.join(',')
  handleTouchTapStatus (event) {
    event.preventDefault()
    const { job } = this.props
    const ids = job.jobs.join(',')
    this.setState({
      anchorEl: event.currentTarget,
    })

    fetchData(`/jobs/status/${ids}/${job.type}`).then(function (json) {
      this.setState({
        status: json,
        openStatusPopover: true,
      })
    }.bind(this), function (error) {
      console.log(error)
    })
  }

  handleRequestCloseStatus () {
    this.setState({
      openStatusPopover: false,
    })
  }

  render () {
    const { job } = this.props
    const title = `Job#${job.id}`
    const sources = job.sources
    const schemas = Array.from(sources, j => j.sync_schema).reduce((x, y) => x.concat(y))
    console.log('all schemas', schemas)
    const tables = Array.from(schemas, s => s.table).reduce((x, y) => x.concat(y))
    console.log('all tables', tables)

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleDeleteJob}
      />,
    ]

    return (
      <Card initiallyExpanded={true} className="card card-job">
        <CardHeader
          title={title}
          subtitle={job.name || ''}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} sm={6} md={4}>Source:&nbsp;&nbsp;
                <FlatButton
                  label={sources.length}
                  primary={true}
                  onTouchTap={this.handleTouchTapSources}
                />
              </Col>
              <Col xs={12} sm={6} md={2}>Schemas:&nbsp;&nbsp;
                <FlatButton
                  label={schemas.length}
                  primary={true}
                  onTouchTap={this.handleTouchTapSchemas}
                />
              </Col>
              <Col xs={12} sm={6} md={2}>Table:&nbsp;&nbsp;
                <FlatButton
                  label={tables.length}
                  primary={true}
                  onTouchTap={this.handleTouchTapTables}
                />
              </Col>
              <Col xs={12} sm={6} md={2}>portals:&nbsp;&nbsp;
                <FlatButton
                  label={job.portals.length}
                  primary={true}
                  onTouchTap={this.handleTouchTapPortals}
                />
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={12} sm={6} md={6}>Target:&nbsp;&nbsp;
                TIDB（ host: {job.target.host} port: {job.target.port} ）
              </Col>
              <Col xs={12} sm={6} md={6}>stargates:
                <FlatButton
                  label={job.stargates.length}
                  primary={true}
                  onTouchTap={this.handleTouchTapStargates}
                />
              </Col>
            </Row>
            <Row className="show-grid">
              <Col sm={12} md={12}>Status:&nbsp;&nbsp;
                <FlatButton
                  label="detail"
                  primary={true}
                  onTouchTap={this.handleTouchTapStatus}
                />
              </Col>
            </Row>
            <Popover
              open={this.state.openSourcesPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestCloseSources}
            >
              <Menu>
                {
                  sources.map((s, index) => {
                    const infos = `type:${s.type || 'mysql_binlog'} host:${s.db.host} port:${s.db.port}`
                    return (
                      <MenuItem key={index} primaryText={infos} />
                    )
                  })
                }
              </Menu>
            </Popover>
            <Popover
              open={this.state.openSchemasPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestCloseSchemas}
            >
              <Menu>
                {
                  schemas.map((t, index) => {
                    return (
                      <MenuItem key={index} primaryText={t.schema} />
                    )
                  })
                }
              </Menu>
            </Popover>
            <Popover
              open={this.state.openTablesPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestCloseTables}
            >
              <Menu>
                {
                  tables.map((t, index) => {
                    return (
                      <MenuItem key={index} primaryText={t} />
                    )
                  })
                }
              </Menu>
            </Popover>
            <Popover
              open={this.state.openPortalsPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestClosePortals}
            >
              <Menu>
                {
                  job.portals.map((p, index) => {
                    return (
                      <MenuItem key={index} primaryText={p} />
                    )
                  })
                }
              </Menu>
            </Popover>
            <Popover
              open={this.state.openStargatesPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestCloseStargates}
            >
              <Menu>
                {
                  job.stargates.map((s, index) => {
                    return (
                      <MenuItem key={index} primaryText={s} />
                    )
                  })
                }
              </Menu>
            </Popover>
            <Popover
              open={this.state.openStatusPopover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestCloseStatus}
            >
              <Menu>
                {
                  this.state.status.map((s, index) => {
                    const stateMap = {
                      0: 'Running',
                      1: 'Pausing',
                      2: 'Resolved',
                      3: 'Abnormal',
                      4: 'Deleted',
                    }

                    const isInitialized = s.status.isInitialized ? 'isInitialized' : 'notInitialized'

                    const infos =
                      `job#${s.id}: ${isInitialized} \
                      ${stateMap[s.status.state]}\n replicate:${s.status.replicate} \
                      Qps: ${s.status.qps} \
                      Delay Message Count: ${s.status.delay_message_count} \
                      message: ${s.status.message} \
                      Pos:`
                    return (
                      <MenuItem key={index} primaryText={infos} />
                    )
                  })
                }
              </Menu>
            </Popover>
          </Grid>
        </CardText>
        <CardActions>
          <FlatButton secondary={true} label={this.state.pause ? 'Resume' : 'Pause'} onClick={this.toggleStatus} />
        </CardActions>
        <Dialog
          title="Delete Comfirmation"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
           You sure you want to delete this Job?
        </Dialog>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.tipMsg}
          autoHideDuration={2000}
          onRequestClose={this.handleTouchTapSnackBar}
        />
      </Card>
    )
  }
}

JobCard.propTypes = propTypes
JobCard.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { portals, stargates } = state
  return {
    portals,
    stargates,
  }
}

export default connect(mapStateToProps, { fetchPortals, fetchStargates })(JobCard)
