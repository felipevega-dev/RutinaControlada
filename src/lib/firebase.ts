import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, type Auth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore";

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

// Autenticación anónima automática
export const initAuth = () => {
  return new Promise<string>((resolve, reject) => {
    if (!auth) {
      reject(new Error("Firebase not initialized"));
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        try {
          const credential = await signInAnonymously(auth!);
          resolve(credential.user.uid);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

export const getCurrentUserId = () => {
  return auth?.currentUser?.uid || null;
};

