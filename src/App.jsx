import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import GameOver from './components/GameOver';
import './App.css';

const size = 4;

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size)
  };
};

const getUniqueRandomPosition = (existingPositions) => {
  let newPosition;
  do {
    newPosition = getRandomPosition();
  } while (existingPositions.some(pos => pos.x === newPosition.x && pos.y === newPosition.y));
  return newPosition;
};

const App = () => {
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });
  const [agentDirection, setAgentDirection] = useState('right');
  const [wumpusPosition, setWumpusPosition] = useState(getUniqueRandomPosition([{ x: 0, y: 0 }]));
  const [pitPosition, setPitPosition] = useState(getUniqueRandomPosition([{ x: 0, y: 0 }, wumpusPosition]));
  const [goldPosition, setGoldPosition] = useState(getUniqueRandomPosition([{ x: 0, y: 0 }, wumpusPosition, pitPosition]));
  const [stenchPositions, setStenchPositions] = useState([]);
  const [breezePositions, setBreezePositions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showWumpus, setShowWumpus] = useState(false);
  const [showpit, setShowpit] = useState(false);
  const [hasGold, setHasGold] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  useEffect(() => {
    const getAdjacentPositions = (position) => {
      return [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 }
      ].filter(pos => pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size);
    };
    setStenchPositions(getAdjacentPositions(wumpusPosition));
    setBreezePositions(getAdjacentPositions(pitPosition));
  }, [wumpusPosition, pitPosition]);

  const updateAgentPosition = (x, y) => {
    setAgentPosition({ x, y });

    if (x === wumpusPosition.x && y === wumpusPosition.y) {
      setGameOver(true);
      setShowWumpus(true);
      setShowpit(false);
    } else if (x === pitPosition.x && y === pitPosition.y) {
      setGameOver(true);
      setShowpit(true);
      setShowWumpus(false);
    } else if (x === goldPosition.x && y === goldPosition.y && !hasGold) {
      setHasGold(true);
    } else if (x === 0 && y === 0 && hasGold) {
      setGameSuccess(true);
    }
  };

  const goForward = () => {
    if (gameOver || gameSuccess) return;
    let { x, y } = agentPosition;
    if (agentDirection === 'right' && y < size - 1) y++;
    else if (agentDirection === 'left' && y > 0) y--;
    else if (agentDirection === 'up' && x > 0) x--;
    else if (agentDirection === 'down' && x < size - 1) x++;
    updateAgentPosition(x, y);
  };

  const turnLeft = () => {
    if (gameOver || gameSuccess) return;
    if (agentDirection === 'right') setAgentDirection('up');
    else if (agentDirection === 'up') setAgentDirection('left');
    else if (agentDirection === 'left') setAgentDirection('down');
    else if (agentDirection === 'down') setAgentDirection('right');
  };

  const turnRight = () => {
    if (gameOver || gameSuccess) return;
    if (agentDirection === 'right') setAgentDirection('down');
    else if (agentDirection === 'down') setAgentDirection('left');
    else if (agentDirection === 'left') setAgentDirection('up');
    else if (agentDirection === 'up') setAgentDirection('right');
  };

  const startNewGame = () => {
    setAgentPosition({ x: 0, y: 0 });
    setAgentDirection('right');
    setWumpusPosition(getUniqueRandomPosition([{ x: 0, y: 0 }]));
    setPitPosition(getUniqueRandomPosition([{ x: 0, y: 0 }, wumpusPosition]));
    setGoldPosition(getUniqueRandomPosition([{ x: 0, y: 0 }, wumpusPosition, pitPosition]));
    setGameOver(false);
    setShowWumpus(false);
    setShowpit(false);
    setHasGold(false);
    setGameSuccess(false);
  };

  return (
    <div className="App">
      <GameBoard
        size={size}
        agentPosition={agentPosition}
        goldPosition={goldPosition}
        hasGold={hasGold}
        stenchPositions={stenchPositions}
        breezePositions={breezePositions}
        agentDirection={agentDirection}
      />
      <Controls goForward={goForward} turnLeft={turnLeft} turnRight={turnRight} />
      <GameOver
        gameOver={gameOver}
        showWumpus={showWumpus}
        showpit={showpit}
        gameSuccess={gameSuccess}
        resetGame={startNewGame}
        startNewGame={startNewGame}
      />
    </div>
  );
};

export default App;
