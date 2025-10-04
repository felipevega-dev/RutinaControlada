"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useExerciseStore } from "@/store/exerciseStore";
import { Plus, Edit, Trash2, X, RefreshCw } from "lucide-react";
import type { Exercise, ExerciseCategory } from "@/types";
import { removeDuplicateExercises } from "@/lib/db";

export default function EjerciciosPage() {
  const { exercises, loadExercises, addExercise, updateExercise, deleteExercise } =
    useExerciseStore();
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [cleaning, setCleaning] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "fuerza" as ExerciseCategory,
    description: "",
    caloriesPerRep: "",
    caloriesPerMinute: "",
  });

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const handleCleanDuplicates = async () => {
    if (!confirm("¿Limpiar ejercicios duplicados?")) return;
    setCleaning(true);
    try {
      const removed = await removeDuplicateExercises();
      await loadExercises();
      alert(`Se eliminaron ${removed} duplicados`);
    } catch (error) {
      console.error("Error limpiando duplicados:", error);
      alert("Error al limpiar duplicados");
    }
    setCleaning(false);
  };

  const handleOpenForm = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      setFormData({
        name: exercise.name,
        category: exercise.category,
        description: exercise.description || "",
        caloriesPerRep: exercise.caloriesPerRep?.toString() || "",
        caloriesPerMinute: exercise.caloriesPerMinute?.toString() || "",
      });
    } else {
      setEditingExercise(null);
      setFormData({
        name: "",
        category: "fuerza",
        description: "",
        caloriesPerRep: "",
        caloriesPerMinute: "",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExercise(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const exerciseData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      isCustom: true,
      caloriesPerRep: formData.caloriesPerRep
        ? parseFloat(formData.caloriesPerRep)
        : undefined,
      caloriesPerMinute: formData.caloriesPerMinute
        ? parseFloat(formData.caloriesPerMinute)
        : undefined,
    };

    if (editingExercise) {
      await updateExercise(editingExercise.id, exerciseData);
    } else {
      await addExercise(exerciseData);
    }

    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este ejercicio?")) {
      await deleteExercise(id);
    }
  };

  const customExercises = exercises.filter((ex) => ex.isCustom);
  const predefinedExercises = exercises.filter((ex) => !ex.isCustom);

  return (
    <MainLayout title="Gestión de Ejercicios">
      <div className="p-4 space-y-6 max-w-screen-xl mx-auto">
        {!showForm ? (
          <>
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={() => handleOpenForm()}>
                <Plus className="w-5 h-5 mr-2" />
                Agregar Ejercicio
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={handleCleanDuplicates}
                disabled={cleaning}
                className="shrink-0"
              >
                <RefreshCw className={`w-5 h-5 ${cleaning ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Ejercicios personalizados */}
            {customExercises.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Mis Ejercicios
                </h2>
                <div className="space-y-3">
                  {customExercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {exercise.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {exercise.category}
                          </p>
                          {exercise.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {exercise.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenForm(exercise)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exercise.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ejercicios predefinidos */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Ejercicios Predefinidos
              </h2>
              <div className="space-y-3">
                {predefinedExercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {exercise.category}
                      </p>
                      {exercise.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Formulario */
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingExercise ? "Editar" : "Nuevo"} Ejercicio
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ExerciseCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fuerza">Fuerza</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibilidad">Flexibilidad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cal. por repetición
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.caloriesPerRep}
                    onChange={(e) =>
                      setFormData({ ...formData, caloriesPerRep: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cal. por minuto
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.caloriesPerMinute}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caloriesPerMinute: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingExercise ? "Guardar Cambios" : "Crear Ejercicio"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseForm}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

