import { connect } from 'react-redux';
import Tooltip from '../base/Tooltip';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

// const getValues = (feature, vals) =>
//   feature ? vals.map(v => {
//     return [
//       v[0],
//       feature.properties[v[1]] &&
//       feature.properties[v[1]] > -9999 ?
//         Math.round(feature.properties[v[1]]*100)/100 :
//         'Unavailable'
//     ]
//   }) : []

const getMetricLabel = (metric, value) => {
  if (!value || value <= -9999) { return 'Data unavailable' }
  switch (metric) {
    case 'avg':
      return `Students score ${Math.round(Math.abs(value)*100)/100} grade levels 
        ${value > 0 ? 'above' : 'below'} average`;
    case 'grd':
      return `Students grow ${Math.round(value*100)/100} grade levels each year`;
    case 'coh':
      return `Test scores ${value > 0 ? 'raising' : 'falling'} ${Math.round(Math.abs(value)*100)/100} 
        grade levels over time`;
    default:
      throw new Error(`no label for ${metric}`)
  }
}

const getFeatureName = (feature, results = {}) => {
  if (
    feature && 
    feature.properties && 
    feature.properties.name
  ) {
    return feature.properties.name
  }
  if (
    feature &&
    feature.properties &&
    feature.properties.id &&
    results[feature.properties.id]
  ) {
    return results[feature.properties.id].name
  }
  return null;
}

const mapStateToProps = ({ 
  hovered: { feature, coords },
  search: { results }
}, {
  match: { params: { metric, demographic } }
}) => ({
  x: coords && coords.x,
  y: coords && coords.y,
  visible: Boolean(feature) && Boolean(coords),
  title: getFeatureName(feature, results),
  content: feature && feature.properties && feature.properties[demographic + '_' + metric] ? 
    getMetricLabel(metric, feature.properties[demographic + '_' + metric]) :  
    ''
})

const MapTooltip = compose(
  withRouter,
  connect(mapStateToProps, null)
)(Tooltip)

export default MapTooltip