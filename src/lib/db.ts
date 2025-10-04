import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, getCurrentUserId } from "./firebase";
import type { Exercise, Workout } from "@/types";

// Helper: Convertir Timestamp de Firebase a Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Helper: Convertir Date a Timestamp
const dateToTimestamp = (date: Date) => Timestamp.fromDate(date);

// ========================
// EJERCICIOS
// ========================

export const getExercises = async (): Promise<Exercise[]> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const exercisesRef = collection(db, "users", userId, "exercises");
  const snapshot = await getDocs(exercisesRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as Exercise;
  });
};

export const addExercise = async (
  exercise: Omit<Exercise, "id" | "createdAt">
): Promise<string> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const exercisesRef = collection(db, "users", userId, "exercises");
  const docRef = await addDoc(exercisesRef, {
    ...exercise,
    createdAt: dateToTimestamp(new Date()),
  });

  return docRef.id;
};

export const updateExercise = async (
  id: string,
  updates: Partial<Exercise>
): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const exerciseRef = doc(db, "users", userId, "exercises", id);
  await updateDoc(exerciseRef, updates);
};

export const deleteExercise = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const exerciseRef = doc(db, "users", userId, "exercises", id);
  await deleteDoc(exerciseRef);
};

// ========================
// ENTRENAMIENTOS
// ========================

export const getWorkouts = async (): Promise<Workout[]> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const workoutsRef = collection(db, "users", userId, "workouts");
  const q = query(workoutsRef, orderBy("startTime", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startTime: timestampToDate(data.startTime),
      endTime: data.endTime ? timestampToDate(data.endTime) : undefined,
      exercises: data.exercises.map((ex: any) => ({
        ...ex,
        sets: ex.sets.map((set: any) => ({
          ...set,
          timestamp: timestampToDate(set.timestamp),
        })),
      })),
    } as Workout;
  });
};

export const getWorkout = async (id: string): Promise<Workout | null> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const workoutRef = doc(db, "users", userId, "workouts", id);
  const snapshot = await getDoc(workoutRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    startTime: timestampToDate(data.startTime),
    endTime: data.endTime ? timestampToDate(data.endTime) : undefined,
    exercises: data.exercises.map((ex: any) => ({
      ...ex,
      sets: ex.sets.map((set: any) => ({
        ...set,
        timestamp: timestampToDate(set.timestamp),
      })),
    })),
  } as Workout;
};

export const addWorkout = async (
  workout: Omit<Workout, "id">
): Promise<string> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const workoutsRef = collection(db, "users", userId, "workouts");
  
  // Convertir dates a timestamps
  const workoutData = {
    ...workout,
    startTime: dateToTimestamp(workout.startTime),
    endTime: workout.endTime ? dateToTimestamp(workout.endTime) : null,
    exercises: workout.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => ({
        ...set,
        timestamp: dateToTimestamp(set.timestamp),
      })),
    })),
  };

  const docRef = await addDoc(workoutsRef, workoutData);
  return docRef.id;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId || !db) throw new Error("No autenticado");

  const workoutRef = doc(db, "users", userId, "workouts", id);
  await deleteDoc(workoutRef);
};

// ========================
// SEED INICIAL
// ========================

export const seedInitialExercises = async () => {
  const userId = getCurrentUserId();
  if (!userId || !db) return;

  const exercises = await getExercises();
  
  // Solo sembrar si no hay ejercicios predefinidos
  const hasPredefined = exercises.some(ex => !ex.isCustom);
  
  if (!hasPredefined) {
    const initialExercises = [
      {
        name: "Abdominales",
        category: "fuerza" as const,
        isCustom: false,
        caloriesPerRep: 0.15,
        description: "Abdominales tradicionales",
      },
      {
        name: "Flexiones",
        category: "fuerza" as const,
        isCustom: false,
        caloriesPerRep: 0.32,
        description: "Flexiones de pecho",
      },
      {
        name: "Sentadillas",
        category: "fuerza" as const,
        isCustom: false,
        caloriesPerRep: 0.28,
        description: "Sentadillas sin peso",
      },
      {
        name: "Plancha",
        category: "fuerza" as const,
        isCustom: false,
        caloriesPerMinute: 3.5,
        description: "Plancha isométrica",
      },
      {
        name: "Burpees",
        category: "cardio" as const,
        isCustom: false,
        caloriesPerRep: 0.5,
        description: "Burpees completos",
      },
      {
        name: "Saltar la cuerda",
        category: "cardio" as const,
        isCustom: false,
        caloriesPerMinute: 12,
        description: "Saltar la cuerda",
      },
      {
        name: "Estiramientos",
        category: "flexibilidad" as const,
        isCustom: false,
        caloriesPerMinute: 2,
        description: "Rutina de estiramientos",
      },
    ];

    // Verificar que no existan antes de agregarlos
    const existingNames = new Set(exercises.map(ex => ex.name.toLowerCase()));
    
    for (const exercise of initialExercises) {
      if (!existingNames.has(exercise.name.toLowerCase())) {
        await addExercise(exercise);
      }
    }
  }
};

// Función para limpiar duplicados (llamar manualmente si es necesario)
export const removeDuplicateExercises = async () => {
  const userId = getCurrentUserId();
  if (!userId || !db) return;

  const exercises = await getExercises();
  const seen = new Map<string, Exercise>();
  const toDelete: string[] = [];

  // Mantener el primero de cada nombre, marcar los demás para borrar
  exercises.forEach(exercise => {
    const key = exercise.name.toLowerCase();
    if (seen.has(key)) {
      // Si ya existe, marcar este para borrar
      toDelete.push(exercise.id);
    } else {
      seen.set(key, exercise);
    }
  });

  // Borrar duplicados
  for (const id of toDelete) {
    await deleteExercise(id);
  }

  return toDelete.length;
};
