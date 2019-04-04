import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Map from '../map/Map';
import MapScatterplot from '../map/MapScatterplot';
import MapSearch from '../map/MapSearch';
import { loadRouteLocations } from '../../actions/featuresActions';
import { getRegionControl, getMetricControl, getDemographicControl } from '../../modules/config';
import MapLocationCards from '../map/MapLocationCards';
import MenuSentence from '../base/MenuSentence';
import MapTooltip from '../map/MapTooltip';
import { updateRoute } from '../../modules/router';
import { updateCurrentState, toggleHighlightState } from '../../actions/mapActions';


const MapSection = ({
  id,
  name,
  controls = [],
  hasLocationsSelected,
  xVar,
  yVar,
  region,
  onOptionChange
}) => {
  return (
    <div id={id} name={name} className="section section--map">
      <MapTooltip />
      <div className="section__header">
        <MenuSentence
          className="section__heading"
          text="Map of $1 for $2 by $3"
          controls={controls}
          variant="h5"
          onChange={onOptionChange}
        />
        <Typography className="section__description">
          { xVar.split('_')[1] === 'avg' ?
            <span>
              The average test scores of children in a community reveal the total 
              set of educational opportunities they have had from birth to the time 
              they take the tests. The map and scatterplot below shows how educational
              opportunity is correlated with socioeconomic status.  How does your 
              area compare?
            </span> :
            <span>Description for metric unavailable.</span>
          }
          

        </Typography>
      </div>
      
      <div 
        className={
          "section__places" + 
          (hasLocationsSelected ?
            '' : ' section__places--none')
        }
      >
      { hasLocationsSelected ?
        <MapLocationCards 
          metrics={[yVar, xVar]}
        />
        :
        <Typography variant="body2">
          No {region} selected. Use search or the map to select a location.
        </Typography>
      }
      </div>
      
    
      <div className="section__component">

        <div className="section__controls">
          <MenuSentence
            text="Showing $1 for $2 by $3"
            controls={controls}
            onChange={onOptionChange}
          />
          <MapSearch />
        </div>
        
        <div className="section__right">
          <Map />
        </div>
        <div className="section__left section__left--scatterplot">
          <MapScatterplot />
        </div>
      </div>
    </div>
  )
}

MapSection.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  controls: PropTypes.array,
  hasLocationsSelected: PropTypes.bool,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  region: PropTypes.string,
  onOptionChange: PropTypes.func
}

const mapStateToProps = ({ 
  scatterplot: { loaded },
  selected,
  map: { usState, highlightState },
},
{ match: { params: { region, metric, demographic } } }
) => ({
  region,
  xVar: demographic + '_' + metric,
  yVar: demographic + '_ses',
  hasLocationsSelected: 
    selected && selected[region] && 
    selected[region].length > 0, 
  mapScatterplotLoaded: loaded && loaded['map'],
  controls: [
    getMetricControl(metric),
    getDemographicControl(demographic),
    getRegionControl(region)

  ],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRouteLocations: (locations) => 
    dispatch(loadRouteLocations(locations)),
  onOptionChange: (id, option) => {
    switch(id) {
      case 'metric':
        return updateRoute(ownProps, { metric: option.id })
      case 'demographic':
        return updateRoute(ownProps, { demographic: option.id })
      case 'region':
        return updateRoute(ownProps, { region: option.id })
      case 'highlight':
        if (option.value === 'none') {
          dispatch(toggleHighlightState(false))
          dispatch(updateCurrentState(null))
        } else {
          dispatch(toggleHighlightState(true))
          dispatch(updateCurrentState(option.id))
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
)(MapSection)