import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import createHistory from 'history/createHashHistory'
import rootReducer from './modules'
import { createMiddleware } from 'redux-beacon';
import GoogleTagManager from '@redux-beacon/google-tag-manager';
import { getRegionFromFeature } from './modules/config'
import { getLang } from './modules/lang'

const eventsMap = {
  'SET_EXPLORER_METRIC': (action) => ({
    event: 'metricSelected',
    metricSelection: getLang('LABEL_' + action.metricId),
  }),
  'SET_EXPLORER_DEMOGRAPHIC': (action) => ({
    event: 'studentTypeSelected',
    studentTypeSelection: getLang('LABEL_' + action.demographicId)
  }),
  'SET_EXPLORER_REGION': (action) => ({
    event: 'geoTypeSelected',
    geoTypeSelection: action.regionId
  }),
  'SET_EXPLORER_STATE': (action) => ({
    event: 'geoSelected',
    geoSelection: action.stateId
  }),
  'SET_EXPLORER_VIEW': (action) => ({
    event: 'displayTypeSelected',
    displayTypeSelection: action.view
  }),
  'SEARCH_HIT_SELECTED': (action) => ({
    event: 'searchSelected',
    searchSelection: action.hit.name + ', ' + action.hit.state_name
  }),
  'MAP_LEGEND_ACTION': (action) => ({
    event: 'chartButtonSelected',
    chartButtonSelection: action.itemId
  }),
  'SHOW_HELP_TOPIC': (action) => {
    return {
      event: 'helpTopicExpanded',
      helpTopicExpansion: getLang(action.topicId)
    }
  },
  'SHOW_SINGLE_TOPIC': (action) => {
    return {
      event: 'helpTopicExpanded',
      helpTopicExpansion: getLang(action.topicId)
    }
  },
  'REPORT_DOWNLOAD_REQUEST': (action) => ({
    event: 'reportDownloaded',
    geoTypeSelected: getRegionFromFeature(action.feature),
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name
  }),
  'SOCIAL_SHARE': (action) => ({
    event: 'shareType',
    shareType: action.shareType,
    shareUrl: action.url
  }),
  'SET_ACTIVE_LOCATION': (action) => ({
    event: 'locationSelected',
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name,
    selectionSource: action.source
  }),
  'SHOW_SIMILAR': (action) => ({
    event: 'similarPlacesComparison',
    geoTypeSelected: getRegionFromFeature(action.feature),
    locationId: action.feature.properties.id,
    locationName: action.feature.properties.name
  }),
}

const gtm = GoogleTagManager();

const gtmMiddleware = createMiddleware(eventsMap, gtm);

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history), gtmMiddleware]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export default createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers
)
