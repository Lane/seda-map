const initialState = {
  items: {
    'avg': { 
      id: 'avg',
      label: 'Average Test Scores',
      short_label: 'Avg. Test Score',
      description: 'Average test scores show the eductional opportunity for a region and if students are scoring above or below their grade level.',
      help: 'Average test scores for grades 3-8 explainer',
      min: -4,
      max: 4,
      numSteps: 9
    },
    'grd': { 
      id: 'grd',
      label: 'Growth over years',
      short_label: 'Growth Rate',
      descriptive_label: 'Grow %value% grade levels each year',
      help: 'Growth rate explainer',
      min: 0.6,
      max: 1.4,
      numSteps: 9
    },
    'coh': { 
      id: 'coh',
      label: 'Trend over years',
      short_label: 'Trend',
      help: 'Trend over years explainer',
      min: -0.3,
      max: 0.3,
      numSteps: 9
    }
  },
  colors: [
    '#252D7A', 
    '#37469C', 
    '#3561A8', 
    '#519DD4', 
    '#68C5D0', 
    '#A2E2D4', 
    '#E5F8C1', 
    '#F9FECC', 
    '#FFFFE7' 
  ]
}

// Reducer

/** Metrics are static for now, so no actions are handled */
const metrics = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export default metrics;


// Helper Functions

export const getMetricShortLabel = ({ items }, metric) => {
  if (items && items[metric] && items[metric].short_label) {
    return items[metric].short_label
  }
  throw new Error(`No short label for metric: ${metric}`);
}

/**
 * Gets expanded min / max of a metric by adding a provided
 * number of steps to each.
 * @param {Object} state object containing all metrics
 * @param {string} metric the metric to expand
 * @param {int} padSteps the number of steps to expand the min / max
 */
export const getPaddedMinMax = (state, metric, padSteps = 0) => {
  const m = state.items[metric];
  const numSteps = state.colors.length-1
  let { min, max } = m;
  if (padSteps) {
    const stepSize = Math.abs(max - min) / numSteps;
    min = Math.round((min - (stepSize * padSteps))*10)/10;
    max = Math.round((max + (stepSize * padSteps))*10)/10;
  }
  return { min, max }
}

/**
 * Get an array with step value associated to each color
 * @param {*} state metrics state containing metrics and colors
 * @param {*} metric the metric id to get stops for
 * @returns {Array<Array<number, string>>}
 */
export const getStops = (state, metric) => {
  const m = state.items[metric];
  const colors = state.colors;
  const { min, max } = m;
  const range = Math.abs(max - min);
  const stepSize = range / (colors.length - 1);
  return colors.map((c, i) =>
    [ (min + (i * stepSize)), c ]
  )
}
