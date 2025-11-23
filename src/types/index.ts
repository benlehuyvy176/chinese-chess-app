// Types for Chinese Chess (Xiangqi) game

export type PieceType = 
  | 'general' // 帥/將 (King)
  | 'advisor' // 仕/士 (Guard/Advisor)
  | 'elephant' // 相/象 (Elephant/Minister)
  | 'horse' // 馬 (Horse)
  | 'chariot' // 車 (Rook/Chariot)
  | 'cannon' // 炮/砲 (Cannon)
  | 'soldier'; // 兵/卒 (Pawn/Soldier)

export type PlayerColor = 'red' | 'black';

export interface Position {
  row: number; // 0-9 (top to bottom)
  col: number; // 0-8 (left to right)
}

export interface Piece {
  id: string;
  type: PieceType;
  color: PlayerColor;
  position: Position;
  hasMoved: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  notation?: string; // For game history
}

export interface GameState {
  board: (Piece | null)[][]; // 10x9 board
  currentPlayer: PlayerColor;
  pieces: Piece[];
  moveHistory: Move[];
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  selectedPiece: Piece | null;
  validMoves: Position[];
  winner: PlayerColor | null;
}

export interface GameConfig {
  enableSound: boolean;
  showMoveHints: boolean;
  animationSpeed: number;
  boardTheme: 'classic' | 'modern' | 'minimal';
}