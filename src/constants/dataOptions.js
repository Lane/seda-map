
export const metrics = [
  { 
    id: 'avg',
    label: 'Average Test Scores',
    short_label: 'Avg. Test Score',
    stops: [
      [ 2.5,  '#252D7A' ],
      [ 3.25, '#37469C' ],
      [ 4,    '#3561A8' ],
      [ 4.75, '#519DD4' ],
      [ 5.5,  '#68C5D0' ],
      [ 6.25, '#A2E2D4' ],
      [ 7,    '#E5F8C1' ],
      [ 7.75, '#F9FECC' ],
      [ 8.5,  '#FFFFE7' ],
    ]
  },
  { 
    id: 'grd',
    label: 'Growth over years',
    short_label: 'Growth Rate',
    stops: [
      [ 0.6, '#252D7A' ],
      [ 0.7, '#37469C' ],
      [ 0.8, '#3561A8' ],
      [ 0.9, '#519DD4' ],
      [ 1,   '#68C5D0' ],
      [ 1.1, '#A2E2D4' ],
      [ 1.2, '#E5F8C1' ],
      [ 1.3, '#F9FECC' ],
      [ 1.4, '#FFFFE7' ],
    ]
  },
  { 
    id: 'coh',
    label: 'Trend over years',
    short_label: 'Trend',
    stops: [
      [ -0.3,   '#252D7A' ],
      [ -0.225, '#37469C' ],
      [ -0.15,  '#3561A8' ],
      [ -0.075, '#519DD4' ],
      [ 0,      '#68C5D0' ],
      [ 0.075,  '#A2E2D4' ],
      [ 0.15,   '#E5F8C1' ],
      [ 0.225,  '#F9FECC' ],
      [ 0.3,    '#FFFFE7' ]
    ]
  }
];

export const getMetric = (id) => metrics.find(m => m.id === id)

export const regions = [
  {
    id: 'counties',
    label: 'Counties'
  },
  {
    id: 'districts',
    label: 'Districts'
  },
  {
    id: 'schools',
    label: 'Schools'
  }
];

export const demographics = [
  {
    id: 'all',
    label: 'Total Population'
  },
  {
    id: 'w',
    label: 'White'
  },
  {
    id: 'b',
    label: 'Black'
  },
  {
    id: 'h',
    label: 'Hispanic'
  },
  {
    id: 'a',
    label: 'Asian'
  },
  {
    id: 'm',
    label: 'Male'
  },
  {
    id: 'f',
    label: 'Female'
  },
  {
    id: 'p',
    label: 'Poor'
  },
  {
    id: 'np',
    label: 'Non-Poor'
  },
]

export const getStopsForMetric = (metric) => {
  const match = metrics.find(m => m.id === metric);
  if (!match) { 
    throw new Error('No metric found matching ' + metric); 
  }
  return match.stops;
}
