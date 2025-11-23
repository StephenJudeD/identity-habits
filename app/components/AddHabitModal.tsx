import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Habit } from '../utils/habitStorage';

interface AddHabitModalProps {
  visible: boolean;
  editingHabit: Habit | null;
  onSave: (name: string, weeklyGoal: number) => void;
  onCancel: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  editingHabit,
  onSave,
  onCancel,
}) => {
  const [habitName, setHabitName] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  useEffect(() => {
    if (editingHabit) {
      setHabitName(editingHabit.name);
      setWeeklyGoal(editingHabit.weeklyGoal);
    } else {
      setHabitName('');
      setWeeklyGoal(5);
    }
  }, [editingHabit, visible]);

  const handleSave = () => {
    if (habitName.trim() === '') {
      return;
    }
    onSave(habitName.trim(), weeklyGoal);
    setHabitName('');
    setWeeklyGoal(5);
  };

  const incrementGoal = () => {
    if (weeklyGoal < 7) {
      setWeeklyGoal(weeklyGoal + 1);
    }
  };

  const decrementGoal = () => {
    if (weeklyGoal > 1) {
      setWeeklyGoal(weeklyGoal - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onCancel}
        />

        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {editingHabit ? 'Edit Habit' : 'Add New Habit'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Habit name (e.g., Gym, Read, Coffee Break)"
            value={habitName}
            onChangeText={setHabitName}
            autoFocus
          />

          <View style={styles.goalSection}>
            <Text style={styles.label}>Weekly Goal (days per week):</Text>

            <View style={styles.goalControls}>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  weeklyGoal <= 1 && styles.goalButtonDisabled,
                ]}
                onPress={decrementGoal}
                disabled={weeklyGoal <= 1}
              >
                <Text style={styles.goalButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.goalValue}>{weeklyGoal}</Text>

              <TouchableOpacity
                style={[
                  styles.goalButton,
                  weeklyGoal >= 7 && styles.goalButtonDisabled,
                ]}
                onPress={incrementGoal}
                disabled={weeklyGoal >= 7}
              >
                <Text style={styles.goalButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                habitName.trim() === '' && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={habitName.trim() === ''}
            >
              <Text style={styles.saveButtonText}>Save Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  goalSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  goalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalButtonDisabled: {
    backgroundColor: '#ccc',
  },
  goalButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  goalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 30,
    minWidth: 40,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddHabitModal;
