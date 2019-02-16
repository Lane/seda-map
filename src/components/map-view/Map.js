import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer, getChoroplethExtrude, getChoroplethOutline, getDotLayer, getBackgroundChoroplethLayer } from '../../style/map-style';
import { onHoverFeature, onViewportChange, onSelectFeature } from '../../actions/mapActions';
import { getChoroplethProperty } from '../../modules/map';
import mapboxgl from 'mapbox-gl';
import { getMetric } from '../../constants/dataOptions';

class Map extends Component {

  state = {
    mapStyle: defaultMapStyle,
    tooltip: {
      x:0,
      y:0,
    },
    hoveredId: null
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
      prevProps.demographic !== this.props.demographic
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
    const region = this.props.region;
    let updatedLayers;
    if (region !== 'schools') {
      const choroplethLayer = getChoroplethLayer(region, this.props.dataProp);
      const choroplethExtrude = getChoroplethExtrude(region, this.props.dataProp);

      const choroplethOutline = getChoroplethOutline(region);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(4, (init ? 0 : 3), choroplethLayer, choroplethExtrude, choroplethOutline)
    } else {
      const choroplethLayer = getBackgroundChoroplethLayer('districts', this.props.dataProp);
      const dotLayer = getDotLayer(region, this.props.dataProp);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(4, (init ? 0 : 3), choroplethLayer)
        .splice(100, (init ? 0 : 1), dotLayer)
    }

    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  _onLoad = event => {
    this.map = event.target;
    this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');
    // this.map.on('moveend', () => {
    //   var features = this.map.queryRenderedFeatures({layers:['dots']});
    //   if (features) {
    //     var uniqueFeatures = this._getUniqueFeatures(features, "id");
    //     console.log(uniqueFeatures);
    //   }
    // });
  }

  _getUniqueFeatures(array, comparatorProperty) {
    const existingFeatureKeys = {};
    return array.filter(function(el) {
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
    const featureId = hoveredFeature ? hoveredFeature.id : null;
    if (featureId) {
      if (this.state.hoveredId) {
        this.map.setFeatureState({source: 'composite', sourceLayer: region, id: this.state.hoveredId}, { hover: false});
      }
      this.setState({ hoveredId: featureId })
      this.map.setFeatureState({source: 'composite', sourceLayer: region, id: featureId}, { hover: true});
    } else {
      if (this.state.hoveredId) {
        this.map.setFeatureState({source: 'composite', sourceLayer: region, id: this.state.hoveredId}, { hover: false});
      }
      this.setState({ hoveredId: null })
    }
  };

  _renderTooltip() {
    const { tooltip } = this.state;
    const { hoveredFeature, dataProp, metric } = this.props;
    const label = getMetric(metric).short_label;
    return hoveredFeature && (
      <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
        <div className="tooltip__title">{hoveredFeature.properties.name}</div>
        <div className="tooltip__content">
          { label }{': '}
          {
            hoveredFeature.properties[dataProp] &&
            hoveredFeature.properties[dataProp] > -999 ?
              Math.round(hoveredFeature.properties[dataProp]*100)/100 :
              'Unavailable'
          }
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
  dataProp: getChoroplethProperty(state.map),
  hoveredFeature: state.map.hoveredFeature
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature) => dispatch(onHoverFeature(feature)),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature) => dispatch(onSelectFeature(feature)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
