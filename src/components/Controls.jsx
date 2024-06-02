import React from 'react';
import './Controls.css'
const Controls = ({ goForward, turnLeft, turnRight }) => {
  return (
    <div className="controls">
      <button onClick={goForward}>Go Forward</button>
      <button onClick={turnLeft}>Turn Left</button>
      <button onClick={turnRight}>Turn Right</button>
    </div>
  );
};

export default Controls;
