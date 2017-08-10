import * as actions from '../constants'

/* datasource action creators */

export function addDatasource (datasource) {
  const action = {
    type: actions.ADD_DATASOURCE,
    datasource
  }
  console.log('add datasource action', action)
  return action
}

export function updateDatasource (datasource) {
  const action = {
    type: actions.UPDATE_DATASOURCE,
    datasource
  }
  console.log('update datasource action', action)
  return action
}

export function deleteDatasource (datasources) {
  const action = {
    type: actions.DELETE_DATASOURCE,
    datasources
  }
  console.log('delete datasource action', action)
  return action
}

export function fetchDatasource (datasource) {
  const action = {
    type: actions.FETCH_DATASOURCE,
    datasource
  }
  console.log('fetch datasource action', action)
  return action
}

export function fetchDatasources (datasources) {
  const action = {
    type: actions.FETCH_DATASOURCES,
    datasources
  }
  console.log('fetch datasources action', action)
  return action
}
