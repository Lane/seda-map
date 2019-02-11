import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer, getDotLayer, getBackgroundChoroplethLayer } from '../../style/map-style';
import { onHoverFeature, onViewportChange, onSelectFeature } from '../../actions/mapActions';
import { getChoroplethProperty } from '../../modules/map';
import mapboxgl from 'mapbox-gl';
import * as _isEqual from 'lodash.isequal';

class Map extends Component {

  state = {
    mapStyle: defaultMapStyle,
    tooltip: {
      x:0,
      y:0,
    }
  };

  getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  handleResize() {
    this.updateDimensions();
  }

  updateDimensions(dimensions = this.getContainerSize()) {
    this.props.onViewportChange(dimensions);
  }

  componentDidMount() {
    window.addEventListener(
      'resize', this.handleResize.bind(this)
    );
    this.updateDimensions();
    this._updateChoropleth(true);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.metric !== this.props.metric ||
      prevProps.region !== this.props.region ||
      prevProps.demographic !== this.props.demographic ||
      !_isEqual(prevProps.mapColors, this.props.mapColors)
    ) {
      this._updateChoropleth();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize', this.handleResize.bind(this)
    );
  }

  _updateChoropleth(init = false) {
    const { region, mapColors, dataProp } = this.props;
    let updatedLayers;
    if (region !== 'schools') {
      const choroplethLayer = getChoroplethLayer(region, dataProp, mapColors);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(2, (init ? 0 : 1), choroplethLayer)
    } else {
      const choroplethLayer = getBackgroundChoroplethLayer('districts', dataProp, mapColors);
      const dotLayer = getDotLayer(region, dataProp, mapColors);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(2, (init ? 0 : 1), choroplethLayer)
        .splice(100, (init ? 0 : 1), dotLayer)
    }

    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  _onLoad = event => {
    this.map = event.target;
    this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');
  }

  _onClick = event => {
    const { features } = event;
    const selectedFeature = features && 
      features.find(f => f.layer.id === 'choropleth');
    return selectedFeature &&
      this.props.onSelectFeature(selectedFeature)
  }

  _onHover = event => {
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const { region } = this.props;
    const hoveredFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    this.props.onHoverFeature(hoveredFeature);
    this.setState({ 
      tooltip: { x: offsetX, y: offsetY }
    });
  };

  _renderTooltip() {
    const { tooltip } = this.state;
    const { hoveredFeature, dataProp } = this.props;

    return hoveredFeature && (
      <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
        <div>GEOID: {hoveredFeature.properties.GEOID}</div>
        <div>VALUE: {' '}
          {hoveredFeature.properties[ dataProp ]}
        </div>
      </div>
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { viewport, onViewportChange } = this.props;
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
      >
        <div 
          className="map__container"
        >
          <ReactMapGL
            { ...viewport }
            mapStyle={mapStyle}
            onViewportChange={ (vp) => onViewportChange(vp) }
            onHover={this._onHover}
            onClick={this._onClick}
            onLoad={this._onLoad}
            attributionControl={false}
          >
            {this._renderTooltip()}
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
  viewport: PropTypes.object,
  onViewportChange: PropTypes.func,
  onHoverFeature: PropTypes.func,
  onSelectFeature: PropTypes.func,
}

const mapStateToProps = (state) => ({
  ...state.map,
  mapColors: state.mapColors,
  dataProp: getChoroplethProperty(state.map)
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature) => dispatch(onHoverFeature(feature)),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature) => dispatch(onSelectFeature(feature)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
