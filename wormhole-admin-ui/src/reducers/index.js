import { combineReducers } from 'redux'
import datasource from './datasourceReducer'
import datasources from './datasourcesReducer'
import portals from './portalsReducer'
import stargates from './stargatesReducer'
import job from './jobReducer'
import jobs from './jobsReducer'
import tables from './tablesReducer'

export default combineReducers({
  job,
  jobs,
  tables,
  portals,
  stargates,
  datasource,
  datasources,
})
