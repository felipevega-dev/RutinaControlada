"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { formatDuration } from "@/lib/utils";
import { Dumbbell, TrendingUp, Flame, Trophy } from "lucide-react";
import type { Workout } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    thisWeekWorkouts: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const allWorkouts = await db.workouts.toArray();
      const sortedWorkouts = allWorkouts.sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
      );

      // Calcular stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const thisWeek = allWorkouts.filter((w) => w.startTime >= weekAgo);

      setStats({
        totalWorkouts: allWorkouts.length,
        totalDuration: allWorkouts.reduce((sum, w) => sum + w.duration, 0),
        totalCalories: allWorkouts.reduce((sum, w) => sum + w.totalCalories, 0),
        thisWeekWorkouts: thisWeek.length,
      });

      setRecentWorkouts(sortedWorkouts.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Rutina Controlada">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Rutina Controlada">
      <div className="p-4 space-y-6 max-w-screen-xl mx-auto">
        {/* Botón principal */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/entrenamiento")}
        >
          <Dumbbell className="w-5 h-5 mr-2" />
          Nuevo Entrenamiento
        </Button>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center py-6">
            <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalWorkouts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Entrenamientos
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center py-6">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.thisWeekWorkouts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Esta semana
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center py-6">
            <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.totalCalories)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Calorías
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center py-6">
            <Dumbbell className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(stats.totalDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tiempo total
            </div>
          </Card>
        </div>

        {/* Entrenamientos recientes */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Entrenamientos Recientes
          </h2>
          {recentWorkouts.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                No hay entrenamientos aún. ¡Empieza tu primer entrenamiento!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  onClick={() => router.push(`/historial/${workout.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {workout.exercises.length} ejercicio
                        {workout.exercises.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(workout.startTime).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {formatDuration(workout.duration)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(workout.totalCalories)} cal
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
