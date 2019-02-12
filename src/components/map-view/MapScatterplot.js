import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import * as isColor from 'is-color';
import { onColorChange } from '../../actions/mapActions';
import * as ColorScheme from 'color-scheme';

const scheme = new ColorScheme();

const colorStringToArray = (colors) => {
  return colors.replace(" ", "").split(",")
}

const colorArrayToString = (colors) => {
  return colors.join(', ');
}

export class MapScatterplot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colors: colorArrayToString(props.mapColors),
      hue: 0,
      distance: 0.5,
      variation: 'soft',
      complement: true
    }
  }

  generateColors = () => {
    scheme
      .from_hue(this.state.hue)
      .scheme('analogic')
      .add_complement(this.state.complement)
      .distance(this.state.distance)
      .variation(this.state.variation);
      
    const newColors = scheme.colors()
      .map(c => '#'+c);
    this.setState({ colors: colorArrayToString(newColors)})
    this.props.onColorChange(colorArrayToString(newColors));
  }

  colorInputChange = (e) => {
    this.setState({ colors: e.target.value });
    this.props.onColorChange(e.target.value);
  }

  render() { 
    return (
      <div className='map-scatterplot'>
        <div className="map-scatterplot__container">
          <TextField
            fullWidth
            multiline
            id={'colors'}
            label={'Colors'}
            value={this.state.colors}
            onChange={this.colorInputChange}
          ></TextField>
        </div>
      </div>
    )
  }
}

MapScatterplot.propTypes = {
  mapColors: PropTypes.array,
  onColorChange: PropTypes.func,
  generateColors: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
  onColorChange: (colors) => {
    const colorsArray = colorStringToArray(colors)
      .slice(-9);
    const validColors = colorsArray
      .reduce((acc, curr) => (acc ? isColor(curr) : false), true);
    if (colorsArray.length === 9 && validColors) {
      dispatch(onColorChange(colorsArray))
    }
  }
});

const mapStateToProps = (state) => ({
  mapColors: state.mapColors
})

export default connect(mapStateToProps, mapDispatchToProps)(MapScatterplot)
