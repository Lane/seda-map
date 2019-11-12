import LANG from "./en";

/** min / max dot sizes */
export const DOT_SIZES = [ 4, 64 ]

export const FUNC_VARS = {
  'counties': {
    'avg': [ -0.051,	0.795, 0.033, 0.023 ],
    'grd': [ 0.990,	0.046, 0.001, 0.001 ],
    'coh': [ 0.018, -0.003, 0.008, 0.006 ],
  },
  'districts': {
    'avg': [ -0.185,	0.812, 0.126, 0.03 ],
    'grd': [ 0.989,	0.045, 0.011, 0.002 ],
    'coh': [ 0.015,	0.01, 0.004, 0.001 ],
  },
  'schools': {
    'avg': [ 2.567, -8.308, 9.249, -5.765 ],
    'grd': [ 1.183, -0.468, 0.406, -0.134 ],
    'coh': [ 0.069, -0.139, 0.109, -0.041 ],
  }
};


/** data ranges to map to size ranges */
export const REGION_DOMAINS = {
  'all_counties': [ 3, 110000 ],
  'b_counties':   [ 3, 21000 ],
  'w_counties':   [ 3, 22000 ],
  'h_counties':   [ 3, 75000 ],
  'a_counties':   [ 3, 10000 ],
  'f_counties':   [ 3, 56000 ],
  'm_counties':   [ 3, 59000 ],
  'p_counties':   [ 3, 81000 ],
  'np_counties':  [ 3, 34000 ],
  'wb_counties':  [ 9, 32000 ],
  'wh_counties':  [ 5, 92000 ],
  'wa_counties':  [ 3, 34000 ],
  'pn_counties':  [ 6, 116000 ],
  'mf_counties':  [ 6, 115000 ],
  'all_districts': [ 2, 71000 ],
  'b_districts':   [ 2, 21000 ],
  'w_districts':   [ 2, 10000 ],
  'h_districts':   [ 2, 36000 ],
  'a_districts':   [ 2, 10000 ],
  'f_districts':   [ 2, 35000 ],
  'm_districts':   [ 2, 35000 ],
  'p_districts':   [ 2, 60000 ],
  'np_districts':  [ 2, 11000 ],
  'wb_districts':  [ 4, 31000 ],
  'wh_districts':  [ 4, 41000 ],
  'wa_districts':  [ 2, 11000 ],
  'pn_districts':  [ 4, 71000 ],
  'mf_districts':  [ 4, 71000 ],
  'schools': [ 10, 1000 ],
}


export const MAX_LOCATIONS = 6;


export const MAP_REGION_TO_ID_LENGTH = {
  'counties': 5,
  'districts': 7,
  'schools': 12
}

export const MAP_ID_LENGTH_TO_REGION = {
  2: 'states',
  5: 'counties',
  7: 'districts',
  12: 'schools'
}

/**
 * Variables contained in the base csv file for each region
 */
export const BASE_VARS = {
  'counties': ['id', 'name', 'lat', 'lon', 'all_sz' ],
  'districts': ['id', 'name', 'lat', 'lon', 'all_sz' ],
  'schools': ['id', 'name', 'lat', 'lon', 'all_sz' ]
}

/**
 * Colors for selected locations
 */
export const SELECTED_COLORS = [
  '#F46800', 
  '#8C1AF4', 
  '#B2002A', 
  '#F84EBF', 
  '#3F00B3', 
  '#FF0C0C'
];

/**
 * colors for map choropleths
 */
export const CHOROPLETH_COLORS = [
  '#174b80',
  '#4189d2',
  '#abd9e9',
  '#f7f7f7',
  '#bfe9ab',
  '#2fb57f',
  '#136e4a'
];

export const NO_DATA_COLOR = '#ccc';

/**
 * Data metrics in the SEDA data set
 */
export const METRICS = [
  {
    id: 'avg',
    label: LANG['LABEL_AVG'],
    range: {
      'map_*_gap': [ -6, 6 ],
      'map_counties': [ -3, 3 ],
      'map_districts': [ -3.5, 3.5 ],
      'map_schools': [ -5, 5 ],
      '*_counties_np': [ -4, 3 ],
      '*_counties_wh': [ -1.5, 4.5 ],
      '*_districts_wh': [ -1.5, 5 ],
      '*_*_gap': [ -0.5, 5 ],
      '*_counties_b': [ -4, 2 ],
      '*_counties_w': [ -4, 4 ],
      '*_counties_a': [ -4, 5 ],
      '*_counties': [ -4.5, 2.5 ],

      '*_districts_b': [ -4, 3 ],
      '*_districts_w': [ -4, 4 ],
      '*_districts_a': [ -4, 5 ],
      '*_districts': [ -4.5, 4.5 ],
      '*_schools': [ -8, 7 ],
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'grd',
    label: LANG['LABEL_GRD'],
    range: {
      'map_*_gap': [ -0.4, 0.4 ],
      'map_*_*': [ 0.5, 1.5 ],
      '*_schools': [ -0.2, 2.6 ],
      '*_*_b': [0.4, 1.4],
      '*_*_wb': [ -0.3, 0.45 ],
      '*_*_gap': [ -0.4, 0.4 ],
      '*': [ 0.4, 1.6 ],
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'coh',
    label: LANG['LABEL_COH'],
    range: {
      'map_*_*': [ -0.333, 0.3333 ],
      '*_*_gap': [-0.25, 0.25],
      '*_schools': [-1, 1],
      '*': [ -0.5, 0.5 ],
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'ses',
    label: LANG['LABEL_SES_NO_REGION'],
    map: false,
    scatterplot: true,
    range: {
      '*_districts_h': [-5, 3],
      '*_counties_h': [-4, 2],
      '*_*_b': [ -6, 2 ],
      '*_*_h': [ -6, 2 ],
      '*_districts_wb': [ -1, 6 ],
      '*_*_wb': [ 0, 5 ],
      '*_districts_wh': [ -1, 5 ],
      '*_*_wh': [ -0.5, 4.5 ],
      'map_*_*': [ -3, 3 ],
      '*_counties': [-4, 3],
      '*_districts_w': [-3, 3],
      '*_districts': [-5, 3],
      '*': [ -5, 4 ],
    }
  },
  {
    id: 'seg',
    label: LANG['LABEL_SEG'],
    range: {
      '*_*_np': [ 0, 0.75 ],
      '*': [ -0.25, 0.75 ],

    },
    map: false,
    scatterplot: true
  },
  {
    id: 'min',
    label: LANG['LABEL_MIN'],
    range: {
      '*': [ -0.1, 0.7 ],

    }
  },
  {
    id: 'frl',
    label: LANG['LABEL_FRL'],
    range: {
      '*': [ 0, 1 ],
    },
    map: false,
    scatterplot: true
  },
]

/**
 * regions data is available for
 */
export const REGIONS = [
  {
    id: 'counties',
    label: LANG['LABEL_COUNTIES'],
    singular: LANG['LABEL_COUNTIES_SINGULAR']
  },
  {
    id: 'districts',
    label: LANG['LABEL_DISTRICTS'],
    singular: LANG['LABEL_DISTRICTS_SINGULAR']
  },
  {
    id: 'schools',
    label: LANG['LABEL_SCHOOLS'],
    singular: LANG['LABEL_SCHOOLS_SINGULAR']
  }
];

/**
 * demographics data is available for
 */
export const DEMOGRAPHICS = [
  {
    id: 'all',
    label: LANG['LABEL_ALL']
  },
  {
    id: 'w',
    label: LANG['LABEL_W']
  },
  {
    id: 'b',
    label: LANG['LABEL_B']
  },
  {
    id: 'h',
    label: LANG['LABEL_H']
  },
  {
    id: 'a',
    label: LANG['LABEL_A']
  },
  {
    id: 'm',
    label: LANG['LABEL_M']
  },
  {
    id: 'f',
    label: LANG['LABEL_F']
  },
  {
    id: 'p',
    label: LANG['LABEL_P']
  },
  {
    id: 'np',
    label: LANG['LABEL_NP']
  }
]

/**
 * gaps data is available for
 */
export const GAPS = [
  {
    id: 'wb',
    label: LANG['LABEL_WB']
  },
  {
    id: 'wh',
    label: LANG['LABEL_WH']
  },
  {
    id: 'pn',
    label: LANG['LABEL_PN']
  },
  {
    id: 'mf',
    label: LANG['LABEL_MF']
  }
]
