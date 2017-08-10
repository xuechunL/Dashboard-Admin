import { FETCH_PORTALS } from '../constants'

export function fetchPortals (portals) {
  const action = {
    type: FETCH_PORTALS,
    portals
  }
  console.log('fetch portals action', action)
  return action
}
