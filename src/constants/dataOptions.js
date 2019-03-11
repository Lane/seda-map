
export const metrics = [
  { 
    id: 'avg',
    label: 'Average Test Scores',
    short_label: 'Avg. Test Score',
    description: 'Average test scores show the eductional opportunity for a region and if students are scoring above or below their grade level.',
    stops: [
      [ 2.5,  '#312B88' ],
      [ 3.25, '#6634C2' ],
      [ 4,    '#4452C7' ],
      [ 4.75, '#1C8AD4' ],
      [ 5.5,  '#45AED2' ],
      [ 6.25, '#73D4BF' ],
      [ 7,    '#9DE57F' ],
      [ 7.75, '#C8F393' ],
      [ 8.5,  '#FBEB93' ],
    ]
  },
  { 
    id: 'grd',
    label: 'Growth over years',
    description: 'Growth rates show how many grade levels the average student improves by each year',
    short_label: 'Growth Rate',
    stops: [
      [ 0.6, '#312B88' ],
      [ 0.7, '#6634C2' ],
      [ 0.8, '#4452C7' ],
      [ 0.9, '#1C8AD4' ],
      [ 1, '#45AED2' ],
      [ 1.1, '#73D4BF' ],
      [ 1.2, '#9DE57F' ],
      [ 1.3, '#C8F393' ],
      [ 1.4, '#FBEB93' ],
    ]
  },
  { 
    id: 'coh',
    label: 'Trend over years',
    description: 'The trend rate shows how test scores are rising or falling over time',
    short_label: 'Trend',
    stops: [
      [ -0.3, '#312B88' ],
      [ -0.225, '#6634C2' ],
      [ -0.15, '#4452C7' ],
      [ -0.075, '#1C8AD4' ],
      [ 0,    '#45AED2' ],
      [ 0.075,  '#73D4BF' ],
      [ 0.15,  '#9DE57F' ],
      [ 0.225,  '#C8F393' ],
      [ 0.3, '#FBEB93' ]
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
    label: 'School Districts'
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
