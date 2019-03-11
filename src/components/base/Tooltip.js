import React from 'react';

const Tooltip = ({visible, title, content, x, y, offset = {x: 0, y:0}}) =>
  visible && 
  (
    <div className="tooltip" style={{ left: x + offset.x, top: y + offset.y }}>
      <div className="tooltip__title">{title}</div>
      <div className="tooltip__content">
        {content}
      </div>
    </div>
  )

export default Tooltip;