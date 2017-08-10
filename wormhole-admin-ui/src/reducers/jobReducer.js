import * as actions from '../constants'

const job = {
  name: '',
  type: 'mysql_sync',
  portals: [], // portal_id array
  stargates: [], // stargate_id array
  sources: [],
  target: {
    host: '',
    port: 0,
    username: '',
    password: ''
  },
  route_rule: [
    {
      schema_pattern: '',
      table_pattern: '',
      target_schema: '',
      target_table: ''
    }
  ],
  partition_nums: 32,
}

export default (state = job, action) => {
  switch (action.type) {
    case actions.ADD_JOB:
    case actions.UPDATE_JOB:
    {
      const { job } = action
      return job
    }
    default:
      return state
  }
}
