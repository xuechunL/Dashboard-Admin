import * as actions from '../constants'

const old = {
  portals: [], // portal_id list
  type: 'mysql_binlog',
  db: {
    host: '',
    port: 0,
    username: 'root',
    password: '',
  },
  partition_nums: 32
}

export default (state = old, action) => {
  switch (action.type) {
    case actions.ADD_DATASOURCE:
    case actions.UPDATE_DATASOURCE:
    case actions.FETCH_DATASOURCE:
    {
      const { datasource } = action
      return datasource
    }
    default:
      return state
  }
}
