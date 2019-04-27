import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRegionControl, getMetricControl, getDemographicControl, getHighlightControl } from '../../modules/controls';
import { getDemographicIdFromVarName, getMetricIdFromVarName, getChoroplethColors, getValuePositionForMetric, getSelectedColors, getGapVarNameForVars } from '../../modules/config';
import { getLang } from '../../constants/lang.js';
import { sectionMapDispatchToProps } from '../../actions/sectionActions';
import { getStateFipsFromAbbr } from '../../constants/statesFips';
import { getCards } from '../../modules/sections';
import { getFeatureProperty } from '../../modules/features';
import { getMapViewport } from '../../modules/map';
import SplitSection from '../base/SplitSection';

/**
 * Gets an array of controls for the section
 * @param {string} region 
 * @param {object} vars 
 * @param {string} highlightedState 
 */
const getSectionControls = (region, vars, highlightedState) => [
  getMetricControl(
    getMetricIdFromVarName(vars.xVar)
  ),
  getDemographicControl(
    getDemographicIdFromVarName(vars.xVar),
    'subgroupX',
    'Subgroup 1'
  ),
  getDemographicControl(
    getDemographicIdFromVarName(vars.yVar), 
    'subgroupY',
    'Subgroup 2'
  ),
  getRegionControl(region),
  getHighlightControl(highlightedState)
]

const mapStateToProps = (
  { 
    scatterplot: { data, loaded }, 
    selected,
    features,
    sections: { opportunity: { hovered, vars }, active  },
    map: { viewport, idMap } 
  },
  { match: { params: { region, metric, demographic, highlightedState, ...params } } }
) => {
  region = region === 'schools' ? 'districts' : region;
  return ({
    active: Boolean(loaded['map']),
    section: {
      id: 'opportunity',
      type: 'map',
      split: true,
      title: getLang('OPP_DIFF_TITLE'),
      description: getLang('OPP_DIFF_DESCRIPTION'),
      headerMenu: {
        text: getLang('OPP_DIFF_CONTROL_TEXT'),
        controls: getSectionControls(region, vars, highlightedState)
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
      hovered,
      region,
      data,
      highlightedState: getStateFipsFromAbbr(highlightedState),
      variant: 'opp',
      selected: selected[region],
      freeze: active !== 'opportunity'
    },
    map: {
      idMap,
      region,
      choroplethVar: getGapVarNameForVars(vars.xVar, vars.yVar),
      hovered: getFeatureProperty(hovered, 'id'),
      selected: selected[region],
      colors: getSelectedColors(),
      viewport: getMapViewport(viewport, params),
      freeze: (active !== 'opportunity'),
      attributionControl: true
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


const mapDispatchToProps = 
  sectionMapDispatchToProps('opportunity')

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SplitSection)

