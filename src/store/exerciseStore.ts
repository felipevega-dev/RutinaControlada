import { create } from "zustand";
import type { Exercise } from "@/types";
import {
  getExercises,
  addExercise as addExerciseDb,
  updateExercise as updateExerciseDb,
  deleteExercise as deleteExerciseDb,
  seedInitialExercises,
} from "@/lib/db";

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  
  // Acciones
  loadExercises: () => Promise<void>;
  addExercise: (exercise: Omit<Exercise, "id" | "createdAt">) => Promise<void>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  isLoading: false,

  loadExercises: async () => {
    set({ isLoading: true });
    try {
      await seedInitialExercises();
      const exercises = await getExercises();
      set({ exercises, isLoading: false });
    } catch (error) {
      console.error("Error loading exercises:", error);
      set({ isLoading: false });
    }
  },

  addExercise: async (exerciseData) => {
    const id = await addExerciseDb(exerciseData);
    const newExercise: Exercise = {
      ...exerciseData,
      id,
      createdAt: new Date(),
    };

    set((state) => ({
      exercises: [...state.exercises, newExercise],
    }));
  },

  updateExercise: async (id, updates) => {
    await updateExerciseDb(id, updates);
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === id ? { ...ex, ...updates } : ex
      ),
    }));
  },

  deleteExercise: async (id) => {
    await deleteExerciseDb(id);
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex.id !== id),
    }));
  },
}));

