import React from 'react';
import './GameBoard.css'
const GameBoard = ({ size, agentPosition, goldPosition, hasGold, stenchPositions, breezePositions, agentDirection }) => {
  const isAgentAdjacentToWumpus = (agentPosition, stenchPositions) => {
    return stenchPositions.some(pos => pos.x === agentPosition.x && pos.y === agentPosition.y);
  };

  const isAgentAdjacentToPit = (agentPosition, breezePositions) => {
    return breezePositions.some(pos => pos.x === agentPosition.x && pos.y === agentPosition.y);
  };

  const renderCell = (x, y) => {
    const isAgent = agentPosition.x === x && agentPosition.y === y;
    const isGold = goldPosition.x === x && goldPosition.y === y && !hasGold;
    const isStench = isAgent && isAgentAdjacentToWumpus(agentPosition, stenchPositions);
    const isBreeze = isAgent && isAgentAdjacentToPit(agentPosition, breezePositions);

    return (
      <div
        className={`cell ${isAgent ? 'agent-cell' : ''} ${isStench ? 'stench-cell' : ''} ${isBreeze ? 'breeze-cell' : ''}`}
        key={`${x}-${y}`}
      >
        {isAgent && <div className={`agent ${agentDirection} ${isStench ? 'agent-stench' : ''} ${isBreeze ? 'agent-breeze' : ''}`}></div>}
        {isGold && <div className="gold"></div>}
      </div>
    );
  };

  return (
    <div id="gameBoard">
      {Array.from({ length: size }).map((_, x) =>
        Array.from({ length: size }).map((_, y) => renderCell(x, y))
      )}
    </div>
  );
};

export default GameBoard;
