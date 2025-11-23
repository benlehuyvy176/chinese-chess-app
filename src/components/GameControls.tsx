import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GameState } from '../types';

interface GameControlsProps {
  gameState: GameState;
  onNewGame: () => void;
  onUndo: () => void;
  onShowHistory: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onNewGame,
  onUndo,
  onShowHistory,
}) => {
  const { moveHistory, gameStatus, winner } = gameState;

  const handleNewGame = () => {
    if (moveHistory.length > 0) {
      Alert.alert(
        '新游戲',
        '確定要開始新游戲嗎？當前進度將丟失。',
        [
          { text: '取消', style: 'cancel' },
          { text: '確定', onPress: onNewGame },
        ]
      );
    } else {
      onNewGame();
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) {
      Alert.alert('提示', '沒有可撤銷的步數');
      return;
    }
    
    if (gameStatus === 'checkmate') {
      Alert.alert('提示', '游戲已結束，無法撤銷');
      return;
    }

    onUndo();
  };

  const getGameStatusText = () => {
    switch (gameStatus) {
      case 'check':
        return '將軍!';
      case 'checkmate':
        return `${winner === 'red' ? '紅方' : '黑方'}獲勝!`;
      case 'stalemate':
        return '和棋';
      default:
        return '游戲進行中';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getGameStatusText()}</Text>
        <Text style={styles.moveCountText}>
          步數: {moveHistory.length}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.newGameButton]}
          onPress={handleNewGame}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>新游戲</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.undoButton,
            moveHistory.length === 0 && styles.disabledButton
          ]}
          onPress={handleUndo}
          disabled={moveHistory.length === 0}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            moveHistory.length === 0 && styles.disabledButtonText
          ]}>
            悔棋
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.historyButton,
            moveHistory.length === 0 && styles.disabledButton
          ]}
          onPress={onShowHistory}
          disabled={moveHistory.length === 0}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            moveHistory.length === 0 && styles.disabledButtonText
          ]}>
            棋譜
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5DEB3',
    borderRadius: 10,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
  },
  moveCountText: {
    fontSize: 14,
    color: '#A0522D',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  newGameButton: {
    backgroundColor: '#32CD32', // Lime green
  },
  undoButton: {
    backgroundColor: '#FFD700', // Gold
  },
  historyButton: {
    backgroundColor: '#87CEEB', // Sky blue
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Light gray
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#A0A0A0', // Dark gray
  },
});

export default GameControls;