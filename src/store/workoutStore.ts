import { create } from "zustand";
import type { Exercise, Set, WorkoutExercise, Workout } from "@/types";
import { db } from "@/lib/db";
import { calculateWorkoutCalories } from "@/lib/calories";

interface WorkoutState {
  // Estado del entrenamiento en curso
  isWorkoutActive: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  selectedExercises: Exercise[];
  currentExercises: WorkoutExercise[];
  
  // Acciones
  startWorkout: (exercises: Exercise[]) => void;
  stopWorkout: () => Promise<void>;
  addSet: (exerciseId: string, set: Omit<Set, "setNumber" | "timestamp">) => void;
  removeLastSet: (exerciseId: string) => void;
  updateElapsedTime: (seconds: number) => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  isWorkoutActive: false,
  startTime: null,
  elapsedSeconds: 0,
  selectedExercises: [],
  currentExercises: [],

  startWorkout: (exercises) => {
    const now = new Date();
    set({
      isWorkoutActive: true,
      startTime: now,
      elapsedSeconds: 0,
      selectedExercises: exercises,
      currentExercises: exercises.map((ex) => ({
        exercise: ex,
        sets: [],
      })),
    });
  },

  stopWorkout: async () => {
    const state = get();
    if (!state.isWorkoutActive || !state.startTime) return;

    const endTime = new Date();
    const workout: Workout = {
      id: `workout-${Date.now()}`,
      startTime: state.startTime,
      endTime,
      duration: state.elapsedSeconds,
      exercises: state.currentExercises,
      totalCalories: calculateWorkoutCalories(state.currentExercises),
    };

    await db.workouts.add(workout);

    set({
      isWorkoutActive: false,
      startTime: null,
      elapsedSeconds: 0,
      selectedExercises: [],
      currentExercises: [],
    });
  },

  addSet: (exerciseId, setData) => {
    set((state) => {
      const exercises = [...state.currentExercises];
      const exerciseIndex = exercises.findIndex(
        (ex) => ex.exercise.id === exerciseId
      );

      if (exerciseIndex === -1) return state;

      const exercise = exercises[exerciseIndex];
      const newSet: Set = {
        setNumber: exercise.sets.length + 1,
        timestamp: new Date(),
        ...setData,
      };

      exercises[exerciseIndex] = {
        ...exercise,
        sets: [...exercise.sets, newSet],
      };

      return { currentExercises: exercises };
    });
  },

  removeLastSet: (exerciseId) => {
    set((state) => {
      const exercises = [...state.currentExercises];
      const exerciseIndex = exercises.findIndex(
        (ex) => ex.exercise.id === exerciseId
      );

      if (exerciseIndex === -1) return state;

      const exercise = exercises[exerciseIndex];
      if (exercise.sets.length === 0) return state;

      exercises[exerciseIndex] = {
        ...exercise,
        sets: exercise.sets.slice(0, -1),
      };

      return { currentExercises: exercises };
    });
  },

  updateElapsedTime: (seconds) => {
    set({ elapsedSeconds: seconds });
  },

  resetWorkout: () => {
    set({
      isWorkoutActive: false,
      startTime: null,
      elapsedSeconds: 0,
      selectedExercises: [],
      currentExercises: [],
    });
  },
}));

