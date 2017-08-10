import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'
import { muiTheme } from '../muiTheme'
import { fetchJobs, deleteJob } from '../actions/jobActions'
import { isEmpty } from '../validators'
import { fetchData } from '../utils/httpUtils'
import JobCard from './JobCard'

const propTypes = {
  jobs: PropTypes.array,
  fetchJobs: PropTypes.func,
  deleteJob: PropTypes.func,
}

class JobList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
    }

    this.deleteSuccessfully = this.deleteSuccessfully.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentDidMount () {
    fetchData('/jobs').then(function (json) {
      console.log(json)
      this.props.fetchJobs(json || [])
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  deleteSuccessfully (job) {
    const list = this.props.jobs.filter(x => x.id !== job.id)
    console.log('deleted job', job)
    this.props.deleteJob(list || [])
    console.log('props', this.props.jobs)
    this.setState({
      openSnackbar: true,
      tipMsg: 'Delete Successfully',
    })
  }

  render () {
    return (
      <div>
        <h1 className="title"> Job List </h1>
        <RaisedButton
          label="Create"
          primary={true}
          href="/job/add"
        />
        {
          isEmpty(this.props.jobs)
            ? <div className="no-available-data">No Available Job</div>
            : <div className="list">
              {
                this.props.jobs.map((job, index) => {
                  return (
                    <JobCard job={job} key={index} deleteSuccessfully={this.deleteSuccessfully} />
                  )
                })
              }
            </div>
        }
      </div>
    )
  }
}

JobList.propTypes = propTypes
JobList.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { jobs } = state
  return {
    jobs
  }
}

export default connect(mapStateToProps, { fetchJobs, deleteJob })(JobList)
