import { GameState, Move, Position, Piece, PlayerColor } from '../types';
import { getPieceAt } from './board';
import { getValidMoves, isValidMove, isInCheck } from './moves';

/**
 * Game engine class that manages the game state and validates moves
 */
export class ChineseChessEngine {
  private gameState: GameState;
  
  constructor(initialState: GameState) {
    this.gameState = { ...initialState };
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState {
    return { ...this.gameState };
  }

  /**
   * Select a piece for moving
   */
  selectPiece(position: Position): boolean {
    const piece = getPieceAt(this.gameState.board, position);
    
    // Can only select own pieces and only during player's turn
    if (!piece || piece.color !== this.gameState.currentPlayer) {
      this.gameState.selectedPiece = null;
      this.gameState.validMoves = [];
      return false;
    }

    this.gameState.selectedPiece = piece;
    this.gameState.validMoves = getValidMoves(piece, this.gameState.board);
    
    return true;
  }

  /**
   * Clear the current selection
   */
  clearSelection(): void {
    this.gameState.selectedPiece = null;
    this.gameState.validMoves = [];
  }

  /**
   * Attempt to make a move
   */
  makeMove(from: Position, to: Position): boolean {
    const piece = getPieceAt(this.gameState.board, from);
    
    // Validate basic move conditions
    if (!piece || piece.color !== this.gameState.currentPlayer) {
      return false;
    }

    if (!isValidMove(piece, to, this.gameState.board)) {
      return false;
    }

    // Check if move would leave own king in check
    if (this.wouldLeaveInCheck(piece, to)) {
      return false;
    }

    // Execute the move
    const capturedPiece = getPieceAt(this.gameState.board, to);
    this.executeMoveInternal(piece, to, capturedPiece);

    // Update game state
    this.updateGameStatus();
    this.switchPlayer();
    this.clearSelection();

    return true;
  }

  /**
   * Check if a move would leave the player's own king in check
   */
  private wouldLeaveInCheck(piece: Piece, newPosition: Position): boolean {
    // Create temporary board state
    const tempBoard = this.gameState.board.map(row => [...row]);
    
    // Execute move temporarily
    tempBoard[piece.position.row][piece.position.col] = null;
    tempBoard[newPosition.row][newPosition.col] = piece;
    
    // Check if king would be in check
    const inCheck = isInCheck(piece.color, tempBoard);
    
    return inCheck;
  }

  /**
   * Execute a move internally (updates board and pieces)
   */
  private executeMoveInternal(piece: Piece, to: Position, capturedPiece: Piece | null): void {
    const move: Move = {
      from: { ...piece.position },
      to: { ...to },
      piece: { ...piece },
      capturedPiece: capturedPiece ? { ...capturedPiece } : undefined,
      notation: this.generateMoveNotation(piece, to, capturedPiece),
    };

    // Update board
    this.gameState.board[piece.position.row][piece.position.col] = null;
    this.gameState.board[to.row][to.col] = piece;

    // Update piece position
    piece.position = { ...to };
    piece.hasMoved = true;

    // Remove captured piece from pieces array
    if (capturedPiece) {
      const capturedIndex = this.gameState.pieces.findIndex(p => p.id === capturedPiece.id);
      if (capturedIndex !== -1) {
        this.gameState.pieces.splice(capturedIndex, 1);
      }
    }

    // Add move to history
    this.gameState.moveHistory.push(move);
  }

  /**
   * Generate algebraic notation for a move
   */
  private generateMoveNotation(piece: Piece, to: Position, capturedPiece: Piece | null): string {
    const pieceSymbols: Record<string, string> = {
      general: 'K',
      advisor: 'A',
      elephant: 'E', 
      horse: 'H',
      chariot: 'R',
      cannon: 'C',
      soldier: 'S',
    };

    const pieceSymbol = pieceSymbols[piece.type] || piece.type[0].toUpperCase();
    const fromSquare = `${String.fromCharCode(97 + piece.position.col)}${9 - piece.position.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${9 - to.row}`;
    const capture = capturedPiece ? 'x' : '';

    return `${pieceSymbol}${fromSquare}${capture}${toSquare}`;
  }

  /**
   * Update game status (check, checkmate, stalemate)
   */
  private updateGameStatus(): void {
    const opponentColor = this.gameState.currentPlayer === 'red' ? 'black' : 'red';
    
    if (isInCheck(opponentColor, this.gameState.board)) {
      if (this.isCheckmate(opponentColor)) {
        this.gameState.gameStatus = 'checkmate';
        this.gameState.winner = this.gameState.currentPlayer;
      } else {
        this.gameState.gameStatus = 'check';
      }
    } else if (this.isStalemate(opponentColor)) {
      this.gameState.gameStatus = 'stalemate';
    } else {
      this.gameState.gameStatus = 'playing';
    }
  }

  /**
   * Check if a player is in checkmate
   */
  private isCheckmate(color: PlayerColor): boolean {
    if (!isInCheck(color, this.gameState.board)) {
      return false;
    }

    return !this.hasLegalMoves(color);
  }

  /**
   * Check if a player is in stalemate
   */
  private isStalemate(color: PlayerColor): boolean {
    if (isInCheck(color, this.gameState.board)) {
      return false;
    }

    return !this.hasLegalMoves(color);
  }

  /**
   * Check if a player has any legal moves
   */
  private hasLegalMoves(color: PlayerColor): boolean {
    for (const piece of this.gameState.pieces) {
      if (piece.color === color) {
        const moves = getValidMoves(piece, this.gameState.board);
        for (const move of moves) {
          if (!this.wouldLeaveInCheck(piece, move)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Switch to the next player
   */
  private switchPlayer(): void {
    this.gameState.currentPlayer = this.gameState.currentPlayer === 'red' ? 'black' : 'red';
  }

  /**
   * Undo the last move
   */
  undoLastMove(): boolean {
    if (this.gameState.moveHistory.length === 0) {
      return false;
    }

    const lastMove = this.gameState.moveHistory.pop()!;
    
    // Restore piece position
    const piece = getPieceAt(this.gameState.board, lastMove.to);
    if (piece) {
      piece.position = { ...lastMove.from };
      piece.hasMoved = lastMove.piece.hasMoved;

      // Update board
      this.gameState.board[lastMove.to.row][lastMove.to.col] = null;
      this.gameState.board[lastMove.from.row][lastMove.from.col] = piece;

      // Restore captured piece
      if (lastMove.capturedPiece) {
        this.gameState.pieces.push({ ...lastMove.capturedPiece });
        this.gameState.board[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;
      }
    }

    // Switch back to previous player
    this.switchPlayer();
    
    // Update game status
    this.updateGameStatus();
    this.clearSelection();

    return true;
  }

  /**
   * Reset the game to initial state
   */
  resetGame(initialState: GameState): void {
    this.gameState = { ...initialState };
  }

  /**
   * Get all valid moves for the current player
   */
  getAllValidMoves(): Array<{ piece: Piece; moves: Position[] }> {
    const validMoves: Array<{ piece: Piece; moves: Position[] }> = [];

    for (const piece of this.gameState.pieces) {
      if (piece.color === this.gameState.currentPlayer) {
        const moves = getValidMoves(piece, this.gameState.board).filter(
          move => !this.wouldLeaveInCheck(piece, move)
        );
        if (moves.length > 0) {
          validMoves.push({ piece, moves });
        }
      }
    }

    return validMoves;
  }

  /**
   * Check if the game is over
   */
  isGameOver(): boolean {
    return this.gameState.gameStatus === 'checkmate' || 
           this.gameState.gameStatus === 'stalemate';
  }

  /**
   * Get move history in readable format
   */
  getMoveHistory(): string[] {
    return this.gameState.moveHistory.map(move => move.notation || 'Unknown move');
  }
}