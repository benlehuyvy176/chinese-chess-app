import { Piece, Position, PlayerColor } from '../types';
import { isValidPosition, getPieceAt, isInPalace, isOnCorrectSide, positionsEqual } from './board';

/**
 * Calculate all valid moves for a given piece
 */
export function getValidMoves(
  piece: Piece, 
  board: (Piece | null)[][],
  _includeProtectedSquares = false
): Position[] {
  switch (piece.type) {
    case 'general':
      return getGeneralMoves(piece, board);
    case 'advisor':
      return getAdvisorMoves(piece, board);
    case 'elephant':
      return getElephantMoves(piece, board);
    case 'horse':
      return getHorseMoves(piece, board);
    case 'chariot':
      return getChariotMoves(piece, board);
    case 'cannon':
      return getCannonMoves(piece, board);
    case 'soldier':
      return getSoldierMoves(piece, board);
    default:
      return [];
  }
}

/**
 * General (King) moves: one step orthogonally within the palace
 * Special rule: Flying General - generals cannot face each other directly
 */
function getGeneralMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Orthogonal moves within palace
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dRow, dCol] of directions) {
    const newPos: Position = { row: row + dRow, col: col + dCol };
    
    if (isValidPosition(newPos) && isInPalace(newPos, piece.color)) {
      const targetPiece = getPieceAt(board, newPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        // Check flying general rule
        if (!wouldCreateFlyingGeneral(piece, newPos, board)) {
          moves.push(newPos);
        }
      }
    }
  }
  
  return moves;
}

/**
 * Check if moving a general would create a "flying general" situation
 */
function wouldCreateFlyingGeneral(
  general: Piece, 
  newPos: Position, 
  board: (Piece | null)[][]
): boolean {
  // Create a temporary board with the general moved
  const tempBoard = board.map(row => [...row]);
  tempBoard[general.position.row][general.position.col] = null;
  tempBoard[newPos.row][newPos.col] = general;
  
  // Find both generals
  let redGeneral: Position | null = null;
  let blackGeneral: Position | null = null;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = tempBoard[row][col];
      if (piece?.type === 'general') {
        if (piece.color === 'red') {
          redGeneral = { row, col };
        } else {
          blackGeneral = { row, col };
        }
      }
    }
  }
  
  // Check if generals are in the same column and no pieces between them
  if (redGeneral && blackGeneral && redGeneral.col === blackGeneral.col) {
    const minRow = Math.min(redGeneral.row, blackGeneral.row);
    const maxRow = Math.max(redGeneral.row, blackGeneral.row);
    
    for (let row = minRow + 1; row < maxRow; row++) {
      if (tempBoard[row][redGeneral.col]) {
        return false; // Piece blocking, no flying general
      }
    }
    return true; // Flying general situation
  }
  
  return false;
}

/**
 * Advisor moves: one step diagonally within the palace
 */
function getAdvisorMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Diagonal moves within palace
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  
  for (const [dRow, dCol] of directions) {
    const newPos: Position = { row: row + dRow, col: col + dCol };
    
    if (isValidPosition(newPos) && isInPalace(newPos, piece.color)) {
      const targetPiece = getPieceAt(board, newPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

/**
 * Elephant moves: two points diagonally, cannot cross the river, cannot jump
 */
function getElephantMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Elephant moves 2 points diagonally
  const elephantMoves = [
    { dr: -2, dc: -2, blockRow: row - 1, blockCol: col - 1 },
    { dr: -2, dc: 2, blockRow: row - 1, blockCol: col + 1 },
    { dr: 2, dc: -2, blockRow: row + 1, blockCol: col - 1 },
    { dr: 2, dc: 2, blockRow: row + 1, blockCol: col + 1 },
  ];
  
  for (const move of elephantMoves) {
    const newPos: Position = { row: row + move.dr, col: col + move.dc };
    const blockPos: Position = { row: move.blockRow, col: move.blockCol };
    
    if (
      isValidPosition(newPos) &&
      isOnCorrectSide(newPos, piece.color) &&
      !getPieceAt(board, blockPos) // Cannot jump over pieces
    ) {
      const targetPiece = getPieceAt(board, newPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

/**
 * Horse moves: L-shape, can be blocked by adjacent pieces
 */
function getHorseMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Horse moves in L-shape with blocking positions
  const horseMoves = [
    { dr: -2, dc: -1, blockRow: row - 1, blockCol: col },
    { dr: -2, dc: 1, blockRow: row - 1, blockCol: col },
    { dr: 2, dc: -1, blockRow: row + 1, blockCol: col },
    { dr: 2, dc: 1, blockRow: row + 1, blockCol: col },
    { dr: -1, dc: -2, blockRow: row, blockCol: col - 1 },
    { dr: 1, dc: -2, blockRow: row, blockCol: col - 1 },
    { dr: -1, dc: 2, blockRow: row, blockCol: col + 1 },
    { dr: 1, dc: 2, blockRow: row, blockCol: col + 1 },
  ];
  
  for (const move of horseMoves) {
    const newPos: Position = { row: row + move.dr, col: col + move.dc };
    const blockPos: Position = { row: move.blockRow, col: move.blockCol };
    
    if (
      isValidPosition(newPos) &&
      !getPieceAt(board, blockPos) // Cannot be blocked
    ) {
      const targetPiece = getPieceAt(board, newPos);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

/**
 * Chariot (Rook) moves: any distance orthogonally
 */
function getChariotMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Four orthogonal directions
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 10; i++) {
      const newPos: Position = { row: row + dRow * i, col: col + dCol * i };
      
      if (!isValidPosition(newPos)) break;
      
      const targetPiece = getPieceAt(board, newPos);
      
      if (!targetPiece) {
        moves.push(newPos);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(newPos); // Can capture
        }
        break; // Cannot move further
      }
    }
  }
  
  return moves;
}

/**
 * Cannon moves: like chariot but needs a piece to jump over for capturing
 */
function getCannonMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  // Four orthogonal directions
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dRow, dCol] of directions) {
    let foundPiece = false;
    
    for (let i = 1; i < 10; i++) {
      const newPos: Position = { row: row + dRow * i, col: col + dCol * i };
      
      if (!isValidPosition(newPos)) break;
      
      const targetPiece = getPieceAt(board, newPos);
      
      if (!foundPiece) {
        // Before finding a piece to jump over
        if (!targetPiece) {
          moves.push(newPos); // Can move to empty square
        } else {
          foundPiece = true; // Found piece to potentially jump over
        }
      } else {
        // After finding a piece to jump over
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            moves.push(newPos); // Can capture enemy piece
          }
          break; // Cannot move further after capturing or hitting friendly piece
        }
        // Continue looking for a piece to capture
      }
    }
  }
  
  return moves;
}

/**
 * Soldier moves: forward only (and sideways after crossing river)
 */
function getSoldierMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = piece.position;
  
  const forwardDirection = piece.color === 'red' ? -1 : 1;
  const hasCrossedRiver = piece.color === 'red' ? row <= 4 : row >= 5;
  
  // Forward move
  const forwardPos: Position = { row: row + forwardDirection, col };
  if (isValidPosition(forwardPos)) {
    const targetPiece = getPieceAt(board, forwardPos);
    if (!targetPiece || targetPiece.color !== piece.color) {
      moves.push(forwardPos);
    }
  }
  
  // Sideways moves (only after crossing river)
  if (hasCrossedRiver) {
    const sidewaysMoves = [
      { row, col: col - 1 },
      { row, col: col + 1 }
    ];
    
    for (const sidePos of sidewaysMoves) {
      if (isValidPosition(sidePos)) {
        const targetPiece = getPieceAt(board, sidePos);
        if (!targetPiece || targetPiece.color !== piece.color) {
          moves.push(sidePos);
        }
      }
    }
  }
  
  return moves;
}

/**
 * Check if a move is valid for a piece
 */
export function isValidMove(
  piece: Piece,
  targetPosition: Position,
  board: (Piece | null)[][]
): boolean {
  const validMoves = getValidMoves(piece, board);
  return validMoves.some(move => positionsEqual(move, targetPosition));
}

/**
 * Check if the king is in check
 */
export function isInCheck(color: PlayerColor, board: (Piece | null)[][]): boolean {
  // Find the general
  let general: Piece | null = null;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece?.type === 'general' && piece.color === color) {
        general = piece;
        break;
      }
    }
    if (general) break;
  }
  
  if (!general) return false;
  
  // Check if any enemy piece can attack the general
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        const moves = getValidMoves(piece, board, true);
        if (moves.some(move => positionsEqual(move, general!.position))) {
          return true;
        }
      }
    }
  }
  
  return false;
}