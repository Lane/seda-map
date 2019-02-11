import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import * as isColor from 'is-color';
import { onColorChange } from '../../actions/mapActions';

const MapScatterplot = ({ mapColors, onColorChange }) =>(
  <div className='map-scatterplot'>
    <div className="map-scatterplot__container">
      { mapColors.map((v,i) => (
        <div style={{marginBottom: 8}} key={ 'color' + i}>
          <TextField
            id={'c-' + i}
            label={'Color ' + i}
            defaultValue={v}
            onChange={(e) => onColorChange(i, e.target.value)}
          ></TextField>
        </div>
      ))}
    </div>
  </div>
)

MapScatterplot.propTypes = {
  mapColors: PropTypes.array,
  onColorChange: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
  onColorChange: (i, color) => {
    if (isColor(color)) {
      dispatch(onColorChange(i, color))
    }
  }
});

const mapStateToProps = (state) => ({
  mapColors: state.mapColors
})

export default connect(mapStateToProps, mapDispatchToProps)(MapScatterplot)
