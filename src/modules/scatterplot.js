import { combineReducers } from "redux";

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
    default:
      return state;
  }
}

const isLoading = (state = false, action) => {
  switch(action.type) {
    case 'FETCH_VAR_REQUEST':
      return true
    case 'FETCH_VAR_SUCCESS':
      return false
    case 'FETCH_VAR_ERROR':
      return false
    default:
      return state
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
  isLoading,
  errorMessage
})

export default scatterplot;

// Helper Functions

export const getRegionData = ({ data }, region, prop) =>
  data[region] && data[region][prop] ?
    data[region][prop] : null
