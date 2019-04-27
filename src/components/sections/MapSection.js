import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { getChoroplethColors, getValuePositionForMetric, getSelectedColors, isGapDemographic } from '../../modules/config';
import { getRegionControl, getMetricControl, getDemographicGapControl, getHighlightControl } from '../../modules/controls';
import { navigateToStateByAbbr } from '../../actions/mapActions';
import { updateRoute } from '../../modules/router';
import { getStateFipsFromAbbr } from '../../constants/statesFips';
import { getFeatureProperty } from '../../modules/features';
import SplitSection from '../base/SplitSection';
import { getMapViewport } from '../../modules/map';
import { getLang } from '../../constants/lang';
import { getScatterplotDispatchForSection, getCardDispatchForSection, getMapDispatchForSection } from '../../actions/sectionActions';
import { getHoveredId, getCards } from '../../modules/sections';

/**
 * Gets the variables for the map section
 * @param {string} region 
 * @param {string} metric 
 * @param {string} demographic 
 */
const getVars = (region, metric, demographic) => ({
  yVar: region === 'schools' ? 
    'all_' + metric : 
    demographic + '_' + metric,
  xVar: region === 'schools' ? 
    'frl_pct' : 
    demographic + '_ses',
  zVar: 'all_sz'
})

/**
 * Gets the controls for the map section
 * @param {string} metric 
 * @param {string} demographic 
 * @param {string} region 
 * @param {string} highlightedState 
 */
const getControls = 
  (metric, demographic, region, highlightedState) => {
    const controls = [
      getMetricControl(metric),
      getRegionControl(region),
      getHighlightControl(highlightedState)
    ];
    // add demographic control if not schools
    if (region !== 'schools') {
      controls.splice( 1, 0, getDemographicGapControl(demographic));
    }
    return controls
  }


const mapStateToProps = ({ 
  scatterplot: { data },
  selected,
  features,
  sections: { map: { hovered }, active },
  map: { viewport, idMap },
},
{ match: { params: { region, metric, demographic, highlightedState, ...params } } }
) => {
  const vars = getVars(region, metric, demographic)
  const controls = getControls(metric, demographic, region, highlightedState)
  const hoveredId = getHoveredId(hovered)
  const selectedArray = selected && selected[region] ? 
    selected[region] : []
  return ({
    section: {
      id: 'map',
      title: {
        text: region === 'schools' ? 
          getLang('MAP_TITLE_SCHOOLS') : 
          getLang('MAP_TITLE'),
        controls
      },
      description: 
        getLang('MAP_DESCRIPTION_' + metric + (isGapDemographic(demographic) ? '_GAP': '')) + ' ' +
        getLang('MAP_DESCRIPTION_SES' + (isGapDemographic(demographic) ? '_GAP': '')) + ' ' +
        getLang('MAP_DESCRIPTION'),
      headerMenu: {
        text: region === 'schools' ? 
          getLang('MAP_CONTROL_TEXT_SCHOOLS') :
          getLang('MAP_CONTROL_TEXT'),
        controls,
      },
      cards: getCards({ 
        hovered,
        features,
        selected: selected[region] || [],
        metrics: [ vars.xVar, vars.yVar ]
      }),
    },
    scatterplot: {
      ...vars,
      region,
      data,
      hovered,
      variant: 'map',
      colors: getChoroplethColors(),
      selected: selectedArray,
      highlightedState: getStateFipsFromAbbr(highlightedState),
      freeze: (active !== 'map')
    },
    map: {
      region,
      choroplethVar: vars.yVar,
      hovered: hoveredId,
      selected: selectedArray,
      colors: getSelectedColors(),
      viewport: getMapViewport(viewport, params),
      freeze: (active !== 'map'),
      attributionControl: true,
      idMap
    },
    legend: {
      colors: getChoroplethColors(),
      markerPosition: hovered && hovered.properties ?
        getValuePositionForMetric(
          getFeatureProperty(hovered, demographic + '_' + metric),
          demographic + '_' + metric,
          region
        ) : null,
      vertical: true
    }
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...getCardDispatchForSection(dispatch, 'map'),
  ...getScatterplotDispatchForSection(dispatch, 'map'),
  ...getMapDispatchForSection(dispatch, 'map', ownProps),
  onOptionChange: (id, option) => {
    switch(id) {
      case 'metric':
        return updateRoute(ownProps, { metric: option.id })
      case 'demographic':
        return updateRoute(ownProps, { demographic: option.id })
      case 'region':
        return updateRoute(ownProps, { region: option.id })
      case 'highlight':
        updateRoute(ownProps, { 
          highlightedState: option.id
        })
        if (option.id !== 'us') {
          dispatch(navigateToStateByAbbr(option.id))
        }
        return;
      default:
        return;
    }
  },
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SplitSection)
