

export const metrics = [
  { 
    id: 'avg',
    label: 'Average Test Scores',
    stops: [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
    ]
  },
  { 
    id: 'grd',
    label: 'Growth over years',
    stops: [
      0.2,
      0.4,
      0.6,
      0.8,
      1,
      1.2,
      1.4,
    ]
  },
  { 
    id: 'coh',
    label: 'Trend over years',
    stops: [
      -0.4,
      -0.3,
      -0.2,
      -0.1,
      0,   
      0.1, 
      0.2, 
      0.3, 
      0.4,
    ]
  }
];

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

export const getStopsForMetric = (metric, colors) => {
  const match = metrics.find(m => m.id === metric);
  if (!match) { 
    throw new Error('No metric found matching ' + metric); 
  }
  const offset = (colors.length - match.stops.length) / 2;
  const metricColors = colors.slice(offset, offset+match.stops.length);
  return match.stops.map((v,i) => [ v, metricColors[i] ]);
}
