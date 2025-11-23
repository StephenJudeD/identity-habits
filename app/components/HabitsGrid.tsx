import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Habit,
  DailyCompletion,
  getWeeklyProgress,
  getHabitCompletionForDate,
  formatDate,
  getCurrentStreak,
  getProgressColor,
} from '../utils/habitStorage';

interface HabitsGridProps {
  habits: Habit[];
  allCompletions: { [date: string]: DailyCompletion };
  weekDates: string[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

const HabitsGrid: React.FC<HabitsGridProps> = ({
  habits,
  allCompletions,
  weekDates,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit,
}) => {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleLongPress = (habit: Habit) => {
    Alert.alert(
      habit.name,
      'What would you like to do?',
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
              `Are you sure you want to delete "${habit.name}"?`,
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
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.habitHeader}>HABIT</Text>
        {dayLabels.map((day, index) => (
          <Text key={index} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
        <Text style={styles.goalHeader}>GOAL</Text>
      </View>

      {/* Habit Rows */}
      {habits.map(habit => {
        const weeklyProgress = getWeeklyProgress(habit.id, allCompletions);
        const today = formatDate(new Date());
        const currentStreak = getCurrentStreak(habit.id, habit.weeklyGoal, allCompletions);
        const progressColor = getProgressColor(weeklyProgress, habit.weeklyGoal);
        const progressPercentage = habit.weeklyGoal > 0
          ? (weeklyProgress / habit.weeklyGoal) * 100
          : 0;

        return (
          <View key={habit.id} style={styles.habitContainer}>
            <TouchableOpacity
              onLongPress={() => handleLongPress(habit)}
              activeOpacity={0.7}
            >
              <View style={styles.habitRow}>
                <View style={styles.habitNameContainer}>
                  <Text style={styles.habitName} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  {currentStreak > 0 && (
                    <Text style={styles.streakText}>
                      {currentStreak} week streak
                    </Text>
                  )}
                </View>

                {weekDates.map((date, index) => {
                  const isCompleted = getHabitCompletionForDate(
                    habit.id,
                    date,
                    allCompletions
                  );
                  const isToday = date === today;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        isCompleted && styles.completedCell,
                        isToday && styles.todayCell,
                      ]}
                      onPress={() => onToggleCompletion(habit.id, date)}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          isCompleted && styles.completedText,
                        ]}
                      >
                        {isCompleted ? '✓' : 'O'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.goalCell}>
                  <Text style={[styles.goalText, { color: progressColor }]}>
                    {weeklyProgress}/{habit.weeklyGoal}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(progressPercentage, 100)}%`,
                      backgroundColor: progressColor,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  habitHeader: {
    width: 100,
    paddingLeft: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  dayHeader: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  goalHeader: {
    width: 50,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  habitContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  habitNameContainer: {
    width: 100,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  streakText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: 2,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  completedCell: {
    backgroundColor: '#4CAF50',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  cellText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  completedText: {
    color: '#fff',
  },
  goalCell: {
    width: 50,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
});

export default HabitsGrid;
