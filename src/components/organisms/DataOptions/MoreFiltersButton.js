import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';


const MoreFiltersButton = ({
  text,
  subtext,
  icon = <UnfoldMoreIcon />
}) => {
  return (
    <Button className="more-filters-button">
      <span className="select-button__text">{text}</span>
      <span className="select-button__subtext">{subtext}</span>
      {icon}
    </Button>
  )
}

MoreFiltersButton.propTypes = {
  text: PropTypes.string,
  subtext: PropTypes.string,
  icon: PropTypes.node,
}

export default MoreFiltersButton
