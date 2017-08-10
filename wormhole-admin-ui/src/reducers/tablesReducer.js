import * as actions from '../constants'

export default (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_SCHEMAS: {
      const { schemas } = action
      return schemas
    }
    case actions.FETCH_TABLES: {
      const { tables } = action
      return tables
    }
    default:
      return state
  }
}
