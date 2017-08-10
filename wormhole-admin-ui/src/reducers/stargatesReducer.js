import { FETCH_STARGATES } from '../constants'

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_STARGATES: {
      const { stargates } = action
      return stargates
    }
    default:
      return state
  }
}
