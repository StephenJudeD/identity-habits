import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import HabitsGrid from '../components/HabitsGrid';
import {
  Habit,
  DailyCompletion,
  loadHabits,
  loadDailyCompletions,
  toggleHabitCompletion,
  getWeekDates,
} from '../utils/habitStorage';

export default function ProgressScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCompletions, setAllCompletions] = useState<{
    [date: string]: DailyCompletion;
  }>({});
  const [weekDates, setWeekDates] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    loadData();
    setWeekDates(getWeekDates());
  }, []);

  // Refresh data when screen gains focus
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const loadedHabits = await loadHabits();
    const loadedCompletions = await loadDailyCompletions();
    setHabits(loadedHabits);
    setAllCompletions(loadedCompletions);
  };

  const handleToggleCompletion = async (habitId: string, date: string) => {
    await toggleHabitCompletion(habitId, date);
    const updatedCompletions = await loadDailyCompletions();
    setAllCompletions(updatedCompletions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Weekly overview</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <HabitsGrid
          habits={habits}
          allCompletions={allCompletions}
          weekDates={weekDates}
          onToggleCompletion={handleToggleCompletion}
          onEditHabit={() => {}}
          onDeleteHabit={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});
