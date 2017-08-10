import * as actions from '../constants'

/* job action creators */

export function addJob (job) {
  const action = {
    type: actions.ADD_JOB,
    job
  }
  console.log('add job action', action)
  return action
}

export function updateJob (job) {
  const action = {
    type: actions.UPDATE_JOB,
    job
  }
  console.log('add job action', action)
  return action
}

export function deleteJob (jobs) {
  const action = {
    type: actions.DELETE_JOB,
    jobs
  }
  console.log('delete job action', action)
  return action
}

export function fetchJobs (jobs) {
  const action = {
    type: actions.FETCH_JOBS,
    jobs
  }
  console.log('fetch jobs', action)
  return action
}

export function fetchJobStatus (status) {
  const action = {
    type: actions.FETCH_JOBS_STATUS,
    status
  }
  console.log('fetch jobs status action', action)
  return action
}

export function fetchStargates (stargates) {
  const action = {
    type: actions.FETCH_STARGATES,
    stargates
  }
  console.log('fectn job stargates action', action)
  return action
}

export function fetchSchemas (schemas) {
  const action = {
    type: actions.FETCH_SCHEMAS,
    schemas
  }

  console.log('fetch schemas action', action)
}

export function fetchTables (tables) {
  const action = {
    type: actions.FETCH_TABLES,
    tables
  }

  console.log('fetch tables action', action)
}
