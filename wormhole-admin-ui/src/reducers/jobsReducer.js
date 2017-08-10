import * as actions from '../constants'

export default (state = [], action) => {
  switch (action.type) {
    case actions.DELETE_JOB:
    case actions.FETCH_JOBS: {
      const { jobs } = action
      return jobs
    }
    default:
      return state
  }
}
