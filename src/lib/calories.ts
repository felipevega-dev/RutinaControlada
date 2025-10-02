import type { Exercise, Set, WorkoutExercise } from "@/types";

export function calculateExerciseCalories(
  exercise: Exercise,
  sets: Set[]
): number {
  let totalCalories = 0;

  for (const set of sets) {
    if (exercise.caloriesPerRep && set.reps) {
      totalCalories += exercise.caloriesPerRep * set.reps;
    }
    if (exercise.caloriesPerMinute && set.durationSeconds) {
      totalCalories += (exercise.caloriesPerMinute * set.durationSeconds) / 60;
    }
  }

  return Math.round(totalCalories * 10) / 10;
}

export function calculateWorkoutCalories(
  exercises: WorkoutExercise[]
): number {
  return exercises.reduce((total, workoutEx) => {
    return total + calculateExerciseCalories(workoutEx.exercise, workoutEx.sets);
  }, 0);
}

