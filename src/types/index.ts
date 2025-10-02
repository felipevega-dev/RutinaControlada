// Tipos de dominio

export type ExerciseCategory = "fuerza" | "cardio" | "flexibilidad";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom: boolean;
  caloriesPerMinute?: number; // Para cardio
  caloriesPerRep?: number; // Para fuerza
  description?: string;
  createdAt: Date;
}

export interface Set {
  setNumber: number;
  reps?: number; // Para ejercicios de fuerza
  durationSeconds?: number; // Para cardio/tiempo
  timestamp: Date;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // en segundos
  exercises: WorkoutExercise[];
  totalCalories: number;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // en segundos
  totalCalories: number;
  totalSets: number;
  totalReps: number;
  averageWorkoutDuration: number;
  mostUsedExercises: Array<{ exercise: Exercise; count: number }>;
  workoutsByDay: Array<{ date: string; count: number }>;
  caloriesByDay: Array<{ date: string; calories: number }>;
}

