

export const metrics = [
  { 
    id: 'avg',
    label: 'Average Test Scores',
    stops: [
      2.5,
      3.25,
      4,
      4.75,
      5.5,
      6.25,
      7,
      7.75,
      8.5
    ]
  },
  { 
    id: 'grd',
    label: 'Growth over years',
    stops: [
      0.6,
      0.7,
      0.8,
      0.9,
      1,
      1.1,
      1.2,
      1.3,
      1.4
    ]
  },
  { 
    id: 'coh',
    label: 'Trend over years',
    stops: [
      -0.3,
      -0.225,
      -0.15,
      -0.075,
      0,   
      0.075, 
      0.15, 
      0.225, 
      0.3,
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
