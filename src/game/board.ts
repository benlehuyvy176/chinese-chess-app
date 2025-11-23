import { Piece, PlayerColor, PieceType, Position, GameState } from '../types';

// Chinese chess board dimensions
export const BOARD_ROWS = 10;
export const BOARD_COLS = 9;

/**
 * Creates the initial board setup for Chinese Chess (Xiangqi)
 */
export function createInitialBoard(): Piece[] {
  const pieces: Piece[] = [];
  
  // Red pieces (bottom side)
  const redPieces: Array<{ type: PieceType; positions: Position[] }> = [
    { type: 'chariot', positions: [{ row: 9, col: 0 }, { row: 9, col: 8 }] },
    { type: 'horse', positions: [{ row: 9, col: 1 }, { row: 9, col: 7 }] },
    { type: 'elephant', positions: [{ row: 9, col: 2 }, { row: 9, col: 6 }] },
    { type: 'advisor', positions: [{ row: 9, col: 3 }, { row: 9, col: 5 }] },
    { type: 'general', positions: [{ row: 9, col: 4 }] },
    { type: 'cannon', positions: [{ row: 7, col: 1 }, { row: 7, col: 7 }] },
    { 
      type: 'soldier', 
      positions: [
        { row: 6, col: 0 }, { row: 6, col: 2 }, { row: 6, col: 4 },
        { row: 6, col: 6 }, { row: 6, col: 8 }
      ] 
    },
  ];

  // Black pieces (top side) 
  const blackPieces: Array<{ type: PieceType; positions: Position[] }> = [
    { type: 'chariot', positions: [{ row: 0, col: 0 }, { row: 0, col: 8 }] },
    { type: 'horse', positions: [{ row: 0, col: 1 }, { row: 0, col: 7 }] },
    { type: 'elephant', positions: [{ row: 0, col: 2 }, { row: 0, col: 6 }] },
    { type: 'advisor', positions: [{ row: 0, col: 3 }, { row: 0, col: 5 }] },
    { type: 'general', positions: [{ row: 0, col: 4 }] },
    { type: 'cannon', positions: [{ row: 2, col: 1 }, { row: 2, col: 7 }] },
    { 
      type: 'soldier', 
      positions: [
        { row: 3, col: 0 }, { row: 3, col: 2 }, { row: 3, col: 4 },
        { row: 3, col: 6 }, { row: 3, col: 8 }
      ] 
    },
  ];

  let pieceId = 0;

  // Add red pieces
  redPieces.forEach(({ type, positions }) => {
    positions.forEach(position => {
      pieces.push({
        id: `red_${type}_${pieceId++}`,
        type,
        color: 'red',
        position,
        hasMoved: false,
      });
    });
  });

  // Add black pieces
  blackPieces.forEach(({ type, positions }) => {
    positions.forEach(position => {
      pieces.push({
        id: `black_${type}_${pieceId++}`,
        type,
        color: 'black',
        position,
        hasMoved: false,
      });
    });
  });

  return pieces;
}

/**
 * Creates a 2D array representation of the board from pieces
 */
export function createBoardMatrix(pieces: Piece[]): (Piece | null)[][] {
  // Initialize empty board
  const board: (Piece | null)[][] = Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null));

  // Place pieces on board
  pieces.forEach(piece => {
    board[piece.position.row][piece.position.col] = piece;
  });

  return board;
}

/**
 * Creates the initial game state
 */
export function createInitialGameState(): GameState {
  const pieces = createInitialBoard();
  const board = createBoardMatrix(pieces);

  return {
    board,
    currentPlayer: 'red', // Red moves first in Chinese chess
    pieces,
    moveHistory: [],
    gameStatus: 'playing',
    selectedPiece: null,
    validMoves: [],
    winner: null,
  };
}

/**
 * Utility function to check if a position is within board bounds
 */
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_ROWS && pos.col >= 0 && pos.col < BOARD_COLS;
}

/**
 * Utility function to check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Get the piece at a specific position
 */
export function getPieceAt(board: (Piece | null)[][], position: Position): Piece | null {
  if (!isValidPosition(position)) return null;
  return board[position.row][position.col];
}

/**
 * Check if a position is in the palace (3x3 area for generals and advisors)
 */
export function isInPalace(position: Position, color: PlayerColor): boolean {
  const palaceRows = color === 'red' ? [7, 8, 9] : [0, 1, 2];
  const palaceCols = [3, 4, 5];
  
  return palaceRows.includes(position.row) && palaceCols.includes(position.col);
}

/**
 * Check if a position is on the correct side of the river for elephants
 */
export function isOnCorrectSide(position: Position, color: PlayerColor): boolean {
  if (color === 'red') {
    return position.row >= 5; // Red side (bottom half)
  } else {
    return position.row <= 4; // Black side (top half)
  }
}