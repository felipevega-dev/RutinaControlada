"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useWorkoutStore } from "@/store/workoutStore";
import { formatTime } from "@/lib/utils";
import { Plus, Minus, StopCircle, Flame } from "lucide-react";
import { calculateExerciseCalories } from "@/lib/calories";

export default function EntrenamientoActivoPage() {
  const router = useRouter();
  const {
    isWorkoutActive,
    currentExercises,
    elapsedSeconds,
    updateElapsedTime,
    addSet,
    removeLastSet,
    stopWorkout,
  } = useWorkoutStore();

  const [repsInput, setRepsInput] = useState<Record<string, string>>({});
  const [timeInput, setTimeInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isWorkoutActive) {
      router.push("/entrenamiento");
      return;
    }

    const interval = setInterval(() => {
      updateElapsedTime(elapsedSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutActive, elapsedSeconds, updateElapsedTime, router]);

  const handleAddSet = (exerciseId: string, hasReps: boolean) => {
    if (hasReps) {
      const reps = parseInt(repsInput[exerciseId] || "0");
      if (reps > 0) {
        addSet(exerciseId, { reps });
        setRepsInput((prev) => ({ ...prev, [exerciseId]: "" }));
      }
    } else {
      const seconds = parseInt(timeInput[exerciseId] || "0");
      if (seconds > 0) {
        addSet(exerciseId, { durationSeconds: seconds });
        setTimeInput((prev) => ({ ...prev, [exerciseId]: "" }));
      }
    }
  };

  const handleFinish = async () => {
    if (confirm("¿Finalizar entrenamiento?")) {
      await stopWorkout();
      router.push("/");
    }
  };

  if (!isWorkoutActive) {
    return null;
  }

  return (
    <MainLayout title="Entrenamiento en Curso">
      <div className="p-4 space-y-6 max-w-screen-xl mx-auto">
        {/* Cronómetro */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none">
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-white mb-2">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-blue-100">Tiempo transcurrido</div>
          </div>
        </Card>

        {/* Ejercicios */}
        <div className="space-y-4">
          {currentExercises.map((workoutEx) => {
            const { exercise, sets } = workoutEx;
            const hasReps = exercise.caloriesPerRep !== undefined;
            const calories = calculateExerciseCalories(exercise, sets);

            return (
              <Card key={exercise.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {sets.length} set{sets.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="flex items-center text-orange-600 dark:text-orange-400">
                      <Flame className="w-4 h-4 mr-1" />
                      <span className="font-medium">{Math.round(calories)}</span>
                    </div>
                  </div>

                  {/* Sets registrados */}
                  {sets.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sets.map((set) => (
                        <div
                          key={set.setNumber}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300"
                        >
                          Set {set.setNumber}:{" "}
                          {set.reps
                            ? `${set.reps} reps`
                            : `${set.durationSeconds}s`}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input para nuevo set */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={hasReps ? "Repeticiones" : "Segundos"}
                      value={
                        hasReps
                          ? repsInput[exercise.id] || ""
                          : timeInput[exercise.id] || ""
                      }
                      onChange={(e) => {
                        if (hasReps) {
                          setRepsInput((prev) => ({
                            ...prev,
                            [exercise.id]: e.target.value,
                          }));
                        } else {
                          setTimeInput((prev) => ({
                            ...prev,
                            [exercise.id]: e.target.value,
                          }));
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleAddSet(exercise.id, hasReps)}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    {sets.length > 0 && (
                      <Button
                        variant="secondary"
                        onClick={() => removeLastSet(exercise.id)}
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Botón finalizar */}
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={handleFinish}
        >
          <StopCircle className="w-5 h-5 mr-2" />
          Finalizar Entrenamiento
        </Button>
      </div>
    </MainLayout>
  );
}

