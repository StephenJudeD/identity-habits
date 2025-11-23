import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import HabitsGrid from '../components/HabitsGrid';
import AddHabitModal from '../components/AddHabitModal';
import {
  Habit,
  DailyCompletion,
  loadHabits,
  saveHabits,
  loadDailyCompletions,
  toggleHabitCompletion,
  deleteHabit as deleteHabitFromStorage,
  getWeekDates,
} from '../utils/habitStorage';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCompletions, setAllCompletions] = useState<{
    [date: string]: DailyCompletion;
  }>({});
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
    setWeekDates(getWeekDates());
  }, []);

  const loadData = async () => {
    const loadedHabits = await loadHabits();
    const loadedCompletions = await loadDailyCompletions();
    setHabits(loadedHabits);
    setAllCompletions(loadedCompletions);
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setModalVisible(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  };

  const handleSaveHabit = async (name: string, weeklyGoal: number) => {
    if (editingHabit) {
      // Update existing habit
      const updatedHabit: Habit = {
        ...editingHabit,
        name,
        weeklyGoal,
      };

      const updatedHabits = habits.map(h =>
        h.id === updatedHabit.id ? updatedHabit : h
      );

      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } else {
      // Create new habit
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        weeklyGoal,
        createdDate: new Date().toISOString(),
      };

      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    }

    setModalVisible(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabitFromStorage(habitId);
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
  };

  const handleToggleCompletion = async (habitId: string, date: string) => {
    await toggleHabitCompletion(habitId, date);
    const updatedCompletions = await loadDailyCompletions();
    setAllCompletions(updatedCompletions);
  };

  const getTodayDate = (): string => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Identity Habits</Text>
          <Text style={styles.subtitle}>{getTodayDate()}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <HabitsGrid
          habits={habits}
          allCompletions={allCompletions}
          weekDates={weekDates}
          onToggleCompletion={handleToggleCompletion}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </ScrollView>

      <AddHabitModal
        visible={modalVisible}
        editingHabit={editingHabit}
        onSave={handleSaveHabit}
        onCancel={() => {
          setModalVisible(false);
          setEditingHabit(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
  },
});
