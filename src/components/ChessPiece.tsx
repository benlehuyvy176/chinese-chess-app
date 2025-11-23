import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Piece, PieceType, PlayerColor } from '../types';

interface ChessPieceProps {
  piece: Piece;
  isSelected?: boolean;
  onPress: () => void;
  size: number;
}

/**
 * Chinese characters for pieces
 */
const PIECE_CHARACTERS: Record<PlayerColor, Record<PieceType, string>> = {
  red: {
    general: '帥', // 帅 (simplified)
    advisor: '仕',
    elephant: '相',
    horse: '馬', // 马 (simplified)
    chariot: '車', // 车 (simplified)
    cannon: '炮',
    soldier: '兵',
  },
  black: {
    general: '將', // 将 (simplified)
    advisor: '士',
    elephant: '象',
    horse: '馬', // 马 (simplified)
    chariot: '車', // 车 (simplified)
    cannon: '砲',
    soldier: '卒',
  },
};

const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  isSelected = false, 
  onPress, 
  size 
}) => {
  const character = PIECE_CHARACTERS[piece.color][piece.type];
  
  const pieceStyle = [
    styles.piece,
    {
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: size * 0.4,
    },
    piece.color === 'red' ? styles.redPiece : styles.blackPiece,
    isSelected && styles.selectedPiece,
  ];

  const textStyle = [
    styles.pieceText,
    {
      fontSize: size * 0.35,
      lineHeight: size * 0.8,
    },
    piece.color === 'red' ? styles.redText : styles.blackText,
  ];

  return (
    <TouchableOpacity
      style={pieceStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{character}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  piece: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#f5f5dc', // Beige background
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  redPiece: {
    borderColor: '#8B0000', // Dark red border
  },
  blackPiece: {
    borderColor: '#2F2F2F', // Dark gray border
  },
  selectedPiece: {
    borderColor: '#FFD700', // Gold border for selection
    borderWidth: 3,
    backgroundColor: '#FFFACD', // Light yellow background
  },
  pieceText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  redText: {
    color: '#DC143C', // Crimson red
  },
  blackText: {
    color: '#000000', // Black
  },
});

export default ChessPiece;