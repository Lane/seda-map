import React, { Component } from 'react'
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer, getChoroplethOutline, getDotLayer, getBackgroundChoroplethLayer } from '../../style/map-style';
import { updateCurrentState, onHoverFeature, onViewportChange, onSelectFeature, onCoordsChange } from '../../actions/mapActions';
import { onLoadRenderedFeatures } from '../../actions/featuresActions';
import { getChoroplethProperty } from '../../modules/map';
// import mapboxgl from 'mapbox-gl';
import { getStops } from '../../modules/metrics';
import { isPropEqual, getRegionFromId, intToRegionId } from '../../utils';
import { updateViewportRoute, getViewportFromRoute } from '../../modules/router';
import * as _isEqual from 'lodash.isequal';
import * as _debounce from 'lodash.debounce';


class Map extends Component {

  state = {
    mapStyle: defaultMapStyle
  };

  /**
   * Gets the width and height of the map container
   */
  _getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  _handleResize() {
    this._updateViewport();
  }

  /**
   * Updates the current US state at the center of the map
   */
  _updateCurrentState = _debounce((vp) => {
    if (this.map && vp.width && vp.height && vp.zoom && vp.zoom > 6) {
      const features = this.map.queryRenderedFeatures(
        [vp.width/2, vp.height/2],
        {layers: ['states-fills']}
      )
      if (features.length) {
        return this.props.updateCurrentState(
          intToRegionId(features[0].id, 'states')
        )
      }
    }
    return this.props.updateCurrentState(null)
  }, 400)

  /**
   * Updates the current US state at the center of the map
   */
  _getRenderedFeatures = _debounce((vp) => {
    if (this.map && vp.zoom > 10) {
      const features = this._getUniqueFeatures(
        this.map.queryRenderedFeatures(
          {layers: [ this.props.region === 'schools' ? 'dots' : 'choropleth' ]}
        ),
        'id'
      )
      this.props.onLoadFeatures(features)
    }
  }, 1000)

  /**
   * Update viewport route and update currently viewed US state
   * @param {object} vp viewport object 
   */
  _updateViewport(vp = this._getContainerSize()) {
    this.props.onViewportChange(vp);
    updateViewportRoute(this.props, vp);
    this._updateCurrentState(vp);
    this._getRenderedFeatures(vp);
  }

  /**
   * Sets the feature state for rendering styles
   * @param {string} region 
   * @param {string} featureId 
   * @param {object} state 
   */
  _setFeatureState(region, featureId, state) {
    this.map && this.map.setFeatureState({
      source: 'composite', 
      sourceLayer: region, 
      id: featureId
    }, state);
  }

  /**
   * Updates the selected color on the state of the map features.
   * Removes colors from oldSelected and assigns colors to selectedIds.
   * @param {Array<string>} oldSelected 
   * @param {Array<string>} selectedIds 
   */
  _updateOutlineSelected(oldSelected = [], selectedIds = []) {
    oldSelected.forEach(id => {
      const region = getRegionFromId(id);
      this._setFeatureState(
        region, id, { selected: false}
      );
    })
    selectedIds.forEach((id,i) => {
      const region = getRegionFromId(id);
      this._setFeatureState(
        region, id, { selected: this.props.colors[i % this.props.colors.length] }
      );
    })
  }

  /**
   * Updates the outline of a feature on hover
   * @param {*} oldFeature feature to remove highlight from
   * @param {*} newFeature feature to add highlight to
   * @param {*} region source layer
   */
  _updateOutlineHighlight(oldFeature, newFeature, region) {
    const featureId = newFeature ? newFeature.id : null;
    if (oldFeature && oldFeature.id) {
      this._setFeatureState(
        region, oldFeature.id, { hover: false}
      );
    }
    if (featureId) {
      this._setFeatureState(
        region, featureId, { hover: true}
      );
    }
  }

  /**
   * Updates the map choropleths based on props
   * @param {boolean} init inserts the layers instead of replacing when true
   */
  _updateChoropleth(init = false) {
    const { region, dataProp, stops } = this.props;
    let updatedLayers;
    if (region !== 'schools') {
      const choroplethLayer = 
        getChoroplethLayer(region, dataProp, stops);
      const choroplethOutline = 
        getChoroplethOutline(region);
      updatedLayers = 
        defaultMapStyle
          .get('layers')
          .splice(4, (init ? 0 : 1), choroplethLayer)
          .splice(59, (init ? 0 : 1), choroplethOutline)
    } else {
      const choroplethLayer = getBackgroundChoroplethLayer('districts', dataProp, stops);
      const dotLayer = getDotLayer(region, dataProp, stops);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(4, (init ? 0 : 1), choroplethLayer)
        .splice(59, (init ? 0 : 1), dotLayer)
    }

    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  /**
   * Outline selected locations and set US state from viewport on load
   */
  _onLoad = event => {
    this.map = event.target;
    // this.map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
    this._updateOutlineSelected([], this.props.selectedIds)
    this._updateCurrentState(this.props.viewport);
  }

  /**
   * Takes an array of features and removes dupliates based on property
   * @param {array<Feature>} array 
   * @param {string} comparatorProperty 
   */
  _getUniqueFeatures(array, comparatorProperty) {
    const existingFeatureKeys = {};
    return array.filter((el) => {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });
  }

  _onClick = event => {
    const { features } = event;
    const { region } = this.props;
    // find features for current region that was clicked
    const selectedFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    // dispatch selected feature event if selected
    return selectedFeature &&
      this.props.onSelectFeature(selectedFeature, region)
  }

  _onHover = event => {
    const { features, srcEvent: { clientX, clientY } } = event;
    const { region } = this.props;
    // find features on the active region
    const hoveredFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    // set the mouse coords
    const coords = { x: clientX, y: clientY };
    // trigger hover feature actions, padding the featue and
    // mouse coordinates
    this.props.onHoverFeature(hoveredFeature, coords);
  };

  _onHoverOut = () => {
    this.props.onHoverFeature(undefined, null);
  }

  componentDidMount() {
    // set the viewport from the route on initial load
    const initialViewport = {
      ...this.props.viewport,
      ...getViewportFromRoute(this.props.match)
    }
    this.props.onViewportChange(initialViewport);
    // listen to window resize events to resize the map accordingly
    window.addEventListener(
      'resize', this._handleResize.bind(this)
    );
    // call update viewport to update the width / height to fill the container
    this._updateViewport();
    // initialize the choropleth layer
    this._updateChoropleth(true);

  }


  componentDidUpdate(prevProps) {
    const { metric, region, demographic, hoveredFeature, selectedIds } = this.props;
    const oldFeature = prevProps.hoveredFeature;
    // update the choropleth if any of the map data has changed
    if (
      prevProps.metric !== metric ||
      prevProps.region !== region ||
      prevProps.demographic !== demographic
    ) {
      this._updateChoropleth();
    }
    // update the highlight if the hovered feature has changed
    if (
      !isPropEqual(oldFeature, hoveredFeature, 'id')
    ) {
      this._updateOutlineHighlight(
        oldFeature, 
        hoveredFeature, 
        region
      )
    }
    // update selected outlines
    const oldSelected = prevProps.selectedIds;
    if (!_isEqual(oldSelected, selectedIds)) {
      this._updateOutlineSelected(
        oldSelected, 
        selectedIds
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize', this._handleResize.bind(this)
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { viewport } = this.props;
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
        onMouseLeave={this._onHoverOut}
      >
        <div className="map__container">
          <ReactMapGL
            { ...viewport }
            mapStyle={mapStyle}
            onViewportChange={ (vp) => this._updateViewport(vp) }
            onHover={this._onHover}
            onClick={this._onClick}
            onLoad={this._onLoad}
            attributionControl={false}
          >
            <div className="map__zoom">
              <NavigationControl onViewportChange={ (vp) => this._updateViewport(vp)} />
            </div>
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  colors: PropTypes.array,
  viewport: PropTypes.object,
  hoveredFeature: PropTypes.object,
  stops: PropTypes.array,
  selectedIds: PropTypes.array,
  dataProp: PropTypes.string,
  onViewportChange: PropTypes.func,
  onHoverFeature: PropTypes.func,
  onSelectFeature: PropTypes.func,
  updateCurrentState: PropTypes.func,
}

const mapStateToProps = ({ 
  map: { viewport },
  hovered: { feature },
  metrics,
  selected
}, 
{
  match: { params: { metric, demographic, region } }
}) => ({
  metric,
  region,
  viewport,
  demographic,
  dataProp: getChoroplethProperty({metric, demographic}),
  stops: getStops(metrics, metric),
  hoveredFeature: feature,
  metricItem: metrics.items && metrics.items[metric] ?
    metrics.items[metric] : {},
  colors: selected.colors,
  selectedIds: selected[region]
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature, coords) => (
    dispatch(onHoverFeature(feature)) &&
    dispatch(onCoordsChange(coords))
  ),
  onLoadFeatures: (features) => dispatch(onLoadRenderedFeatures(features)),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature, region) => dispatch(onSelectFeature(feature, region)),
  updateCurrentState: (stateId) => dispatch(updateCurrentState(stateId))
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Map);
