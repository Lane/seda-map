import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';
import { getStopsForMetric } from '../constants/dataOptions';

const noDataFill = "#cccccc";

const getFillStyle = (dataProp) => {
  const metric = dataProp.split('_')[1];
  const stops = getStopsForMetric(metric).reduce(
    (acc, curr) => [ ...acc, ...curr ], []
  );
  return [ 
    "case",
    [ "has", dataProp ],
    [
      "interpolate",
      [ "linear" ],
      [ "get", dataProp ],
      -9999, noDataFill,
      ...stops
    ],
    noDataFill
  ]
}

export const getDotLayer = (region, dataProp) => fromJS({
  id: 'dots',
  source: 'composite',
  'source-layer': region,
  type: 'circle',
  interactive: true,
  paint: {
    'circle-color': getFillStyle(dataProp),
    'circle-opacity': 0.8,
    'circle-radius': [
      "interpolate",
      [ "linear" ],
      [ "zoom" ],
      0,
      2,
      14,
      10
    ],
    'circle-stroke-color': '#dce0de',
    'circle-stroke-width': [
      "interpolate",
      [ "linear" ],
      [ "zoom" ],
      6,
      0,
      14,
      2
    ]
  }
});

export const getChoroplethOutline = (region) => fromJS({
  "id": "choropleth-outline",
  "source": 'composite',
  "source-layer": region,
  type: 'line',
  paint: {
    'line-color': ["case",
      ["boolean", ["feature-state", "hover"], false],
      'rgba(255,0,0,1)',
      'rgba(255,0,0,0)'
    ],
    "line-width": ["case",
      ["boolean", ["feature-state", "hover"], false],
      3,
      0
    ],
  }
})

const getHeightStops = (dataProp) => {
  const stops = getStopsForMetric(dataProp.split('_')[1]);
  return stops.map((s,i) => [ s[0], 1000*(i*i) ])
}

export const getChoroplethExtrude = (region, dataProp) => fromJS({
  id: 'choropleth-extrude',
  source: 'composite',
  'source-layer': region,
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': getFillStyle(dataProp),
    'fill-extrusion-height': {
      property: dataProp,
      stops: getHeightStops(dataProp)
    },
    'fill-extrusion-base': 0,
    'fill-extrusion-opacity': 1
  }
})

export const getChoroplethLayer = (region, dataProp) => fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': region,
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': getFillStyle(dataProp),
    'fill-opacity': 0.9
  }
});

export const getBackgroundChoroplethLayer = (region, dataProp) => fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': region,
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': getFillStyle(dataProp),
    'fill-opacity': [
      "interpolate",
      [ "linear" ],
      [ "zoom" ],
      6,
      0,
      12,
      0.666
    ]
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);