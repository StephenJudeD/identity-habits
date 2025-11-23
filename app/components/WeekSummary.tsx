import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Habit,
  DailyCompletion,
  getWeeklyProgress,
} from '../utils/habitStorage';

interface WeekSummaryProps {
  habits: Habit[];
  allCompletions: { [date: string]: DailyCompletion };
}

const WeekSummary: React.FC<WeekSummaryProps> = ({ habits, allCompletions }) => {
  if (habits.length === 0) {
    return null;
  }

  // Calculate overall statistics
  let totalGoals = 0;
  let totalCompleted = 0;
  let habitsOnTrack = 0;
  let bestHabit: { name: string; progress: number } | null = null;
  let bestPercentage = 0;

  habits.forEach(habit => {
    const progress = getWeeklyProgress(habit.id, allCompletions);
    totalGoals += habit.weeklyGoal;
    totalCompleted += progress;

    const percentage = habit.weeklyGoal > 0 ? (progress / habit.weeklyGoal) * 100 : 0;

    if (progress >= habit.weeklyGoal) {
      habitsOnTrack++;
    }

    if (percentage > bestPercentage) {
      bestPercentage = percentage;
      bestHabit = { name: habit.name, progress };
    }
  });

  const overallPercentage = totalGoals > 0 ? Math.round((totalCompleted / totalGoals) * 100) : 0;
  const bestHabitName = (bestHabit as { name: string; progress: number } | null)?.name || '';
  const bestHabitPercentage = Math.round(bestPercentage);
  const showBestHabit = bestHabit !== null && bestPercentage > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalCompleted}/{totalGoals}</Text>
          <Text style={styles.statLabel}>Total Progress</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{overallPercentage}%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{habitsOnTrack}/{habits.length}</Text>
          <Text style={styles.statLabel}>On Track</Text>
        </View>
      </View>

      {showBestHabit && (
        <View style={styles.bestHabitContainer}>
          <Text style={styles.bestHabitLabel}>⭐ Best Performer:</Text>
          <Text style={styles.bestHabitName} numberOfLines={1}>
            {bestHabitName} ({bestHabitPercentage}%)
          </Text>
        </View>
      )}

      {overallPercentage < 50 && totalGoals > 0 && (
        <Text style={styles.encouragement}>
          💪 Keep going! You&apos;ve got this!
        </Text>
      )}

      {overallPercentage >= 100 && (
        <Text style={styles.celebration}>
          🎉 Amazing! All weekly goals completed!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bestHabitContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  bestHabitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  bestHabitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  encouragement: {
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
  },
  celebration: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default WeekSummary;
