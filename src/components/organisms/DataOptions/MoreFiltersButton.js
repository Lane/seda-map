import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';


const MoreFiltersButton = ({
  text,
  subtext,
  icon = <FilterListIcon />
}) => {
  return (
    <Button className="more-filters-button">
      {icon}
      <span className="select-button__text">{text}</span>
      <span className="select-button__subtext">{subtext}</span>
    </Button>
  )
}

MoreFiltersButton.propTypes = {
  text: PropTypes.string,
  subtext: PropTypes.string,
  icon: PropTypes.node,
}

export default MoreFiltersButton
