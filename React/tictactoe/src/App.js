import React, { useState } from "react";

function Square({ value, onSquareClick, winning }) {
  return (
    <button
      className={winning ? "squarewin" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  let board = [];

  function handleClick(i) {
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const [winner, winLine] = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    let notDraw;
    for (var i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        notDraw = true;
        break;
      }
    }
    if (notDraw) {
      status = "Next player: " + (xIsNext ? "X" : "O");
    } else {
      status = "Match Drawn";
    }
  }

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      <div>
        {[0, 1, 2].map((row) => {
          return (
            <div key={row} className="board-row">
              {[0, 1, 2].map((col) => {
                let i = 3 * row + col;
                return (
                  <Square
                    key={i}
                    winning={winLine.includes(i) ? true : false}
                    value={squares[i]}
                    onSquareClick={() => handleClick(i)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesAscending, setMovesAscending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // console.log("history: ", nextHistory);
    // console.log("nextSquares: ", nextSquares);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  var moves = history.map((squares, move) => {
    let description;
    let changed;
    if (move > 0) {
      for (var i = 0; i < 9; i++) {
        if (squares[i] != history[move - 1][i]) {
          if (i < 3) {
            changed = [0, i];
          } else if (i >= 3 && i < 6) {
            changed = [1, i - 3];
          } else {
            changed = [2, i - 6];
          }
        }
      }
      description = "Go to move #" + move + " (" + changed + ")";
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move == currentMove ? (
          <div>{description}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  function toggleOrder() {
    setMovesAscending(!movesAscending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleOrder()}>Toggle Order</button>
        <ol>{movesAscending ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}
