// AI Engine for Chinese Chess (Xiangqi)
// This file implements the Minimax algorithm with Alpha-Beta pruning

import { GameState, Move, PieceType, Position } from '../types';
import { ChineseChessEngine } from '../game/engine';

/**
 * AI Engine class that uses Minimax algorithm to suggest moves
 * 
 * How it works:
 * 1. Minimax explores future game positions (like looking ahead in chess)
 * 2. It assumes both players play optimally
 * 3. Alpha-Beta pruning cuts off branches that won't lead to better moves
 * 4. Returns the best move it can find within the search depth
 */
export class XiangqiAI {
    private gameEngine: ChineseChessEngine;
    private maxDepth: number; // How many moves ahead to look
    
    // Piece values for evaluation (traditional Xiangqi values)
    private readonly PIECE_VALUES: Record<PieceType, number> = {
        'general': 10000,    // King/General - most valuable
        'advisor': 200,      // Advisor/Guard
        'elephant': 200,     // Elephant/Bishop  
        'horse': 400,        // Horse/Knight
        'chariot': 900,      // Chariot/Rook - very powerful
        'cannon': 450,       // Cannon - unique to Xiangqi
        'soldier': 100       // Soldier/Pawn
    };
    
    constructor(gameEngine: ChineseChessEngine, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        this.gameEngine = gameEngine;
        
        // Set search depth based on difficulty
        switch (difficulty) {
            case 'easy': this.maxDepth = 2; break;     // Looks 2 moves ahead
            case 'medium': this.maxDepth = 4; break;   // Looks 4 moves ahead  
            case 'hard': this.maxDepth = 6; break;     // Looks 6 moves ahead
        }
    }
    
    /**
     * Change AI difficulty during gameplay
     */
    setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
        switch (difficulty) {
            case 'easy': this.maxDepth = 2; break;
            case 'medium': this.maxDepth = 4; break;
            case 'hard': this.maxDepth = 6; break;
        }
        console.log(`🎯 AI difficulty set to ${difficulty} (depth: ${this.maxDepth})`);
    }
    
    /**
     * Main function to get the best move for the current player
     * This is what your game will call when AI needs to move
     */
    getBestMove(gameState: GameState): Move | null {
        console.log(`🤖 AI thinking... (depth: ${this.maxDepth})`);
        
        const startTime = Date.now();
        
        // Start the Minimax search
        const result = this.minimax(
            gameState, 
            this.maxDepth, 
            -Infinity,  // Alpha (best value for maximizing player)
            Infinity,   // Beta (best value for minimizing player)
            true        // Is maximizing player (AI's turn)
        );
        
        const thinkingTime = Date.now() - startTime;
        console.log(`🧠 AI found best move in ${thinkingTime}ms, score: ${result.score}`);
        
        return result.move;
    }
    
    /**
     * The heart of the AI - Minimax algorithm with Alpha-Beta pruning
     * 
     * Think of this like a conversation between two players:
     * - Maximizing player (AI): "I want the HIGHEST score possible"
     * - Minimizing player (Human): "I want the LOWEST score possible"
     * 
     * The algorithm explores moves back and forth, assuming both play optimally
     */
    private minimax(
        gameState: GameState,
        depth: number,
        alpha: number,    // Best value maximizing player can guarantee
        beta: number,     // Best value minimizing player can guarantee  
        isMaximizing: boolean
    ): { move: Move | null; score: number } {
        
        // BASE CASE: Stop searching if we've reached max depth or game is over
        if (depth === 0 || this.isGameOver(gameState)) {
            return {
                move: null,
                score: this.evaluatePosition(gameState)
            };
        }
        
        // Get all possible moves for current player
        const possibleMoves = this.getAllPossibleMoves(gameState);
        
        if (possibleMoves.length === 0) {
            // No moves available - game over
            return {
                move: null,
                score: isMaximizing ? -Infinity : Infinity
            };
        }
        
        let bestMove: Move | null = null;
        
        if (isMaximizing) {
            // AI's turn - wants to MAXIMIZE the score
            let maxScore = -Infinity;
            
            for (const move of possibleMoves) {
                // Try this move and see what happens
                const newGameState = this.makeMove(gameState, move);
                
                // Recursively check opponent's response
                const result = this.minimax(newGameState, depth - 1, alpha, beta, false);
                
                // Is this move better than our current best?
                if (result.score > maxScore) {
                    maxScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-Beta pruning: Update alpha
                alpha = Math.max(alpha, result.score);
                
                // Prune: If beta <= alpha, opponent won't allow this path
                if (beta <= alpha) {
                    console.log(`✂️ Pruned at depth ${depth} (beta=${beta} <= alpha=${alpha})`);
                    break; // This is the key optimization!
                }
            }
            
            return { move: bestMove, score: maxScore };
            
        } else {
            // Opponent's turn - wants to MINIMIZE the score
            let minScore = Infinity;
            
            for (const move of possibleMoves) {
                // Try opponent's move
                const newGameState = this.makeMove(gameState, move);
                
                // Recursively check AI's response
                const result = this.minimax(newGameState, depth - 1, alpha, beta, true);
                
                // Is this move worse for us (better for opponent)?
                if (result.score < minScore) {
                    minScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-Beta pruning: Update beta
                beta = Math.min(beta, result.score);
                
                // Prune: If beta <= alpha, we won't allow this path
                if (beta <= alpha) {
                    console.log(`✂️ Pruned at depth ${depth} (beta=${beta} <= alpha=${alpha})`);
                    break; // Cut off this branch
                }
            }
            
            return { move: bestMove, score: minScore };
        }
    }
    
    /**
     * Evaluate how good a position is for the AI
     * Positive = good for AI, Negative = good for opponent
     * 
     * This is like asking "Who's winning and by how much?"
     */
    private evaluatePosition(gameState: GameState): number {
        let score = 0;
        
        // Count piece values for both sides
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = gameState.board[row][col];
                if (piece) {
                    const pieceValue = this.PIECE_VALUES[piece.type];
                    
                    if (piece.color === 'red') {
                        score += pieceValue; // Add for AI (assuming AI is red)
                    } else {
                        score -= pieceValue; // Subtract for opponent
                    }
                }
            }
        }
        
        // Add positional bonuses for strategic play
        score += this.getPositionalBonuses(gameState);
        
        return score;
    }
    
    /**
     * Calculate positional bonuses for strategic play
     * This is what makes the AI play smart, not just greedily
     */
    private getPositionalBonuses(gameState: GameState): number {
        let bonus = 0;
        
        // Positional piece-square tables for Xiangqi
        // Values represent how good it is for a piece to be on each square
        const PIECE_POSITION_VALUES = {
            // General (stays in palace, prefers back rank for safety)
            'general': [
                [0, 0, 0, 200, 300, 200, 0, 0, 0],   // Back rank - safest
                [0, 0, 0, 100, 200, 100, 0, 0, 0],   // Middle palace
                [0, 0, 0, 50, 100, 50, 0, 0, 0],     // Front palace - exposed
                // General can't leave palace, so other rows are 0
                ...Array(7).fill([0, 0, 0, 0, 0, 0, 0, 0, 0])
            ],
            
            // Advisor (stays in palace, protects general)
            'advisor': [
                [0, 0, 0, 0, 150, 0, 0, 0, 0],       // Back corners - excellent
                [0, 0, 0, 100, 0, 100, 0, 0, 0],     // Side positions
                [0, 0, 0, 0, 50, 0, 0, 0, 0],        // Center - okay
                ...Array(7).fill([0, 0, 0, 0, 0, 0, 0, 0, 0])
            ],
            
            // Elephant (stays on own side, controls diagonals)
            'elephant': [
                [0, 0, 20, 0, 40, 0, 20, 0, 0],      // Back rank
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [20, 0, 60, 0, 80, 0, 60, 0, 20],    // Strong diagonal control
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [40, 0, 100, 0, 120, 0, 100, 0, 40], // River line - maximum influence
                ...Array(5).fill([0, 0, 0, 0, 0, 0, 0, 0, 0]) // Can't cross river
            ],
            
            // Horse (prefers center, avoids edges)
            'horse': [
                [10, 20, 30, 40, 50, 40, 30, 20, 10],
                [20, 40, 60, 80, 100, 80, 60, 40, 20],
                [30, 60, 90, 120, 150, 120, 90, 60, 30],
                [40, 80, 120, 150, 180, 150, 120, 80, 40],
                [50, 100, 150, 180, 200, 180, 150, 100, 50], // Center files - best
                [40, 80, 120, 150, 180, 150, 120, 80, 40],
                [30, 60, 90, 120, 150, 120, 90, 60, 30],
                [20, 40, 60, 80, 100, 80, 60, 40, 20],
                [10, 20, 30, 40, 50, 40, 30, 20, 10],
                [5, 10, 15, 20, 25, 20, 15, 10, 5]
            ],
            
            // Chariot (prefers open files and ranks, central control)
            'chariot': [
                [50, 60, 70, 80, 90, 80, 70, 60, 50],
                [60, 70, 80, 90, 100, 90, 80, 70, 60],
                [70, 80, 90, 100, 110, 100, 90, 80, 70],
                [80, 90, 100, 110, 120, 110, 100, 90, 80],
                [90, 100, 110, 120, 130, 120, 110, 100, 90], // River - excellent
                [80, 90, 100, 110, 120, 110, 100, 90, 80],
                [70, 80, 90, 100, 110, 100, 90, 80, 70],
                [60, 70, 80, 90, 100, 90, 80, 70, 60],
                [50, 60, 70, 80, 90, 80, 70, 60, 50],
                [40, 50, 60, 70, 80, 70, 60, 50, 40]
            ],
            
            // Cannon (prefers center files for maximum impact)
            'cannon': [
                [40, 50, 60, 70, 80, 70, 60, 50, 40],
                [50, 60, 70, 80, 90, 80, 70, 60, 50],
                [60, 70, 80, 90, 100, 90, 80, 70, 60],
                [70, 80, 90, 100, 110, 100, 90, 80, 70],
                [80, 90, 100, 110, 120, 110, 100, 90, 80], // Center control
                [70, 80, 90, 100, 110, 100, 90, 80, 70],
                [60, 70, 80, 90, 100, 90, 80, 70, 60],
                [50, 60, 70, 80, 90, 80, 70, 60, 50],
                [40, 50, 60, 70, 80, 70, 60, 50, 40],
                [30, 40, 50, 60, 70, 60, 50, 40, 30]
            ],
            
            // Soldier (advances toward enemy, prefers center files)
            'soldier': [
                [10, 15, 20, 25, 30, 25, 20, 15, 10],
                [15, 20, 25, 30, 35, 30, 25, 20, 15],
                [20, 25, 30, 35, 40, 35, 30, 25, 20],
                [25, 30, 35, 40, 45, 40, 35, 30, 25],
                [30, 35, 40, 45, 50, 45, 40, 35, 30], // River crossing - big bonus
                [50, 60, 70, 80, 90, 80, 70, 60, 50], // Enemy territory - excellent
                [60, 70, 80, 90, 100, 90, 80, 70, 60],
                [70, 80, 90, 100, 110, 100, 90, 80, 70],
                [80, 90, 100, 110, 120, 110, 100, 90, 80],
                [90, 100, 110, 120, 130, 120, 110, 100, 90] // Deep penetration - maximum
            ]
        };
        
        // Calculate positional bonuses for each piece
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = gameState.board[row][col];
                if (piece) {
                    let positionValue = 0;
                    const pieceTable = PIECE_POSITION_VALUES[piece.type];
                    
                    if (pieceTable && pieceTable[row] && pieceTable[row][col] !== undefined) {
                        positionValue = pieceTable[row][col];
                        
                        // Flip evaluation for black pieces (they play from opposite side)
                        if (piece.color === 'black') {
                            const flippedRow = 9 - row;
                            if (pieceTable[flippedRow] && pieceTable[flippedRow][col] !== undefined) {
                                positionValue = pieceTable[flippedRow][col];
                            }
                        }
                    }
                    
                    // Add or subtract based on piece color (assuming AI is red)
                    if (piece.color === 'red') {
                        bonus += positionValue;
                    } else {
                        bonus -= positionValue;
                    }
                }
            }
        }
        
        // Strategic bonuses
        bonus += this.getStrategicBonuses(gameState);
        
        return bonus;
    }
    
    /**
     * Calculate strategic bonuses (mobility, king safety, piece coordination)
     */
    private getStrategicBonuses(gameState: GameState): number {
        let strategicBonus = 0;
        
        // 1. Mobility bonus - reward having more move options
        const currentPlayerMoves = this.getAllPossibleMoves(gameState).length;
        
        // Simulate opponent's moves by switching player temporarily
        const opponentGameState: GameState = { 
            ...gameState, 
            currentPlayer: gameState.currentPlayer === 'red' ? 'black' as const : 'red' as const
        };
        const opponentMoves = this.getAllPossibleMoves(opponentGameState).length;
        
        // Mobility advantage (each extra move option is worth 10 points)
        const mobilityAdvantage = (currentPlayerMoves - opponentMoves) * 10;
        if (gameState.currentPlayer === 'red') {
            strategicBonus += mobilityAdvantage;
        } else {
            strategicBonus -= mobilityAdvantage;
        }
        
        // 2. King safety bonus - penalize exposed kings
        strategicBonus += this.getKingSafetyBonus(gameState);
        
        // 3. Development bonus - reward getting pieces off back rank early
        strategicBonus += this.getDevelopmentBonus(gameState);
        
        return strategicBonus;
    }
    
    /**
     * Evaluate king safety
     */
    private getKingSafetyBonus(gameState: GameState): number {
        let safetyBonus = 0;
        
        // Find generals and count nearby defenders
        for (const piece of gameState.pieces) {
            if (piece.type === 'general') {
                let defenders = 0;
                const kingPos = piece.position;
                
                // Count friendly pieces within 2 squares of king
                for (const otherPiece of gameState.pieces) {
                    if (otherPiece.color === piece.color && otherPiece !== piece) {
                        const distance = Math.abs(otherPiece.position.row - kingPos.row) + 
                                       Math.abs(otherPiece.position.col - kingPos.col);
                        if (distance <= 2) {
                            defenders++;
                        }
                    }
                }
                
                // Each defender near king is worth 25 points
                const defenseValue = defenders * 25;
                
                if (piece.color === 'red') {
                    safetyBonus += defenseValue;
                } else {
                    safetyBonus -= defenseValue;
                }
            }
        }
        
        return safetyBonus;
    }
    
    /**
     * Reward piece development (getting pieces off starting squares)
     */
    private getDevelopmentBonus(gameState: GameState): number {
        let developmentBonus = 0;
        
        // Starting positions for key pieces (for red player)
        const STARTING_POSITIONS = {
            'horse': [{row: 0, col: 1}, {row: 0, col: 7}],
            'cannon': [{row: 2, col: 1}, {row: 2, col: 7}],
            'chariot': [{row: 0, col: 0}, {row: 0, col: 8}]
        };
        
        for (const piece of gameState.pieces) {
            if (['horse', 'cannon', 'chariot'].includes(piece.type)) {
                const startingPoss = STARTING_POSITIONS[piece.type as keyof typeof STARTING_POSITIONS];
                let isOnStartingSquare = false;
                
                for (const startPos of startingPoss) {
                    // Check for both colors (black starts on opposite side)
                    const redStart = startPos;
                    const blackStart = { row: 9 - startPos.row, col: startPos.col };
                    
                    if (piece.color === 'red') {
                        if (piece.position.row === redStart.row && piece.position.col === redStart.col) {
                            isOnStartingSquare = true;
                            break;
                        }
                    } else {
                        if (piece.position.row === blackStart.row && piece.position.col === blackStart.col) {
                            isOnStartingSquare = true;
                            break;
                        }
                    }
                }
                
                // Bonus for developing pieces (penalty for keeping them on starting squares)
                const developmentValue = isOnStartingSquare ? -20 : 30;
                
                if (piece.color === 'red') {
                    developmentBonus += developmentValue;
                } else {
                    developmentBonus -= developmentValue;
                }
            }
        }
        
        return developmentBonus;
    }
    
    // Helper methods - these are AI-specific versions of engine methods
    private isGameOver(gameState: GameState): boolean {
        // AI version: checks if game is not ongoing (includes all end states)
        return gameState.gameStatus !== 'playing';
    }
    
    private getAllPossibleMoves(gameState: GameState): Move[] {
        // Convert engine's getAllValidMoves format to Move[] format for AI
        const moves: Move[] = [];
        
        // Create temporary engine with this game state to get valid moves
        const tempEngine = new ChineseChessEngine(gameState);
        const validMovesData = tempEngine.getAllValidMoves();
        
        for (const { piece, moves: positions } of validMovesData) {
            for (const toPosition of positions) {
                moves.push({
                    from: piece.position,
                    to: toPosition,
                    piece: piece,
                    // capturedPiece will be determined when move is made
                });
            }
        }
        
        return moves;
    }
    
    private makeMove(gameState: GameState, move: Move): GameState {
        // AI version: creates NEW game state without modifying original
        // This is essential for minimax tree search
        
        // Deep copy the game state
        const newGameState: GameState = {
            board: gameState.board.map(row => [...row]),
            currentPlayer: gameState.currentPlayer,
            pieces: [...gameState.pieces],
            moveHistory: [...gameState.moveHistory],
            gameStatus: gameState.gameStatus,
            validMoves: [...gameState.validMoves],
            selectedPiece: gameState.selectedPiece,
            winner: gameState.winner
        };
        
        // Apply the move to the new board
        const capturedPiece = newGameState.board[move.to.row][move.to.col];
        
        // Remove piece from old position
        newGameState.board[move.from.row][move.from.col] = null;
        
        // Place piece at new position
        newGameState.board[move.to.row][move.to.col] = {
            ...move.piece,
            position: move.to
        };
        
        // Update pieces array
        if (capturedPiece) {
            // Remove captured piece from pieces array
            newGameState.pieces = newGameState.pieces.filter(p => 
                !(p.position.row === move.to.row && p.position.col === move.to.col)
            );
        }
        
        // Update moved piece position in pieces array
        const pieceIndex = newGameState.pieces.findIndex(p => 
            p.position.row === move.from.row && p.position.col === move.from.col
        );
        if (pieceIndex !== -1) {
            newGameState.pieces[pieceIndex] = {
                ...newGameState.pieces[pieceIndex],
                position: move.to
            };
        }
        
        // Switch current player
        newGameState.currentPlayer = newGameState.currentPlayer === 'red' ? 'black' : 'red';
        
        // Add move to history
        const moveWithCapture: Move = {
            ...move,
            capturedPiece: capturedPiece || undefined
        };
        newGameState.moveHistory.push(moveWithCapture);
        
        // Note: We don't update game status here for performance in minimax
        // The real engine would check for checkmate/stalemate
        
        return newGameState;
    }
}

/**
 * Usage Example:
 * 
 * const ai = new XiangqiAI(gameEngine, 'medium');
 * const bestMove = ai.getBestMove(currentGameState);
 * if (bestMove) {
 *     gameEngine.makeMove(bestMove.from, bestMove.to);
 * }
 */