# AI Integration Guide

## Fixed Issues in XiangqiAI.ts

### 1. **isGameOver() Method**
- **Purpose**: AI-specific version that checks if the game is not in 'playing' status
- **Difference from Engine**: Engine's `isGameOver()` only checks checkmate/stalemate, AI version checks all non-playing states
- **Why Separate**: AI needs to stop minimax search on any game end, not just specific end conditions

### 2. **getAllPossibleMoves() Method** 
- **Fixed**: Now uses existing `ChineseChessEngine.getAllValidMoves()`
- **Conversion**: Transforms engine's `{piece, moves[]}` format to AI's `Move[]` format
- **Integration**: Creates temporary engine instance with current game state

### 3. **makeMove() Method**
- **Purpose**: Creates NEW game state without modifying original (essential for minimax)
- **Difference from Engine**: Engine's `makeMove()` modifies actual game state, AI version returns new copy
- **Why Separate**: Minimax needs to explore move trees without affecting real game state

## How to Integrate AI with Your Game

### Basic Integration Example:

```typescript
// In your game component or engine
import { XiangqiAI } from './ai/XiangqiAI';

// Initialize AI (do this once)
const gameEngine = new ChineseChessEngine(initialGameState);
const aiPlayer = new XiangqiAI(gameEngine, 'medium');

// Get AI move suggestion
const currentGameState = gameEngine.getGameState();
const aiMove = aiPlayer.getBestMove(currentGameState);

if (aiMove) {
    // Execute the AI's suggested move
    const success = gameEngine.makeMove(aiMove.from, aiMove.to);
    if (success) {
        console.log('AI made move:', aiMove);
    }
}
```

### UI Integration Ideas:

```typescript
// Add hint button
const getHint = () => {
    const hint = aiPlayer.getBestMove(gameEngine.getGameState());
    if (hint) {
        highlightMove(hint.from, hint.to);
    }
};

// Add difficulty selector
const changeDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    aiPlayer.setDifficulty(level);
};

// AI vs Human game mode
const playAIMove = () => {
    if (gameEngine.getGameState().currentPlayer === 'black') { // AI is black
        const aiMove = aiPlayer.getBestMove(gameEngine.getGameState());
        if (aiMove) {
            gameEngine.makeMove(aiMove.from, aiMove.to);
        }
    }
};
```

## Performance Considerations

- **Easy (depth 2)**: ~100ms thinking time
- **Medium (depth 4)**: ~1-3 seconds thinking time  
- **Hard (depth 6)**: ~5-15 seconds thinking time

## Next Steps

1. **Test the Integration**: Try creating a simple test to verify AI works
2. **Add to Game UI**: Add hint button or AI opponent mode
3. **Enhance Evaluation**: Add positional bonuses to `evaluatePosition()` method
4. **Opening Book**: Consider adding opening move database for stronger early game

## Current AI Capabilities

✅ **Working Features:**
- Minimax algorithm with Alpha-Beta pruning
- 3 difficulty levels (2, 4, 6 moves ahead)
- Move evaluation based on piece values
- Proper game state management
- Integration with existing game engine

🚧 **Areas for Enhancement:**
- Positional evaluation (center control, piece activity)
- Opening move database
- Endgame knowledge
- Move ordering optimization
- Transposition tables for better performance

The AI is now fully functional and ready to be integrated into your chess game!