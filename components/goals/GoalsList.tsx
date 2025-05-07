import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Goal } from '@/../context/AppContext';
import { formatDate } from '@/../utils/dateUtils';
import { Edit, Trash } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';

interface GoalsListProps {
  goals: Goal[];
}

export default function GoalsList({ goals }: GoalsListProps) {
  const { deleteGoal } = useAppContext();

  const handleEdit = (goal: Goal) => {
    // Implement edit functionality
    console.log('Edit goal:', goal);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
  };

  const renderGoalItem = ({ item }: { item: Goal }) => {
    const progress = (item.currentAmount / item.targetAmount) * 100;
    const targetDate = new Date(item.targetDate);
    const formattedDate = formatDate(item.targetDate);
    
    return (
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.actionButtons}>
            <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
              <Edit size={16} color="#0891b2" />
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Trash size={16} color="#ef4444" />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.goalInfo}>
          <Text style={styles.amountText}>
            {item.currentAmount.toFixed(2)} € / {item.targetAmount.toFixed(2)} €
          </Text>
          <Text style={styles.dateText}>Tavoitepäivä: {formattedDate}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, progress)}%`,
                  backgroundColor: item.color || '#0891b2', 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {goals.length > 0 ? (
        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ei tavoitteita</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  goalItem: {
    marginBottom: 16,
    backgroundColor: '#f8fafc', // Slate-50
    borderRadius: 8,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a', // Slate-900
  },
  goalInfo: {
    marginBottom: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155', // Slate-700
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b', // Slate-500
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e2e8f0', // Slate-200
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b', // Slate-500
    width: 50,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 6,
    backgroundColor: '#e0f2fe', // Cyan-100
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#fee2e2', // Red-100
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // Slate-500
  },
});