import { FETCH_PORTALS } from '../constants'

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_PORTALS: {
      const { portals } = action
      return portals
    }
    default:
      return state
  }
}
