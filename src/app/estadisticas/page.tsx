"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { getWorkouts } from "@/lib/db";
import { formatDuration } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Dumbbell, Flame, Clock } from "lucide-react";
import type { Workout } from "@/types";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

export default function EstadisticasPage() {
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
      <MainLayout title="Estadísticas">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  // Calcular estadísticas
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.totalCalories, 0);
  const avgDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  // Últimos 7 días
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    return {
      date,
      dateStr: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE", { locale: es }),
    };
  });

  const workoutsByDay = last7Days.map((day) => {
    const dayWorkouts = workouts.filter((w) => {
      const wDate = startOfDay(new Date(w.startTime));
      return wDate.getTime() === day.date.getTime();
    });

    return {
      day: day.label,
      entrenamientos: dayWorkouts.length,
      calorías: Math.round(
        dayWorkouts.reduce((sum, w) => sum + w.totalCalories, 0)
      ),
      minutos: Math.round(
        dayWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60
      ),
    };
  });

  // Ejercicios más usados
  const exerciseCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    w.exercises.forEach((ex) => {
      exerciseCounts[ex.exercise.name] =
        (exerciseCounts[ex.exercise.name] || 0) + 1;
    });
  });

  const topExercises = Object.entries(exerciseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <MainLayout title="Estadísticas">
      <div className="p-4 space-y-6 max-w-screen-xl mx-auto">
        {totalWorkouts === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No hay datos suficientes para mostrar estadísticas.
            </p>
          </Card>
        ) : (
          <>
            {/* Resumen general */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalWorkouts}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(totalCalories)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Calorías
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDuration(totalDuration)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDuration(avgDuration)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Promedio
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gráfico de entrenamientos por día */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Últimos 7 días
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={workoutsByDay}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="entrenamientos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico de calorías */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Calorías quemadas
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={workoutsByDay}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calorías"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Ejercicios más usados */}
            {topExercises.length > 0 && (
              <Card>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Ejercicios más realizados
                </h3>
                <div className="space-y-3">
                  {topExercises.map((ex, idx) => (
                    <div key={ex.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ex.name}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {ex.count} {ex.count === 1 ? "vez" : "veces"}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

