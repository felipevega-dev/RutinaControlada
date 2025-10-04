import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import type { User } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo en el cliente
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

// Habilitar persistencia offline
if (typeof window !== "undefined" && db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Persistencia no disponible (múltiples tabs abiertos)");
    } else if (err.code === "unimplemented") {
      console.warn("Navegador no soporta persistencia");
    }
  });
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Guardar/actualizar perfil de usuario en Firestore
export const saveUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const userData: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
    photoURL: firebaseUser.photoURL || undefined,
    createdAt: userSnap.exists() ? userSnap.data().createdAt.toDate() : new Date(),
    lastLoginAt: new Date(),
  };

  await setDoc(
    userRef,
    {
      ...userData,
      lastLoginAt: serverTimestamp(),
      ...(userSnap.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return userData;
};

// Obtener perfil de usuario desde Firestore
export const getUserProfile = async (uid: string): Promise<User | null> => {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toDate() || new Date(),
    lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
  };
};

// Registro con email y password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  if (!auth) throw new Error("Firebase not initialized");

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  return saveUserProfile(credential.user);
};

// Login con email y password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error("Firebase not initialized");

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return saveUserProfile(credential.user);
};

// Login con Google
export const signInWithGoogle = async (): Promise<User> => {
  if (!auth) throw new Error("Firebase not initialized");

  const credential = await signInWithPopup(auth, googleProvider);
  return saveUserProfile(credential.user);
};

// Cerrar sesión
export const signOut = async () => {
  if (!auth) throw new Error("Firebase not initialized");
  await firebaseSignOut(auth);
};

// Observar cambios de autenticación
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) throw new Error("Firebase not initialized");

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await getUserProfile(firebaseUser.uid);
      callback(user);
    } else {
      callback(null);
    }
  });
};

export const getCurrentUserId = () => {
  return auth?.currentUser?.uid || null;
};

