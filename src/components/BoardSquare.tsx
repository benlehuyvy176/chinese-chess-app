import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Position } from '../types';

interface BoardSquareProps {
  position: Position;
  isValidMove?: boolean;
  isLastMove?: boolean;
  onPress: () => void;
  size: number;
  children?: React.ReactNode;
}

const BoardSquare: React.FC<BoardSquareProps> = ({
  position,
  isValidMove = false,
  isLastMove = false,
  onPress,
  size,
  children,
}) => {
  const { row, col } = position;
  
  // Determine if this square should show grid lines
  const showTopLine = row > 0;
  const showBottomLine = row < 9;
  const showLeftLine = col > 0;
  const showRightLine = col < 8;
  
  // Palace diagonal lines (for positions 3,3 to 5,5 and 3,7 to 5,9)
  const isInPalace = (row >= 0 && row <= 2 && col >= 3 && col <= 5) ||
                     (row >= 7 && row <= 9 && col >= 3 && col <= 5);
  
  const showDiagonal1 = isInPalace && 
    ((row === 0 && col === 3) || (row === 1 && col === 4) || (row === 2 && col === 5) ||
     (row === 7 && col === 3) || (row === 8 && col === 4) || (row === 9 && col === 5));
  
  const showDiagonal2 = isInPalace && 
    ((row === 0 && col === 5) || (row === 1 && col === 4) || (row === 2 && col === 3) ||
     (row === 7 && col === 5) || (row === 8 && col === 4) || (row === 9 && col === 3));

  // River line (between rows 4 and 5)
  const showRiverTop = row === 4;
  const showRiverBottom = row === 5;

  const squareStyle = [
    styles.square,
    {
      width: size,
      height: size,
    },
    isValidMove && styles.validMoveSquare,
    isLastMove && styles.lastMoveSquare,
  ];

  const gridStyle = [
    styles.gridLines,
    {
      width: size,
      height: size,
    },
    showTopLine && styles.topLine,
    showBottomLine && styles.bottomLine,
    showLeftLine && styles.leftLine,
    showRightLine && styles.rightLine,
    showDiagonal1 && styles.diagonal1,
    showDiagonal2 && styles.diagonal2,
    showRiverTop && styles.riverTop,
    showRiverBottom && styles.riverBottom,
  ];

  return (
    <TouchableOpacity
      style={squareStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={gridStyle} />
      {isValidMove && <View style={styles.validMoveIndicator} />}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  validMoveSquare: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)', // Light green tint
  },
  lastMoveSquare: {
    backgroundColor: 'rgba(255, 255, 0, 0.3)', // Light yellow tint
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topLine: {
    borderTopWidth: 1,
    borderTopColor: '#8B4513', // Brown color
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  leftLine: {
    borderLeftWidth: 1,
    borderLeftColor: '#8B4513',
  },
  rightLine: {
    borderRightWidth: 1,
    borderRightColor: '#8B4513',
  },
  riverTop: {
    borderBottomWidth: 3,
    borderBottomColor: '#4169E1', // Royal blue for river
  },
  riverBottom: {
    borderTopWidth: 3,
    borderTopColor: '#4169E1',
  },
  diagonal1: {
    // This would need custom drawing or SVG for diagonal lines
    // For now, we'll use a background pattern
  },
  diagonal2: {
    // This would need custom drawing or SVG for diagonal lines
  },
  validMoveIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    opacity: 0.8,
  },
});

export default BoardSquare;