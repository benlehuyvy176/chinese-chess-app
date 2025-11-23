import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GameState, Position } from '../types';
import ChessPiece from './ChessPiece';
import BoardSquare from './BoardSquare';
import { positionsEqual } from '../game';

interface GameBoardProps {
  gameState: GameState;
  onSquarePress: (position: Position) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const BOARD_PADDING = 20;
const BOARD_WIDTH = screenWidth - (BOARD_PADDING * 2);
const SQUARE_SIZE = BOARD_WIDTH / 9; // 9 columns

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onSquarePress }) => {
  const { board, selectedPiece, validMoves, moveHistory, currentPlayer } = gameState;
  
  // Get the last move for highlighting
  const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;

  const renderSquare = (row: number, col: number) => {
    const position: Position = { row, col };
    const piece = board[row][col];
    const isSelected = selectedPiece ? positionsEqual(selectedPiece.position, position) : false;
    const isValidMove = validMoves.some(move => positionsEqual(move, position));
    const isLastMove = lastMove ? 
      (positionsEqual(lastMove.from, position) || positionsEqual(lastMove.to, position)) : false;

    return (
      <BoardSquare
        key={`${row}-${col}`}
        position={position}
        isValidMove={isValidMove}
        isLastMove={isLastMove}
        onPress={() => onSquarePress(position)}
        size={SQUARE_SIZE}
      >
        {piece && (
          <ChessPiece
            piece={piece}
            isSelected={isSelected}
            onPress={() => onSquarePress(position)}
            size={SQUARE_SIZE}
          />
        )}
      </BoardSquare>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let row = 0; row < 10; row++) {
      const squares = [];
      for (let col = 0; col < 9; col++) {
        squares.push(renderSquare(row, col));
      }
      rows.push(
        <View key={row} style={styles.boardRow}>
          {squares}
        </View>
      );
    }
    return rows;
  };

  const renderRiverText = () => {
    return (
      <View style={[styles.riverContainer, { width: BOARD_WIDTH }]}>
        <View style={styles.riverSide}>
          <Text style={styles.riverText}>楚河</Text>
        </View>
        <View style={styles.riverSide}>
          <Text style={styles.riverText}>漢界</Text>
        </View>
      </View>
    );
  };

  const renderPlayerIndicator = () => {
    return (
      <View style={styles.playerIndicatorContainer}>
        <Text style={styles.playerIndicatorText}>
          當前玩家: {currentPlayer === 'red' ? '紅方 🔴' : '黑方 ⚫'}
        </Text>
        {gameState.gameStatus === 'check' && (
          <Text style={styles.checkText}>將軍! (Check!)</Text>
        )}
        {gameState.gameStatus === 'checkmate' && (
          <Text style={styles.checkmateText}>
            將死! {gameState.winner === 'red' ? '紅方' : '黑方'}獲勝!
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPlayerIndicator()}
      <View style={styles.boardContainer}>
        <View style={[styles.board, { width: BOARD_WIDTH, height: BOARD_WIDTH * 10/9 }]}>
          {renderBoard()}
        </View>
        <View style={[styles.riverOverlay, { top: SQUARE_SIZE * 4.2 }]}>
          {renderRiverText()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DEB887', // Burlywood background
    paddingTop: 20,
  },
  playerIndicatorContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  playerIndicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
  },
  checkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  checkmateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  boardContainer: {
    position: 'relative',
    padding: BOARD_PADDING,
    backgroundColor: '#F5DEB3', // Wheat color for board background
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  board: {
    backgroundColor: '#F5DEB3',
  },
  boardRow: {
    flexDirection: 'row',
  },
  riverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  riverSide: {
    alignItems: 'center',
  },
  riverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4169E1',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  riverOverlay: {
    position: 'absolute',
    left: BOARD_PADDING,
    right: BOARD_PADDING,
    height: SQUARE_SIZE,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
});

export default GameBoard;