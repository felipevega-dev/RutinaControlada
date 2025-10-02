import Dexie, { type EntityTable } from "dexie";
import type { Exercise, Workout } from "@/types";

// Definir la base de datos
class RutinaDB extends Dexie {
  exercises!: EntityTable<Exercise, "id">;
  workouts!: EntityTable<Workout, "id">;

  constructor() {
    super("RutinaControlada");

    this.version(1).stores({
      exercises: "id, name, category, isCustom, createdAt",
      workouts: "id, startTime, endTime, duration",
    });
  }
}

export const db = new RutinaDB();

// Seed inicial de ejercicios predefinidos
export const seedInitialExercises = async () => {
  const count = await db.exercises.count();
  
  if (count === 0) {
    const initialExercises: Exercise[] = [
      {
        id: "ex-1",
        name: "Abdominales",
        category: "fuerza",
        isCustom: false,
        caloriesPerRep: 0.15,
        description: "Abdominales tradicionales",
        createdAt: new Date(),
      },
      {
        id: "ex-2",
        name: "Flexiones",
        category: "fuerza",
        isCustom: false,
        caloriesPerRep: 0.32,
        description: "Flexiones de pecho",
        createdAt: new Date(),
      },
      {
        id: "ex-3",
        name: "Sentadillas",
        category: "fuerza",
        isCustom: false,
        caloriesPerRep: 0.28,
        description: "Sentadillas sin peso",
        createdAt: new Date(),
      },
      {
        id: "ex-4",
        name: "Plancha",
        category: "fuerza",
        isCustom: false,
        caloriesPerMinute: 3.5,
        description: "Plancha isométrica",
        createdAt: new Date(),
      },
      {
        id: "ex-5",
        name: "Burpees",
        category: "cardio",
        isCustom: false,
        caloriesPerRep: 0.5,
        description: "Burpees completos",
        createdAt: new Date(),
      },
      {
        id: "ex-6",
        name: "Saltar la cuerda",
        category: "cardio",
        isCustom: false,
        caloriesPerMinute: 12,
        description: "Saltar la cuerda",
        createdAt: new Date(),
      },
      {
        id: "ex-7",
        name: "Estiramientos",
        category: "flexibilidad",
        isCustom: false,
        caloriesPerMinute: 2,
        description: "Rutina de estiramientos",
        createdAt: new Date(),
      },
    ];

    await db.exercises.bulkAdd(initialExercises);
  }
};

