const initialState = {
  items: {
    'avg': { 
      id: 'avg',
      label: 'Average Test Scores',
      short_label: 'Avg. Test Score',
      description: 'Shows the set of educational opportunities children have had from birth to the time they take the tests',
      help: 'Average test scores for grades 3-8 explainer',
      min: -4,
      max: 4,
      regions: [ 'counties', 'districts', 'schools' ],
      map: true,
      scatterplot: true,
    },
    'grd': { 
      id: 'grd',
      label: 'Growth of test scores',
      short_label: 'Growth Rate',
      descriptive_label: 'Grow %value% grade levels each year',
      description: 'Shows how much students learn on average while they are in school',
      min: 0.4,
      max: 1.6,
      regions: [ 'counties', 'districts', 'schools' ],
      map: true,
      scatterplot: true,
    },
    'coh': { 
      id: 'coh',
      label: 'Trend of test scores',
      short_label: 'Trend',
      description: 'Indicates the extent to which a community is getting better at providing educational opportunities over time',
      min: -0.3,
      max: 0.3,
      regions: [ 'counties', 'districts', 'schools' ],
      map: true,
      scatterplot: true,
    },
    'ses': {
      id: 'ses',
      label: 'Socioeconomic Status',
      short_label: 'SES',
      description: 'Socioeconomic status helper',
      regions: [ 'counties', 'districts' ],
      map: false,
      scatterplot: true
    },
    'seg': {
      id: 'seg',
      label: 'Segregation Measure',
      short_label: 'Segregation',
      description: 'Segregation status helper',
      regions: [ 'counties', 'districts' ],
      map: false,
      scatterplot: true
    },
    'frl': {
      id: 'frl',
      label: 'Free reduced lunch',
      regions: [ 'schools' ],
      map: false,
      scatterplot: true,
    }
  },
  colors: [
    '#37469C', 
    '#3561A8', 
    '#519DD4', 
    '#68C5D0', 
    '#A2E2D4', 
    '#E5F8C1', 
    '#F9FECC'
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

/**
 * Gets an object mapping metric ID to label
 * @param {object} state metrics state
 * @param {array} metricIds an array of metric IDs
 */
export const getMetricLabels = ({ items }, metricIds, demographic) => {
  return metricIds.reduce((acc, curr) => {
    const demKey = demographic ? demographic + '_' + curr : curr
    if (items && items[curr] && items[curr].label) {
      acc[demKey] = items[curr].label;
      return acc;
    }
    throw new Error(`No label for metric: ${curr}`);
  }, {})
}

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
  const stepSize = range / (colors.length);
  return colors.map((c, i) =>
    [ (min + (i * stepSize)), c ]
  )
}

/**
 * Pads both sides of the provided stops by the given amount
 * @param {*} stops 
 * @param {*} amount 
 */
export const getPaddedStops = (stops, amount) => {
  const targetLength = (stops.length-1) + (amount*2)
  const newStops = [];
  for(var i = 0; i < targetLength; i++) {
    newStops[i] = (i >= (targetLength - stops.length + amount)) ?
      ((i <= stops.length - 1) ? stops[i] : stops[stops.length - 1])
      : stops[0]
  }
  return newStops
}