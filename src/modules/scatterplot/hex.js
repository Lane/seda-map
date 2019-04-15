
/**
 * Hexbin statistics code based on [d3-hexbin](https://github.com/d3/d3-hexbin)
 * @param {array} points 
 * @param {number} r 
 */
const hexBinStatistics = (points, r) => {
  var dx = r * 2 * Math.sin(Math.PI / 3);
  var dy = r * 1.5;
  var binsById = {};
  var bins = [];

  for (var i = 0, n = points.length; i < n; ++i) {
      var point = points[i];
      var px = point[0];
      var py = point[1];

      if (isNaN(px) || isNaN(py)) {
          continue;
      }

      var pj = Math.round(py = py / dy);
      var pi = Math.round(px = px / dx - (pj & 1) / 2);
      var py1 = py - pj;

      if (Math.abs(py1) * 3 > 1) {
          var px1 = px - pi;
          var pi2 = pi + (px < pi ? -1 : 1) / 2;
          var pj2 = pj + (py < pj ? -1 : 1);
          var px2 = px - pi2;
          var py2 = py - pj2;
          if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
              pi = pi2 + (pj & 1 ? 1 : -1) / 2;
              pj = pj2;
          }
      }

      var id = pi + "-" + pj;
      var bin = binsById[id];
      if (bin) {
          bin.points.push(point);
      }
      else {
          bins.push(bin = binsById[id] = {points: [point]});
          bin.x = (pi + (pj & 1) / 2) * dx;
          bin.y = pj * dy;
      }
  }

  var maxBinLen = -Infinity;
  for (let i = 0; i < bins.length; i++) {
      maxBinLen = Math.max(maxBinLen, bins[i].points.length);
  }

  return {
      maxBinLen: maxBinLen,
      bins: bins
  };
}

/**
 * Takes multiple data sets with identifiers and merges them
 * into one for use with echarts scatterplot. Filters out 
 * entries where there are not values in all data sets.
 * @param {object} sets a variable amount of data sets - e.g. { "01001": 3.45, ... }
 * @returns {object} e.g. { "01001": [ 3.45, 5.10, 01001 ], ... }
 */
const mergeDatasets = (...sets) => {
  // filter out IDs that are not common to all sets
  const ids = Object.keys(sets[0]).filter(id =>
    sets.reduce((acc, curr) =>
      acc ? 
        curr.hasOwnProperty(id) && 
        parseFloat(curr[id]) > -9999 &&
        parseFloat(curr[id]) > -9999 &&
        id !== "" && id !== "id"
        : false
    , true)
  )
  // create an object with all merged data
  const merged = ids.reduce(
    (acc, curr) => {
      acc[curr] = [
        ...sets.map(s => parseFloat(s[curr])),
        curr
      ]
      return acc;
    }, {}
  )
  return merged;
}

/**
 * Returns provided datasets merged into an array that
 * can be used with eCharts data series.
 * @param  {...any} sets a variable number of data sets (e.g { '0100001' : 2.44, ... })
 */
const getScatterplotData = (...sets) => {
  if (sets.length < 1) {
    throw new Error('Cannot create scatterplot data with less than two variables')
  }
  const merged = mergeDatasets(...sets);
  return Object.keys(merged).map(k => merged[k])
}

/**
 * Custom renderer for hex bins
 * @param {*} params 
 * @param {*} api 
 */
const renderItemHexBin = (params, api) => {
  const hexagonRadiusInGeo = 0.1;
  var center = api.coord([api.value(0), api.value(1)]);
  var pointsBG = [];

  var maxViewRadius = api.size([hexagonRadiusInGeo, 0])[0];

  var angle = Math.PI / 6;
  for (var i = 0; i < 6; i++, angle += Math.PI / 3) {
      pointsBG.push([
          center[0] + maxViewRadius * Math.cos(angle),
          center[1] + maxViewRadius * Math.sin(angle)
      ]);
  }

  return {
      type: 'group',
      children: [{
          type: 'polygon',
          shape: {
              points: pointsBG
          },
          style: {
              stroke: null,
              fill: api.visual('color'),
              lineWidth: 0,
          },
          z2: -19
      }]
  };
}

const getHexSeries = (data) => {
  return {
    type: 'custom',
    silent: true,
    renderItem: renderItemHexBin,
    dimensions: [null, null, 'Schools'],
    data: data
  }
}

const getHexVisualMap = ({ maxLength = 10, seriesIndex = 3 }) => {
  return {
    type: 'continuous',
    show: true,
    min: 0,
    max: maxLength,
    dimension: 2,
    seriesIndex: seriesIndex,
    calculable: false,
    inRange: {
      color: ['#eef4ff', '#6699cc' ]
    }
  }
}

/**
 * Returns options specific to hex binning
 * @param {*} data 
 * @param {*} param1 
 */
export const getHexBinOptions = (data, { xVar, yVar, radius = 0.1 }) => {
  const hexBin = hexBinStatistics(
    getScatterplotData(data[xVar], data[yVar]),
    radius
  )
  const binData = hexBin.bins.map(bin => [bin.x, bin.y, bin.points.length])
  return {
    visualMap: [ getHexVisualMap({ maxLength: hexBin.maxBinLen }) ],
    series: [ getHexSeries(binData) ]
  }
}