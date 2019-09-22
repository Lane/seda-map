import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';


const Tooltip = ({
  title,
  subtitle, 
  children, 
  x, 
  y, 
  above,
  left,
  visible,
  offset = {x: 0, y:0}
}) => {
  console.log('render tt')
  const xPos = left ?
    `calc(-115% + ${x + offset.x}px)` :
    `calc(15% + ${x + offset.x}px)`;
  const yPos = above ?
    `calc(-133% + ${y + offset.y}px)` :
    `calc(33% + ${y + offset.y}px)`
  return (
    <div 
      className="tooltip" 
      style={{ 
        transform: `translate(${xPos}, ${yPos})`,
        visibility: visible ? 'visible' : 'hidden'
      }}
    >
      <div className="tooltip__header">
        { title && 
          <Typography variant="h6" className="tooltip__title">{title}</Typography>
        }
        { subtitle && 
          <Typography variant="body1" className="tooltip__subtitle">{subtitle}</Typography>
        }
      </div>
      <div className="tooltip__content">
        {children}
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  x: PropTypes.number,
  y: PropTypes.number,
  above: PropTypes.oneOfType(
    [PropTypes.number, PropTypes.bool]
  ),
  left: PropTypes.oneOfType(
    [PropTypes.number, PropTypes.bool]
  ),
  offset: PropTypes.object,
}


export default Tooltip;