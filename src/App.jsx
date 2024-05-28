import React, { useState, useEffect } from 'react';
import './App.css';

// 게임 보드의 크기 설정
const size = 4;

// 무작위 위치를 반환하는 함수
const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size)
  };
};

const App = () => {
  // 상태 변수 정의: 에이전트의 위치, 방향, 움퍼스의 위치, 악취 위치, 게임 오버 상태, 움퍼스 표시 여부
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });
  const [agentDirection, setAgentDirection] = useState('right');
  const [wumpusPosition, setWumpusPosition] = useState(getRandomPosition());
  const [stenchPositions, setStenchPositions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showWumpus, setShowWumpus] = useState(false);

  // useEffect 훅을 사용하여 움퍼스 주변에 악취 위치 설정
  useEffect(() => {
    const adjacentPositions = [
      { x: wumpusPosition.x - 1, y: wumpusPosition.y },
      { x: wumpusPosition.x + 1, y: wumpusPosition.y },
      { x: wumpusPosition.x, y: wumpusPosition.y - 1 },
      { x: wumpusPosition.x, y: wumpusPosition.y + 1 }
    ].filter(
      pos => pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size
    );

    setStenchPositions(adjacentPositions);
  }, [wumpusPosition]);

  // 에이전트가 움퍼스 근처에 있는지 확인하는 함수
  const isAgentAdjacentToWumpus = () => {
    return stenchPositions.some(pos => pos.x === agentPosition.x && pos.y === agentPosition.y);
  };

  // 에이전트의 위치를 업데이트하는 함수
  const updateAgentPosition = (x, y) => {
    setAgentPosition({ x, y });
    if (x === wumpusPosition.x && y === wumpusPosition.y) {
      setGameOver(true);
      setShowWumpus(true);
    }
  };

  // 에이전트를 현재 방향으로 한 칸 전진시키는 함수
  const goForward = () => {
    if (gameOver) return; // 게임 오버 상태에서는 동작하지 않음
    let { x, y } = agentPosition;
    if (agentDirection === 'right' && y < size - 1) y++;
    else if (agentDirection === 'left' && y > 0) y--;
    else if (agentDirection === 'up' && x > 0) x--;
    else if (agentDirection === 'down' && x < size - 1) x++;
    updateAgentPosition(x, y);
  };

  // 에이전트를 왼쪽으로 회전시키는 함수
  const turnLeft = () => {
    if (gameOver) return; // 게임 오버 상태에서는 동작하지 않음
    if (agentDirection === 'right') setAgentDirection('up');
    else if (agentDirection === 'up') setAgentDirection('left');
    else if (agentDirection === 'left') setAgentDirection('down');
    else if (agentDirection === 'down') setAgentDirection('right');
  };

  // 에이전트를 오른쪽으로 회전시키는 함수
  const turnRight = () => {
    if (gameOver) return; // 게임 오버 상태에서는 동작하지 않음
    if (agentDirection === 'right') setAgentDirection('down');
    else if (agentDirection === 'down') setAgentDirection('left');
    else if (agentDirection === 'left') setAgentDirection('up');
    else if (agentDirection === 'up') setAgentDirection('right');
  };

  // 게임을 재시작하는 함수
  const resetGame = () => {
    setAgentPosition({ x: 0, y: 0 });
    setAgentDirection('right');
    setWumpusPosition(getRandomPosition());
    setGameOver(false);
    setShowWumpus(false);
  };

  // 새로운 게임을 시작하는 함수
  const startNewGame = () => {
    setAgentPosition({ x: 0, y: 0 });
    setAgentDirection('right');
    setWumpusPosition(getRandomPosition());
    setGameOver(false);
    setShowWumpus(false);
  };

  // 특정 위치의 셀을 렌더링하는 함수
  const renderCell = (x, y) => {
    const isAgent = agentPosition.x === x && agentPosition.y === y;
    const isStench = isAgent && isAgentAdjacentToWumpus();

    return (
      <div className={`cell ${isAgent ? 'agent-cell' : ''} ${isStench ? 'stench-cell' : ''}`} key={`${x}-${y}`}>
        {isAgent && <div className={`agent ${agentDirection}`}></div>}
        {isStench && <div className="stench"></div>}
      </div>
    );
  };

  return (
    <div className="App">
      {/* 게임 보드 렌더링 */}
      <div id="gameBoard">
        {Array.from({ length: size }).map((_, x) =>
          Array.from({ length: size }).map((_, y) => renderCell(x, y))
        )}
      </div>
      {/* 제어 버튼들 */}
      <div className="controls">
        <button onClick={goForward}>Go Forward</button>
        <button onClick={turnLeft}>Turn Left</button>
        <button onClick={turnRight}>Turn Right</button>
      </div>
      {/* 게임 오버 메시지 및 재시작 버튼 */}
      {gameOver && (
        <div className="gameOver">
          <h2>Game Over</h2>
          <button onClick={resetGame}>다시하기</button>
          <button onClick={startNewGame}>처음부터</button>
          {showWumpus && <div className="wumpusScreen"></div>}
        </div>
      )}
    </div>
  );
};

export default App;
