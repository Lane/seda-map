import { combineReducers } from "redux";


const getPropsFromFeatures = (props, features) =>
  props.reduce(
    (acc, curr) => ({ 
      ...acc, [curr]: features.reduce((obj, f) => {
        if (f.properties[curr] && f.properties[curr] !== -9999) {
          obj[f.properties.id] = f.properties[curr]
        }
        return obj
      }, {})
    }), {}
  )

// Reducers

const data = (state = {}, action) => {
  switch(action.type) {
    case 'FETCH_VAR_SUCCESS':
      return {
        ...state,
        [action.region]: {
          ...state[action.region],
          ...action.data
        }
      }
    case 'LOAD_RENDERED_FEATURES':
      return {
        ...state,
        'schools': getPropsFromFeatures(
          ['name', 'all_avg', 'frl_pct'], action.features
        )
      }
    default:
      return state;
  }
}

const errorMessage = (state = null, action) => {
  switch(action.type) {
    case 'FETCH_VAR_REQUEST':
    case 'FETCH_VAR_SUCCESS':
      return null
    case 'FETCH_VAR_ERROR':
      return action.errorMessage
    default:
      return state;
  }
}

const scatterplot = combineReducers({
  data,
  errorMessage
})

export default scatterplot;

// Helper Functions

export const getRegionData = ({ data }, region, prop) =>
  data[region] && data[region][prop] ?
    data[region][prop] : null
