import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import $ from 'jquery'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardHeader } from 'material-ui/Card'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { Grid, Row, Col } from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import { muiTheme } from '../muiTheme'
import { addJob, updateJob } from '../actions/jobActions'
import { putData } from '../utils/httpUtils'
import { formatDate } from '../utils/date'
import Header from './Header'
import PortalCard from './PortalCard'
import SourceRoute from './SourceRoute'
import StargateCard from './StargateCard'
import TextFieldGroup from './TextFieldGroup'

import '../containers/view.css'
import './JobConfig.css'

const amountScrolled = 200
$(window).scroll(function () {
  if ($(window).scrollTop() > amountScrolled) {
    $('.back-to-top').addClass('show')
  } else {
    $('.back-to-top').removeClass('show')
  }
})

function scrollTop () {
  $('html, body').animate({
    scrollTop: 0
  }, 800)
  return false
}

const propTypes = {
  job: PropTypes.object,
  addJob: PropTypes.func,
  updateJob: PropTypes.func,
}

class JobConfig extends Component {
  constructor (props) {
    super(props)
    this.state = {
      partition_nums: 32,
      openSnackbar: false,
      openDialog: false,
      tipMsg: 'Create Successfully',
    }

    this.saveJob = this.saveJob.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleChangePartitionNums = this.handleChangePartitionNums.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  handleRequestClose () {
    this.setState({
      openSnackbar: false,
    })
  }

  handleChangePartitionNums (event, index, value) {
    console.log('partition num', value)
    const { job } = this.props
    // let job = this.props.job
    job.partition_nums = +value
    console.log('job', job)

    this.props.updateJob(job)

    return this.setState({
      partition_nums: value,
    })
  }

  handleOpenDialog () {
    this.setState({
      openDialog: true,
    })
  }

  handleCloseDialog () {
    this.setState({
      openDialog: false,
    })
  }
  // TODO: save (add Job)
  saveJob () {
    console.log('save job props', this.props.job)
    const { job } = this.props
    job.create_time = formatDate(new Date())
    this.props.addJob(job)
    putData(`/createJob`, job).then(function () {
      this.setState({
        openSnackbar: true,
        openDialog: false,
      })
    }.bind(this), function (error) {
      console.error('error', error)
      this.setState({
        openSnackbar: true,
        openDialog: false,
        tipMsg: 'Create Failed',
      })
    }.bind(this))
  }

  back () {
    window.history.back()
  }

  renderInputField () {
    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
      btn: {
        margin: '12px 12px 0 0',
      },
      customWidth: {
        width: 150,
      }
    }
    return (
      <div>
        <h3> Target </h3>
        <Card className="card card-input">
          <CardHeader
            title="Load"
            actAsExpander={false}
            showExpandableButton={false}
          />
          <SelectField
            className="select"
            style={styles.customWidth}
            multiple={false}
            hintText="Select a number"
            value={this.state.partition_nums}
            onChange={this.handleChangePartitionNums}
          >
            <MenuItem
              key={1}
              insetChildren={true}
              value={32}
              primaryText="Medium"
            />
            <MenuItem
              key={2}
              insetChildren={true}
              value={128}
              primaryText="Strong"
            />
            <MenuItem
              key={256}
              insetChildren={true}
              value={256}
              primaryText="Super"
            />
          </SelectField>
        </Card>
        <TextFieldGroup job={this.props.job} type="job" edit={true} />
        <PortalCard job={this.props.job} type="job" edit={true} />
        <StargateCard job={this.props.job} />
      </div>
    )
  }

  renderSourceTree () {
    return (
      <div>
        <h3>Source Tree</h3>
        <SourceRoute />
      </div>
    )
  }

  render () {
    const styles = {
      btn: {
        fontSize: 18,
        margin: '12px 12px 0 0',
      },
      floatRight: {
        float: 'right',
      }
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveJob}
      />,
    ]

    return (
      <div className="view job-view">
        <Header selectedKey={2} />
        <div className="container">
          <h1 className="title">Create a new Job</h1>
          <div className="row-actions">
            <RaisedButton
              label="Save"
              labelPosition="before"
              labelColor="#fff"
              primary={true}
              style={styles.btn}
              onClick={this.handleOpenDialog}
              icon={<i className="fa fa-save"></i>}
            />
            <RaisedButton
              label="Back"
              labelPosition="before"
              labelColor="#fff"
              primary={true}
              style={styles.btn}
              onClick={this.back}
              icon={<i className="fa fa-arrow-left"></i>}
            />
          </div>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} sm={6} md={4}>
                {this.renderInputField()}
              </Col>
              <Col xs={12} sm={6} md={8}>
                {this.renderSourceTree()}
              </Col>
            </Row>
          </Grid>
          <button className="back-to-top" style={styles.floatRight} onClick={scrollTop}></button>
        </div>
        <Dialog
          title="Save Comfirmation"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
           Please check your input.
        </Dialog>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.tipMsg}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

JobConfig.propTypes = propTypes
JobConfig.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { job } = state
  return {
    job,
  }
}

export default connect(mapStateToProps, { addJob, updateJob })(JobConfig)
