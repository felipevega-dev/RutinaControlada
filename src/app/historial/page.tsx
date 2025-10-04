"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { getWorkouts } from "@/lib/db";
import { formatDuration } from "@/lib/utils";
import { Calendar, Clock, Flame, ChevronRight } from "lucide-react";
import type { Workout } from "@/types";

export default function HistorialPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const allWorkouts = await getWorkouts();
      setWorkouts(allWorkouts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading workouts:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Historial">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Historial">
      <div className="p-4 space-y-4 max-w-screen-xl mx-auto">
        {workouts.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No hay entrenamientos registrados aún.
            </p>
          </Card>
        ) : (
          workouts.map((workout) => {
            const totalSets = workout.exercises.reduce(
              (sum, ex) => sum + ex.sets.length,
              0
            );

            return (
              <Card
                key={workout.id}
                onClick={() => router.push(`/historial/${workout.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(workout.startTime).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-gray-700 dark:text-gray-300">
                        {workout.exercises.length} ejercicio
                        {workout.exercises.length !== 1 ? "s" : ""} • {totalSets}{" "}
                        set{totalSets !== 1 ? "s" : ""}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(workout.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {Math.round(workout.totalCalories)} cal
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </MainLayout>
  );
}

