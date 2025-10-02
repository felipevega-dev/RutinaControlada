"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useExerciseStore } from "@/store/exerciseStore";
import { useWorkoutStore } from "@/store/workoutStore";
import { Check, Play } from "lucide-react";
import type { Exercise } from "@/types";

export default function EntrenamientoPage() {
  const router = useRouter();
  const { exercises, loadExercises } = useExerciseStore();
  const { isWorkoutActive, startWorkout } = useWorkoutStore();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  useEffect(() => {
    if (isWorkoutActive) {
      router.push("/entrenamiento/activo");
    }
  }, [isWorkoutActive, router]);

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((ex) => ex.id === exercise.id);
      if (isSelected) {
        return prev.filter((ex) => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) return;
    startWorkout(selectedExercises);
  };

  const categories = {
    fuerza: exercises.filter((ex) => ex.category === "fuerza"),
    cardio: exercises.filter((ex) => ex.category === "cardio"),
    flexibilidad: exercises.filter((ex) => ex.category === "flexibilidad"),
  };

  return (
    <MainLayout title="Nuevo Entrenamiento">
      <div className="p-4 space-y-6 max-w-screen-xl mx-auto">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Selecciona tus ejercicios
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seleccionados: {selectedExercises.length}
          </p>
        </div>

        {/* Fuerza */}
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">
            💪 Fuerza
          </h3>
          <div className="grid gap-3">
            {categories.fuerza.map((exercise) => {
              const isSelected = selectedExercises.some(
                (ex) => ex.id === exercise.id
              );
              return (
                <Card
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise)}
                  className={isSelected ? "ring-2 ring-blue-500" : ""}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </div>
                      {exercise.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {exercise.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cardio */}
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">
            🏃 Cardio
          </h3>
          <div className="grid gap-3">
            {categories.cardio.map((exercise) => {
              const isSelected = selectedExercises.some(
                (ex) => ex.id === exercise.id
              );
              return (
                <Card
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise)}
                  className={isSelected ? "ring-2 ring-blue-500" : ""}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </div>
                      {exercise.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {exercise.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Flexibilidad */}
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">
            🧘 Flexibilidad
          </h3>
          <div className="grid gap-3">
            {categories.flexibilidad.map((exercise) => {
              const isSelected = selectedExercises.some(
                (ex) => ex.id === exercise.id
              );
              return (
                <Card
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise)}
                  className={isSelected ? "ring-2 ring-blue-500" : ""}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </div>
                      {exercise.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {exercise.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Botón iniciar */}
        <div className="sticky bottom-20 pb-4">
          <Button
            size="lg"
            className="w-full"
            disabled={selectedExercises.length === 0}
            onClick={handleStartWorkout}
          >
            <Play className="w-5 h-5 mr-2" />
            Empezar Entrenamiento ({selectedExercises.length})
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

