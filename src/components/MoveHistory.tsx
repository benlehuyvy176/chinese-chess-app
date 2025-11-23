import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Modal, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Move } from '../types';

interface MoveHistoryProps {
  visible: boolean;
  moves: Move[];
  onClose: () => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ visible, moves, onClose }) => {
  const formatMove = (move: Move, index: number): string => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isRedMove = index % 2 === 0;
    const player = isRedMove ? '紅' : '黑';
    
    return `${moveNumber}. ${player}: ${move.notation || 'Unknown'}`;
  };

  const renderMoveList = () => {
    if (moves.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暫無棋譜記錄</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.movesList} showsVerticalScrollIndicator={true}>
        {moves.map((move, index) => (
          <View key={index} style={styles.moveItem}>
            <Text style={styles.moveText}>{formatMove(move, index)}</Text>
            {move.capturedPiece && (
              <Text style={styles.captureText}> (吃{move.capturedPiece.type})</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>棋譜記錄</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>關閉</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>總步數: {moves.length}</Text>
            <Text style={styles.statsText}>
              回合數: {Math.ceil(moves.length / 2)}
            </Text>
          </View>

          {renderMoveList()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#DEB887', // Burlywood
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle brown
  },
  closeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#CD853F', // Peru
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F5DEB3', // Wheat
    borderRadius: 10,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A0522D', // Sienna
  },
  movesList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  moveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    borderLeftWidth: 3,
    borderLeftColor: '#DEB887',
  },
  moveText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'monospace', // For better alignment of move numbers
  },
  captureText: {
    fontSize: 14,
    color: '#DC143C', // Crimson for captures
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    fontStyle: 'italic',
  },
});

export default MoveHistory;