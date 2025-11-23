import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import TodayHabitsList from '../components/TodayHabitsList';
import AddHabitModal from '../components/AddHabitModal';
import {
  Habit,
  DailyCompletion,
  loadHabits,
  saveHabits,
  loadDailyCompletions,
  toggleHabitCompletion,
  deleteHabit as deleteHabitFromStorage,
} from '../utils/habitStorage';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCompletions, setAllCompletions] = useState<{
    [date: string]: DailyCompletion;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
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
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>{getTodayDate()}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TodayHabitsList
        habits={habits}
        allCompletions={allCompletions}
        onToggleCompletion={handleToggleCompletion}
        onEditHabit={handleEditHabit}
        onDeleteHabit={handleDeleteHabit}
      />

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
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2196F3',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
});
