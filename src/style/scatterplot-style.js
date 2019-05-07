import { fade } from '@material-ui/core/styles/colorManipulator';
import { isGapDemographic, isGapVar, getDemographicFromVarName, getLabelFromVarName, getMetricIdFromVarName, getMetricFromVarName, getSelectedColors, getChoroplethColors, getDemographicById, getDemographicIdFromVarName, getRangeFromVarName } from '../modules/config';
import { getStateName } from '../constants/statesFips';
import { getLang } from '../constants/lang';
import { getSizerFunction } from '../utils';

/** GRID CONFIGURATION  */

export const grid = (variant) => {
  switch(variant) {
    case 'map':
      return {
        top: 24,
        right: 100,
        bottom: 32,
        left: 24,
      }
    default:
      return { 
        top: 0, 
        right: 48,
        bottom: 48, 
        left: 0, 
      }
  }
}

const isStateHighlighed = (highlightedState) =>
  highlightedState && highlightedState !== 'us'

/** SERIES CONFIGURATION */

/**
 * Gets an echart series
 */
const getSeries = (seriesId, type, options) => ({
  id: seriesId,
  type: type,
  ...options
})


/**
 * Get the style overrides for the base series
 * @param {boolean} highlightedOn 
 */
const getBaseSeries = ({ highlightedState, sizer }) => {
  const hl = isStateHighlighed(highlightedState)
  return getSeries('base', 'scatter', {
    silent: hl,
    large: hl,
    largeThreshold: 0,
    itemStyle: {
      color: hl ? '#ddd' : '#76ced2cc',
      borderColor: hl ? 'transparent' : 'rgba(6, 29, 86, 0.4)',
      borderWidth: hl ? 0 : 0.75
    },
    symbolSize: hl ? 6 : (value) => sizer(value[2])
  })
}


/**
 * Get the style overrides for the highlight series
 */
const getHighlightedSeries = ({ highlightedState, sizer }) =>
  getSeries('highlighted', 'scatter', {
    show: isStateHighlighed(highlightedState),
    itemStyle: {
      borderColor: 'rgba(6, 29, 86, 0.4)'
    },
    symbolSize: (value) => sizer(value[2])
  })

/**
 * Get the style overrides for the selected series
 */
const getSelectedSeries = ({ colors = getSelectedColors() }) =>
  getSeries('selected', 'scatter', {
    label: {
      show:true,
      formatter: ({dataIndex}) => {
        return dataIndex+1
      },
      color: '#fff',
      textBorderColor: 'rgba(6, 29, 86, 1)',
      textBorderWidth: 3,
      fontWeight: 'bolder',
      fontSize: 16,
      position: 'top',
      
    },
    'emphasis': {
      label: { 
        textBorderColor: '#f00',
        show:true,
        color: '#fff',
        textBorderWidth: 3,
        fontWeight: 'bolder',
        fontSize: 16,
        position: 'top',
        distance: 5,
      }
    },
    itemStyle: {
      color: ({dataIndex}) => {
        return colors[dataIndex % colors.length]
      },
      borderWidth: 0,
      borderColor: 'rgba(0,0,0,0)',
      shadowColor: '#fff',
      shadowBlur: 1,
    }
  })




export const series = (seriesId, variant, options = {}) => {
  switch(seriesId) {
    case 'base':
      return getBaseSeries(options)
    case 'highlighted':
      return getHighlightedSeries(options)
    case 'selected':
      return getSelectedSeries(options)
    default:
      return getSeries(seriesId, variant, options)
  }
}

/** SCATTERPLOT OVERLAY CONFIGURATION */


/**
 * Gets `series.markPoints` echart options based on an
 * array of points.
 * @param {array<{axis, x, y, label, options}>} points
 */
const getMarkPoints = (points) => {
  return {
    animation: false,
    silent: true,
    data: points
      .map(p => p.axis ? getAxisPoint(p) : null)
      .filter(p => p)
  }
}

/**
 * Gets a echarts `series` containing any marked lines or
 * points for the graph.
 * @param {array} points 
 * @param {array} lines 
 */
const getOverlay = (points, lines) => {
  return {
    type: 'scatter',
    animation: false,
    silent: true,
    visualMap: false,
    data: points,
    symbolSize: 1,
    label: {
      show:false
    },
    markPoint: getMarkPoints(points.map(p => ({
      axis:'y', x: '93%', y: p.value[1], label: p.name
    }))),
    markLine: getMarkLines(lines)
  }
}

/**
 * Gets a point that falls on the x or y axis
 * @param {object} point 
 */
const getAxisPoint = ({axis, x, y, label, options }) => {
  const position = axis === 'y' ?
    { x: x, yAxis: y } :
    { y: y, xAxis: x };
    return {
      ...position,
      symbol: 'circle',
      symbolSize: 1,
      label: {
        formatter: '{val|' + label + '}',
        align: 'right',
        rich: {
          val: {
            fontSize: 11.7,
            fontWeight: 'normal',
            color: '#5d5d5d',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            textBorderColor: 'transparent',
            textBorderWidth: 0,
            lineHeight: 18
          }
        },
      },
      ...options
    }
}

/**
 * Gets `series.markLine` echart options based on an
 * array of lines.
 * @param {array<{axis, position, style}>} lines 
 */
const getMarkLines = (lines) => {
  return {
    animation: false,
    silent: true,
    data: lines
      .map(l => l.axis ? getAxisLine(l) : null)
      .filter(l => l)
  }
}

/**
 * Gets line data that spans the graph on the x or y axis
 * @param {object} line 
 */
const getAxisLine = ({axis, position, style}) => {
  const startPosition = axis === 'y' ?
    { x: 16, yAxis: position } :
    { y: 24, xAxis: position };
  const endPosition = axis === 'y' ?
    { x: '93%', yAxis: position } :
    { y: '100%', xAxis: position };
  return [
    {
      ...startPosition,
      symbol: 'none',
      lineStyle: {
        color: 'rgba(0,0,0,0.2)',
        ...style
      }
    },
    {
      ...endPosition,
      symbol: 'none' 
    }
  ]
}


const getLangKeyForAxisLabel = (value, metric) => {
  const base = 'AXIS_' + metric.toUpperCase()
  const position = value === 0 ? '_ZERO' :
    value > 0 ? '_HIGH' : '_LOW'
  const single = value === 1 ? '_SINGLE' : ''
  return base + position + single;
}

const getMapAverageOverlay = (region) => {
  // show lines and labels every 2 grades for schools
  const increment = region === 'schools' ? 2 : 1
  // schools go from -7 : 7, others go -3 : 3
  const start = region === 'schools' ? -6 : -3
  // number of lines to overlay
  const numLines = 7
  return getOverlay(
    new Array(numLines).fill().map((v, i) => {
      const position = start + (i * increment);
      const labelKey =
        getLangKeyForAxisLabel(position, 'avg')
      const label = getLang(labelKey, { value: Math.abs(position) })
      return {
        value: [0, position], 
        name: label,
        visualMap: false
      }
    }),
    new Array(numLines).fill().map((v, i) => ({
      axis: 'y',
      position: start + (i * increment)
    }))
  )
}



const getMapAverageGapOverlay = () => getOverlay(
  new Array(8).fill().map((v, i) => {
    const position = 0 - i;
    const labelKey =
      getLangKeyForAxisLabel(position, 'avg_gap')
    const label = getLang(labelKey, { value: position })
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(8).fill().map((v, i) => ({
    axis: 'y',
    position: 0 - i
  }))
)

const getMapGrowthOverlay = (region) => {
  // show lines and labels every 2 grades for schools
  const increment = region === 'schools' ? 0.5 : 0.2
  // schools go from -7 : 7, others go -3 : 3
  const start = region === 'schools' ? 0 : 0.4
  const numLines = region === 'schools' ? 5 : 7
  return getOverlay(
    new Array(numLines).fill().map((v, i) => {
      const position = Math.round((start + (i * increment)) * 10)/10;
      const labelKey =
        getLangKeyForAxisLabel(position, 'grd')
      const label = getLang(labelKey, { value: Math.abs(position) })
      return {
        value: [0, position], 
        name: label,
        visualMap: false
      }
    }),
    new Array(numLines).fill().map((v, i) => ({
      axis: 'y',
      position: Math.round((start + (i * increment)) * 10)/10
    }))
  )
}



const getMapGrowthGapOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = Math.round((-0.4 + (i * (1)/5)) * 10) / 10;
    const labelKey =
      getLangKeyForAxisLabel(position, 'grd_gap')
    const label = getLang(labelKey, { value: Math.abs(position) })
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: -0.4 + (i * 1/5)
  }))
)

const getMapTrendOverlay = (region) => {
  // show lines and labels every 2 grades for schools
  const increment = region === 'schools' ? 0.5 : 0.2
  // schools go from -7 : 7, others go -3 : 3
  const start = region === 'schools' ? -1 : -0.4
  const numLines = 5
  return getOverlay(
    new Array(numLines).fill().map((v, i) => {
      const position = Math.round((start + (i * increment))*10)/10;
      const labelKey =
        getLangKeyForAxisLabel(position, 'coh')
      const label = getLang(labelKey, { value: Math.abs(position) })
      return {
        value: [0, position], 
        name: label,
        visualMap: false
      }
    }),
    new Array(numLines).fill().map((v, i) => ({
      axis: 'y',
      position: start + (i * increment)
    }))
  )
}

const getMapTrendGapOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = Math.round((-0.2 + (i * 0.1))*10)/10;
    const labelKey =
      getLangKeyForAxisLabel(position, 'coh_gap')
    const label = getLang(labelKey, { value: Math.abs(position) })
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: -0.2 + (i * 0.1)
  }))
)

/**
 * Gets the overlay series fo the opportunity differences section
 * Has a line marking where x == y and text label.
 * @param {*} xVar 
 */
const getOpportunityOverlay = (xVar) => {
  const metric = getMetricIdFromVarName(xVar);
  // label start coordinates for the label along the line
  const labelStart = metric === 'avg' ? [-4, -4] :
    metric === 'grd' ? [ 0.2, 0.2 ] : [ -0.3, -0.3 ];
  const labelEnd = metric === 'avg' ? [-2, -2] :
    metric === 'grd' ? [ 0.6, 0.6 ] : [ -0.2, -0.2 ];
  return {
    type: 'line',
    animation: false,
    silent: true,
    visualMap: false,
    data: [[-5, -5], [5, 5]],
    symbolSize: 0.1,
    label: {
      show:false
    },
    itemStyle: {
      color: '#031232',
    },
    lineStyle: {
      type: 'dashed',
      opacity: 0.5,
      width:1
    },
    markLine: {
      animation: false,
      silent: true,
      label: {
        position: 'middle',
        formatter: function(value) {
          return value.name
        },
        color: '#031232',
        fontSize: 12.8,
      },
      lineStyle: {
        color: 'transparent'
      },
      data: [
        [
          { 
            name: getLang('OPP_DIFF_EQUAL_LINE_' + metric.toUpperCase()), 
            coord: labelStart, 
            symbol: 'none',
          },
          { coord: labelEnd, symbol: 'none' },
        ]
      ]
    }
  }
}

const overlays = (variant, { xVar, yVar, region }) => {
  const yMetricId = getMetricIdFromVarName(yVar);
  switch(yMetricId + '_' + variant) {
    case 'avg_map':
      if (isGapVar(yVar))
        return [ getMapAverageGapOverlay() ]
      else
        return [ getMapAverageOverlay(region) ]
    case 'grd_map':
      if (isGapVar(yVar))
        return [ getMapGrowthGapOverlay() ]
      else
        return [ getMapGrowthOverlay(region) ]
    case 'coh_map':
      if (isGapVar(yVar))
        return [ getMapTrendGapOverlay() ]
      else
        return [ getMapTrendOverlay(region) ]
    case 'avg_opp':
    case 'grd_opp':
    case 'coh_opp':
      return [ getOpportunityOverlay(xVar) ]
    default:
      return []
  }
}

/** VISUAL MAP CONFIGURATION */

const getMapVisualMap = ({
  varName,
  colors = getChoroplethColors(), 
  highlightedState,
  region
}) => {
  const range = getRangeFromVarName(varName, region)
  return {
    type: 'continuous',
    min: range[0],
    max: range[1],
    inRange: {
      color: colors.map(c => fade(c, 0.9))
    },
    show: false,
    seriesIndex: isStateHighlighed(highlightedState) ? 2 : 0,
    calculable: true,
    right:0,
    bottom:'auto',
    top:'auto',
    left: 'auto',
    orient: 'vertical',
    itemHeight: 400,
    itemWidth: 24,
    precision: 1,
  }
}

const visualMap = (
  variant,
  options,
) => {
  switch (variant) {
    case 'map':
      return [ getMapVisualMap(options) ]
    default:
      return []
  }
}

/** X AXIS CONFIGURATION */

const getXAxis = ({ metric, demographic, region, ...rest }) => {
  const [ min, max ] = getRangeFromVarName([demographic.id, metric.id].join('_'), region);
  return {
    min,
    max,
    axisLabel: { show: true },
    axisLine: { show: false },
    splitLine: { show: true },
    splitNumber: 7,
    nameGap: 32,
    nameLocation: 'middle',
    name: metric.label + (
      demographic && demographic.label ? 
        ' (' + demographic.label + ' students)' : 
        ''
    ),
    nameTextStyle: {
      fontSize: 12.8,
      fontWeight: 'normal',
      color: '#031232',
    },
    ...rest
  }
}



const getMapXAxis = ({ metric, demographic, region }) => {
  const [ min, max ] = getRangeFromVarName([demographic.id, metric.id].join('_'), region);
  return {
    min, 
    max,
    axisLabel: {
      inside: true,
      formatter: (value) => {
        // percent for schools
        return region === 'schools' ?
          (value*100)+'%' : value
      }
    },
    name: region === 'schools' ? 
      getLang('LABEL_PCT') + ' ' + getLang('LABEL_FRL') :
      getLang('LABEL_SES')
    ,
    nameGap: 8,
    nameTextStyle: {
      fontSize: 12.8,
      fontWeight: 'normal',
      color: '#031232',
    },
    splitLine: { show: false },
  }
}  


const getGrowthXAxis = (options) => getXAxis({
  ...options,
  splitNumber: 5,
  interval: 0.2,
})

const getSocioeconomicXAxis = ({ metric, demographic, region }) => getXAxis({
  metric,
  demographic,
  name: metric.label + (
    demographic && demographic.label ? 
      ' (' + demographic.label + ')' : 
      ''
  ),
  region
})

const xAxis = (variant, { varName, region }) => {
  const metric = getMetricFromVarName(varName);
  const demographic = getDemographicFromVarName(varName);
  if (!metric || !demographic) { return {} }
  switch (variant) {
    case 'map':
      return getMapXAxis({ metric, demographic, region })
    default:
      if (
        metric.id === 'grd' && 
        ['p','np','b'].indexOf(demographic.id) > -1
      )
        return getGrowthXAxis({metric, demographic, region})
      else if (
        metric.id === 'ses' && 
        ['wb','wh','wa','pn'].indexOf(demographic.id) > -1
      )
        return getSocioeconomicXAxis({ metric, demographic, region })
      else
        return getXAxis({metric, demographic, region})
  }
}

/** Y AXIS CONFIGURATION */

const getYAxis = ({metric, demographic, region, ...rest}) => {
  const [ min, max ] = getRangeFromVarName(
    [demographic.id, metric.id].join('_'), region
  )
  return {
    min,
    max,
    position: 'right',
    axisLabel: { 
      show: true,
      showMinLabel: false,
      showMaxLabel: false,
    },
    axisLine: { show: false },
    splitLine: { show: true },
    splitNumber: 7,
    name: metric.label + (
      demographic && demographic.label ? 
        ' (' + demographic.label + ' students)' : 
        ''
    ),
    nameGap: 32,
    nameLocation: 'middle',
    ...rest
  }
}

const getMapYAxis = ({metric, demographic, region, ...rest}) => {
  const [ min, max ] = getRangeFromVarName(
    [demographic.id, metric.id].join('_'), region
  )
  return {
    min,
    max,
    position: 'right',
    axisLabel: { 
      show: false,
      showMinLabel: false,
      showMaxLabel: false,
    },
    axisLine: { 
      show: region === 'schools' ? false : true,
      lineStyle: {
        type: 'dashed',
        color: '#ccc'
      }
    },
    splitLine: { show: false },
    name: getLang('LABEL_' + metric.id.toUpperCase()),
    nameGap: 80,
    nameLocation: 'middle',
    ...rest
  }
}

const yAxis = (variant, { varName, region }) => {
  const metric = getMetricFromVarName(varName);
  const demographic = getDemographicFromVarName(varName);
  if (!metric || !demographic) { return {} }
  switch (variant) {
    case 'map':
      return getMapYAxis({ metric, demographic, region })
    default:
      return getYAxis({ metric, demographic, region })
  }
}

/** TOOLTIP CONFIGURATION */

const getGapLabel = (gapId) => {
  const dem1 = 
    getDemographicById(gapId[0])
  const dem2 = 
    getDemographicById(gapId[1] === 'n' ? 'np' : gapId[1])
  return getLang('LABEL_GAP', {
    demographic1: dem1.label,
    demographic2: dem2.label
  }).toLowerCase()
}

const getAverageScoreDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    getLang('VALUE_AVG_GAP', {
      amount,
      gap: getGapLabel(demographicId)
    })
    :
    getLang('VALUE_AVG', {
      amount: Math.abs(amount),
      aboveBehind: amount > 0 ? 'above' : 'behind'
    })
}

const getGrowthDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    getLang('VALUE_GRD_GAP', {
      amount: Math.abs(amount),
      gap: getGapLabel(demographicId),
      increasedDecreased: amount > 0 ? 'increased' : 'decreased'
    })
    :
    getLang('VALUE_GRD', { amount })
}

const getTrendDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    getLang('VALUE_COH_GAP', {
      amount: amount > 0 ? 'increased' : 'decreased',
      increasedDecreased: Math.abs(amount),
      gap: getGapLabel(demographicId) 
    })
    :
    getLang('VALUE_COH', {
      risingFalling: amount > 0 ? 'rising' : 'falling',
      amount: Math.abs(amount)
    })
}

const getDescriptionForVarName = (varName, value) => {
  if (!value || value === -9999) { return ''; }
  const metric = getMetricFromVarName(varName);
  switch(metric.id) {
    case 'avg':
      return getAverageScoreDescription(value, varName)
    case 'grd':
      return getGrowthDescription(value, varName)
    case 'coh':
      return getTrendDescription(value, varName)
    default:
      return ''
  }
}

/**
 * Get the label for the provided varnames and values
 * @param {*} values 
 */
export const getTooltipText = (values) =>
  Object.keys(values).reduce((str, varName) => {
    return str + getDescriptionForVarName(varName, values[varName])
  }, '')

const getTooltip = ({ data, xVar, yVar, ...rest }) => {
  const xLabel = getLabelFromVarName(xVar);
  const yLabel = getLabelFromVarName(yVar);
  const placeNames = data && data.name ? data.name : {};
  return {
    show:true,
    trigger: 'item',
    formatter: ({value}) => {
      const name = placeNames && placeNames[value[3]] ? 
        placeNames[value[3]] : getLang('NO_DATA')
      const stateName = getStateName(value[3])
      const line1 = xLabel + ': ' + value[0];
      const line2 = yLabel + ': ' + value[1];
      return `
        <div class="tooltip__title">${name}, ${stateName}</div>
        <div class="tooltip__content">
          ${line1}<br />
          ${line2}
        </div>        
      `
    },
    ...rest
  }
}

const getMapTooltip = ({data, xVar, yVar}) => getTooltip({
  data,
  xVar,
  yVar, 
  extraCssText: 'max-width: 188px; white-space: normal',
  formatter: ({value}) => {
    const placeNames = data && data.name ? data.name : {};
    const name = placeNames && placeNames[value[3]] ? 
      placeNames[value[3]] : 'Unknown'
    const stateName = getStateName(value[3])
    return `
      <div class="tooltip__title">${name}, ${stateName}</div>
      <div class="tooltip__content">
        ${getTooltipText({ [xVar]: value[0], [yVar]: value[1] })}
      </div>
    `
  }
})

const tooltip = (variant, { data, xVar, yVar }) => {
  switch(variant) {
    case 'map':
      return getMapTooltip({ data, xVar, yVar })
    default:
      return getTooltip({ data, xVar, yVar })
  }
}

export const getScatterplotOptions = (
  variant,
  data = {},
  { xVar, yVar, zVar },
  highlightedState,
  region
) => {
  if (!data[xVar] || !data[yVar] || !data[zVar]) { return {} }
  const sizer = getSizerFunction(data[zVar], { range: [ 8, 48 ]})
  const options = {
    grid: grid(variant),
    visualMap: visualMap(variant, { varName: yVar, highlightedState, region }),
    xAxis: xAxis(variant, { varName: xVar, region }),
    yAxis: yAxis(variant, { varName: yVar, region }),
    series: [
      series('base', variant, { highlightedState, sizer }),
      series('highlighted', variant, { highlightedState, sizer }),
      ...overlays(variant, { xVar, yVar, region })
    ],
    tooltip: tooltip(variant, { data, xVar, yVar })
  }
  return options;
}

