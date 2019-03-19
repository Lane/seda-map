import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as _isEqual from 'lodash.isequal';
import { getStops } from '../../modules/metrics';
import { onHoverFeature, onViewportChange, onCoordsChange } from '../../actions/mapActions';
import { loadLocation } from '../../actions/featuresActions';
import { Typography, Checkbox } from '@material-ui/core';
import { getSingularRegion } from '../../utils/index'
import { demographics } from '../../constants/dataOptions';
import SedaScatterplot from 'react-seda-scatterplot';
import * as scatterplotStyle from '../../constants/mapScatterplot';
import { onScatterplotData, onScatterplotError } from '../../actions/scatterplotActions';
import { getStateName } from '../../constants/statesFips';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export class MapScatterplot extends Component {
  static propTypes = {
    region: PropTypes.string,
    demographic: PropTypes.object,
    yVar: PropTypes.string,
    xVar: PropTypes.string,
    zVar: PropTypes.string,
    colors: PropTypes.array,
    yMetric: PropTypes.object,
    xMetric: PropTypes.object,
    yRange: PropTypes.object,
    hoveredId: PropTypes.string,
    selectedIds: PropTypes.array,
    selectedColors: PropTypes.array,
    stops: PropTypes.array,
    onHoverFeature: PropTypes.func,
    updateMapViewport: PropTypes.func,
    onSelectLocation: PropTypes.func,
    onMouseMove: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onError: PropTypes.func,
    showState: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      baseScatterplot: null,
      highlightState: false,
      restore: false,
    }
  }

  _toggleHighlight = (highlightState, restore = false) => {
    this.setState(
      { highlightState, restore }, 
      () => this.setState({ baseScatterplot: this._getOverrides() })
    )
  }

  /**
   * Gets the configuration overrides for the base scatterplot
   */
  _getOverrides() {
    const { xMetric, yMetric, colors, selectedIds } = this.props;
    const hl = Boolean(this.state.highlightState);
    const series = [
      {
        id: 'base',
        animation: false,
        silent: hl ? true : false,
        itemStyle: {
          'normal': {
            borderWidth: 1,
            borderColor: hl ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.34)',
            color: 'rgba(0,0,0,0.1)'
          },
          'emphasis': {
            borderWidth: 2,
            borderColor: 'rgba(255,0,0,1)'
          }
        },
      },
      {
        id: 'highlight',
        type: 'scatter',
        show: Boolean(this.state.highlightState),
        itemStyle: {
          'normal': {
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.34)',
            color: 'rgba(255,255,100,1)'
          },
          'emphasis': {
            borderWidth: 2,
            borderColor: 'rgba(255,0,0,1)'
          }
        }
      },
      scatterplotStyle.overlays(yMetric),
    ];
    const hlIndex = hl ?
      (selectedIds && selectedIds.length ? 2 : 2) : 0
    const overrides = {
      visualMap: scatterplotStyle.visualMap(yMetric, colors, hlIndex),
      grid: scatterplotStyle.grid,
      xAxis: scatterplotStyle.xAxis(xMetric),
      yAxis: scatterplotStyle.yAxis(yMetric),
      series
    };
    return overrides;
  }

  // TODO: Remove global instance
  _onReady = (e) => {
    this.echart = e;
    window.echartInstance = e
  }
  
  _onHover = (location) => {
    if (location && location.id) {
      const feature = {
        id: location.id,
        properties: location,
      }
      this.props.onHoverFeature(feature);
    } else {
      this.props.onHoverFeature(null);
    }
  }

  _onMouseMove = (e) => {
    const coords = {
      x: e.event.event.clientX, 
      y: e.event.event.clientY
    }
    this.props.onMouseMove(coords)
  }

  componentDidMount() {
    this.setState({
      baseScatterplot: this._getOverrides(),
    })
  }

  componentDidUpdate(prevProps) {
    // update scatterplot overrides when metric changes
    if (
      !_isEqual(prevProps.yMetric, this.props.yMetric)
    ) {
      this.setState({
        baseScatterplot: this._getOverrides()
      })
    }
    // turn off highlight if no state available
    if (prevProps.showState !== this.props.showState) {
      if (!this.props.showState) {
        this._toggleHighlight(false, this.state.highlightState)
      } else {
        this.state.restore && this._toggleHighlight(true)
      }
    }
  }

  render() {
    const { region, showState } = this.props;
    return (
      <div className='map-scatterplot'>
        <div className="map-scatterplot__container">
          { 
            this.state.baseScatterplot && 
            <SedaScatterplot
              endpoint={process.env.REACT_APP_VARS_ENDPOINT}
              xVar={this.props.xVar}
              yVar={this.props.yVar}
              zVar={this.props.zVar}
              prefix={this.props.region}
              options={this.state.baseScatterplot}
              hovered={this.props.hoveredId}
              highlighted={this.state.highlightState ? this.props.highlighted : []}
              selected={this.props.selectedIds}
              selectedColors={this.props.selectedColors}
              onReady={this._onReady}
              onHover={this._onHover}
              onClick={this.props.onSelectLocation}
              onMouseMove={this._onMouseMove}
              onDataLoaded={(e) => this.props.onDataLoaded(e, this.props.region)}
              onError={this.props.onError}
            /> 
          }
          <Typography variant="body2" classes={{root: "tmp__axis-overlay" }}>
            <span>← poorer</span>
            <span>richer →</span>
          </Typography>
          <Typography classes={{root: 'map-scatterplot__hint'}} variant="caption">
            Each circle represents {this.props.demographic.id === 'all' ? 'all' : this.props.demographic.label.toLowerCase()}
            {' '}students in one {getSingularRegion(this.props.region)}. Larger circles represent {this.props.region} with more students.
          </Typography>
          { showState &&
            <div className="checkbox-overlay">
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={this.state.highlightState} 
                    onChange={(e) => this._toggleHighlight(e.target.checked)}
                  />
                }
                label={
                  <span>Highlight {region} in <strong>{showState}</strong></span>
                }
                labelPlacement="start"
              />
            </div>
          }
        </div>
      </div>
    )
  }
}


const getStateIds = (ids, fips) => {
  if (ids && fips) {
    return ids
      .filter(d => d.substring(0,2) === fips)
  }
  return [];
}

const mapStateToProps = (
  { map, metrics, hovered: { feature }, selected, scatterplot: { data } }, 
  { match: { params: { region, metric, demographic } } }
) => {
  return ({
    region,
    demographic: demographics.find(d => d.id === demographic),
    yVar: region === 'schools' ? 'all_avg' : demographic + '_' + metric,
    xVar: region === 'schools' ? 'frl_pct' : demographic + '_ses',
    zVar: 'sz',
    stops: getStops(metrics, metric), 
    colors: metrics.colors,
    xMetric: region === 'schools' ? metrics.items['frl'] : metrics.items['ses'],
    yMetric: metrics.items[metric],
    selectedIds: selected[region],
    selectedColors: selected.colors,
    showState: map.usState ? getStateName(map.usState) : '',
    highlighted: data && data[region] && data[region]['name'] && map.usState ? 
      getStateIds(Object.keys(data[region]['name']), map.usState) : [],
    hoveredId: feature && 
      feature.properties && 
      feature.properties.id ?
        feature.properties.id : ''
  })
}

const mapDispatchToProps = (dispatch) => ({
  onDataLoaded: (data, region) => 
    dispatch(onScatterplotData(data, region)),
  onError: (err) => 
    dispatch(onScatterplotError(err)),
  onHoverFeature: (feature) =>
    dispatch(onHoverFeature(feature)),
  onMouseMove: (coords) =>
    dispatch(onCoordsChange(coords)),
  onSelectLocation: (location) => {
    dispatch(loadLocation(location))
    dispatch(onViewportChange({ 
      latitude: location.lat, 
      longitude: location.lon,
      zoom: location.id.length+2
    }, true))
  }
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapScatterplot)
