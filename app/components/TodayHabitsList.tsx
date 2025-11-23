import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Habit,
  DailyCompletion,
  getWeeklyProgress,
  formatDate,
  getProgressColor,
} from '../utils/habitStorage';

interface TodayHabitsListProps {
  habits: Habit[];
  allCompletions: { [date: string]: DailyCompletion };
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

const TodayHabitsList: React.FC<TodayHabitsListProps> = ({
  habits,
  allCompletions,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit,
}) => {
  const today = formatDate(new Date());

  const handleLongPress = (habit: Habit) => {
    Alert.alert(
      habit.name,
      'Manage habit',
      [
        {
          text: 'Edit',
          onPress: () => onEditHabit(habit),
        },
        {
          text: 'Delete',
          onPress: () => {
            Alert.alert(
              'Delete Habit',
              `Delete "${habit.name}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => onDeleteHabit(habit.id),
                },
              ]
            );
          },
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No habits yet</Text>
        <Text style={styles.emptySubtext}>
          Tap + to create your first habit
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {habits.map(habit => {
        const isCompleted = allCompletions[today]?.completions[habit.id] || false;
        const weeklyProgress = getWeeklyProgress(habit.id, allCompletions);
        const progressColor = getProgressColor(weeklyProgress, habit.weeklyGoal);

        return (
          <TouchableOpacity
            key={habit.id}
            style={styles.habitCard}
            onPress={() => onToggleCompletion(habit.id, today)}
            onLongPress={() => handleLongPress(habit)}
            activeOpacity={0.7}
          >
            <View style={styles.habitContent}>
              <View style={styles.checkbox}>
                {isCompleted && <View style={styles.checkmark} />}
              </View>

              <View style={styles.habitInfo}>
                <Text style={[styles.habitName, isCompleted && styles.habitNameCompleted]}>
                  {habit.name}
                </Text>
                <Text style={styles.weeklyProgress}>
                  {weeklyProgress}/{habit.weeklyGoal} this week
                </Text>
              </View>

              <View style={[styles.statusIndicator, { backgroundColor: progressColor }]} />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#bbb',
    textAlign: 'center',
  },
  habitCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  habitNameCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  weeklyProgress: {
    fontSize: 14,
    color: '#888',
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginLeft: 12,
  },
});

export default TodayHabitsList;
