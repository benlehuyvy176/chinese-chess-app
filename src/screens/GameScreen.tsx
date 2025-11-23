import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { GameBoard, GameControls, MoveHistory } from '../components';
import { GameState, Position } from '../types';
import { 
  ChineseChessEngine, 
  createInitialGameState, 
  getPieceAt,
  positionsEqual 
} from '../game';

const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [gameEngine] = useState<ChineseChessEngine>(
    new ChineseChessEngine(createInitialGameState())
  );
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Update local state when engine state changes
  const updateGameState = useCallback(() => {
    setGameState({ ...gameEngine.getGameState() });
  }, [gameEngine]);

  const handleNewGame = useCallback(() => {
    const newState = createInitialGameState();
    gameEngine.resetGame(newState);
    updateGameState();
  }, [gameEngine, updateGameState]);

  const handleSquarePress = useCallback((position: Position) => {
    const currentState = gameEngine.getGameState();
    const piece = getPieceAt(currentState.board, position);

    if (currentState.selectedPiece) {
      // A piece is already selected
      const selectedPiece = currentState.selectedPiece;

      if (piece && piece.color === currentState.currentPlayer && 
          !positionsEqual(selectedPiece.position, position)) {
        // Select a different piece of the same color
        gameEngine.selectPiece(position);
        updateGameState();
      } else if (positionsEqual(selectedPiece.position, position)) {
        // Click on the same piece - deselect
        gameEngine.clearSelection();
        updateGameState();
      } else {
        // Try to make a move
        const moveSuccessful = gameEngine.makeMove(selectedPiece.position, position);
        
        if (moveSuccessful) {
          updateGameState();
          
          // Check for game end conditions
          const newState = gameEngine.getGameState();
          if (newState.gameStatus === 'checkmate') {
            setTimeout(() => {
              Alert.alert(
                '游戲結束',
                `${newState.winner === 'red' ? '紅方' : '黑方'}獲勝！`,
                [
                  { 
                    text: '新游戲', 
                    onPress: handleNewGame 
                  },
                  { 
                    text: '確定', 
                    style: 'cancel' 
                  }
                ]
              );
            }, 100);
          } else if (newState.gameStatus === 'stalemate') {
            setTimeout(() => {
              Alert.alert(
                '游戲結束',
                '和棋！',
                [
                  { 
                    text: '新游戲', 
                    onPress: handleNewGame 
                  },
                  { 
                    text: '確定', 
                    style: 'cancel' 
                  }
                ]
              );
            }, 100);
          }
        } else {
          // Invalid move - clear selection
          gameEngine.clearSelection();
          updateGameState();
        }
      }
    } else {
      // No piece selected - try to select one
      if (piece && piece.color === currentState.currentPlayer) {
        gameEngine.selectPiece(position);
        updateGameState();
      }
    }
  }, [gameEngine, updateGameState, handleNewGame]);

  const handleUndo = useCallback(() => {
    const success = gameEngine.undoLastMove();
    if (success) {
      updateGameState();
    }
  }, [gameEngine, updateGameState]);

  const handleShowHistory = useCallback(() => {
    setShowHistory(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setShowHistory(false);
  }, []);

  // Initialize game state on component mount
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#DEB887" 
        translucent={false} 
      />
      
      <View style={styles.gameContainer}>
        <GameBoard 
          gameState={gameState} 
          onSquarePress={handleSquarePress} 
        />
        
        <GameControls
          gameState={gameState}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onShowHistory={handleShowHistory}
        />
      </View>

      <MoveHistory
        visible={showHistory}
        moves={gameState.moveHistory}
        onClose={handleCloseHistory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEB887', // Burlywood
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default GameScreen;