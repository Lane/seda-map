import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';

const noDataFill = "rgba(0,0,0,0)";

const getFillStyle = (dataProp, stops) => {
  return {
    property: dataProp,
    stops: [
      [ -9999, noDataFill ],
      ...stops
    ]
  }
  // combine stops into one dimensional array

  // stops = stops.reduce(
  //   (acc, curr) => [ ...acc, ...curr ], []
  // );

  // return [ 
  //   "case",
  //   [ "has", dataProp ],
  //   [
  //     "interpolate", [ "linear" ],
  //     [ "get", dataProp ],
  //     -9999, noDataFill,
  //     ...stops
  //   ],
  //   noDataFill
  // ]
}

export const getDotLayer = (region, dataProp, stops) => fromJS({
  id: 'dots',
  source: 'composite',
  'source-layer': region,
  type: 'circle',
  interactive: true,
  paint: {
    'circle-color': getFillStyle(dataProp, stops),
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
      '#f00',
      ["string", ["feature-state", "selected"], 'rgba(0,0,0,0)']
    ],
    "line-width": 3
  }
})

export const getChoroplethLayer = (region, dataProp, stops) => fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': region,
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': getFillStyle(dataProp, stops),
    'fill-opacity': 0.9
  }
});

export const getBackgroundChoroplethLayer = (region, dataProp, stops) => fromJS({
  id: 'choropleth',
  source: 'composite',
  'source-layer': region,
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': getFillStyle(dataProp, stops),
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