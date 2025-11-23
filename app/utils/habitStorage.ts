import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  name: string;
  weeklyGoal: number;
  createdDate: string;
}

export interface DailyCompletion {
  date: string;
  completions: {
    [habitId: string]: boolean;
  };
}

const HABITS_KEY = 'habits';
const DAILY_COMPLETIONS_KEY = 'dailyCompletions';

// Habit CRUD operations
export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

export const addHabit = async (habit: Habit): Promise<void> => {
  const habits = await loadHabits();
  habits.push(habit);
  await saveHabits(habits);
};

export const updateHabit = async (updatedHabit: Habit): Promise<void> => {
  const habits = await loadHabits();
  const index = habits.findIndex(h => h.id === updatedHabit.id);
  if (index !== -1) {
    habits[index] = updatedHabit;
    await saveHabits(habits);
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  const habits = await loadHabits();
  const filtered = habits.filter(h => h.id !== habitId);
  await saveHabits(filtered);
};

// Daily completion operations
export const loadDailyCompletions = async (): Promise<{ [date: string]: DailyCompletion }> => {
  try {
    const data = await AsyncStorage.getItem(DAILY_COMPLETIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading daily completions:', error);
    return {};
  }
};

export const saveDailyCompletions = async (
  completions: { [date: string]: DailyCompletion }
): Promise<void> => {
  try {
    await AsyncStorage.setItem(DAILY_COMPLETIONS_KEY, JSON.stringify(completions));
  } catch (error) {
    console.error('Error saving daily completions:', error);
  }
};

export const toggleHabitCompletion = async (
  habitId: string,
  date: string
): Promise<void> => {
  const allCompletions = await loadDailyCompletions();

  if (!allCompletions[date]) {
    allCompletions[date] = {
      date,
      completions: {},
    };
  }

  const currentValue = allCompletions[date].completions[habitId] || false;
  allCompletions[date].completions[habitId] = !currentValue;

  await saveDailyCompletions(allCompletions);
};

export const getHabitCompletionForDate = (
  habitId: string,
  date: string,
  allCompletions: { [date: string]: DailyCompletion }
): boolean => {
  return allCompletions[date]?.completions[habitId] || false;
};

// Date utilities
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekDates = (): string[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate days to Monday

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    dates.push(formatDate(date));
  }

  return dates;
};

export const getWeeklyProgress = (
  habitId: string,
  allCompletions: { [date: string]: DailyCompletion }
): number => {
  const weekDates = getWeekDates();
  let completedCount = 0;

  weekDates.forEach(date => {
    if (getHabitCompletionForDate(habitId, date, allCompletions)) {
      completedCount++;
    }
  });

  return completedCount;
};
