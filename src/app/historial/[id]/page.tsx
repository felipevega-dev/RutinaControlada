"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getWorkout, deleteWorkout } from "@/lib/db";
import { formatDuration } from "@/lib/utils";
import { Calendar, Clock, Flame, ArrowLeft, Trash2 } from "lucide-react";
import type { Workout } from "@/types";
import { calculateExerciseCalories } from "@/lib/calories";

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkout();
  }, []);

  const loadWorkout = async () => {
    try {
      const w = await getWorkout(params.id);
      setWorkout(w);
      setLoading(false);
    } catch (error) {
      console.error("Error loading workout:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workout) return;
    if (confirm("¿Eliminar este entrenamiento?")) {
      await deleteWorkout(workout.id);
      router.push("/historial");
    }
  };

  if (loading) {
    return (
      <MainLayout title="Detalle">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  if (!workout) {
    return (
      <MainLayout title="Detalle">
        <div className="p-4">
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Entrenamiento no encontrado
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <MainLayout title="Detalle del Entrenamiento">
      <div className="p-4 space-y-4 max-w-screen-xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>

        {/* Resumen */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(workout.startTime).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Duración
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                  <Clock className="w-5 h-5" />
                  {formatDuration(workout.duration)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Calorías
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {Math.round(workout.totalCalories)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Ejercicios */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Ejercicios ({workout.exercises.length})
          </h2>
          <div className="space-y-3">
            {workout.exercises.map((workoutEx, idx) => {
              const calories = calculateExerciseCalories(
                workoutEx.exercise,
                workoutEx.sets
              );

              return (
                <Card key={idx}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {workoutEx.exercise.name}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {workoutEx.sets.length} set
                          {workoutEx.sets.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex items-center text-orange-600 dark:text-orange-400">
                        <Flame className="w-4 h-4 mr-1" />
                        <span className="font-medium">
                          {Math.round(calories)} cal
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {workoutEx.sets.map((set) => (
                        <div
                          key={set.setNumber}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                        >
                          <span className="font-medium">Set {set.setNumber}:</span>{" "}
                          {set.reps
                            ? `${set.reps} reps`
                            : `${set.durationSeconds}s`}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Botón eliminar */}
        <Button variant="danger" className="w-full" onClick={handleDelete}>
          <Trash2 className="w-5 h-5 mr-2" />
          Eliminar Entrenamiento
        </Button>
      </div>
    </MainLayout>
  );
}

