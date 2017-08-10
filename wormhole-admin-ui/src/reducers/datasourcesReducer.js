import * as actions from '../constants'

export default (state = [], action) => {
  switch (action.type) {
    case actions.DELETE_DATASOURCE:
    case actions.FETCH_DATASOURCES: {
      const { datasources } = action
      return datasources
    }
    default:
      return state
  }
}
