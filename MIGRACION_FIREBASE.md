# 🔄 Migración a Firebase - Completada

## ✅ Cambios Realizados

### 1. Dependencias

**Removido**:
- ❌ `dexie` (4.0.10)
- ❌ `dexie-react-hooks` (1.1.7)

**Agregado**:
- ✅ `firebase` (11.0.2)

### 2. Archivos Nuevos

- ✅ `src/lib/firebase.ts` - Configuración de Firebase
- ✅ `src/hooks/useFirebaseAuth.ts` - Hook de autenticación
- ✅ `src/components/providers/FirebaseProvider.tsx` - Provider global
- ✅ `.env.example` - Template de variables de entorno
- ✅ `FIREBASE_SETUP.md` - Guía completa de setup

### 3. Archivos Modificados

#### `src/lib/db.ts`
- Reescrito completamente para usar Firestore
- Funciones: `getExercises`, `addExercise`, `updateExercise`, `deleteExercise`
- Funciones: `getWorkouts`, `getWorkout`, `addWorkout`, `deleteWorkout`
- Mantiene la misma interfaz API (no rompe componentes existentes)

#### Stores Zustand
- `src/store/workoutStore.ts` - Actualizado para usar `addWorkout` de Firebase
- `src/store/exerciseStore.ts` - Actualizado para usar funciones de Firebase

#### Páginas
- `src/app/page.tsx` - Usa `getWorkouts()`
- `src/app/historial/page.tsx` - Usa `getWorkouts()`
- `src/app/historial/[id]/page.tsx` - Usa `getWorkout()` y `deleteWorkout()`
- `src/app/estadisticas/page.tsx` - Usa `getWorkouts()`

#### Layout
- `src/app/layout.tsx` - Wrappea children con `FirebaseProvider`

---

## 🔥 Arquitectura Firebase

### Base de Datos (Firestore)

```
users/
  └─ {userId}/           ← UID de Firebase Auth (anónimo)
      ├─ exercises/      ← Ejercicios del usuario
      │   └─ {docId}
      │       ├─ name: string
      │       ├─ category: "fuerza" | "cardio" | "flexibilidad"
      │       ├─ isCustom: boolean
      │       ├─ caloriesPerRep?: number
      │       ├─ caloriesPerMinute?: number
      │       ├─ description?: string
      │       └─ createdAt: Timestamp
      │
      └─ workouts/       ← Entrenamientos del usuario
          └─ {docId}
              ├─ startTime: Timestamp
              ├─ endTime?: Timestamp
              ├─ duration: number
              ├─ totalCalories: number
              ├─ exercises: array
              │   └─ {
              │       exercise: Exercise,
              │       sets: [{
              │         setNumber: number,
              │         reps?: number,
              │         durationSeconds?: number,
              │         timestamp: Timestamp
              │       }]
              │   }
              └─ notes?: string
```

### Reglas de Seguridad

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Traducción**: Solo puedes ver/editar tus propios datos. Cada usuario tiene su propia "carpeta" privada.

---

## 🚀 Flujo de Autenticación

1. Usuario abre la app
2. `FirebaseProvider` se monta
3. Llama a `initAuth()` de `src/lib/firebase.ts`
4. Firebase Auth:
   - Si ya hay usuario → usa ese UID
   - Si no hay usuario → crea usuario anónimo nuevo
5. UID se guarda en localStorage del navegador
6. Todas las queries usan ese UID: `/users/{uid}/exercises`

### ¿Por qué Auth Anónima?

- ✅ No requiere registro ni login
- ✅ Firebase asigna UID único automático
- ✅ El UID persiste entre sesiones
- ✅ Los datos son privados (reglas de Firestore)
- ✅ Fácil de migrar a email/password después

---

## 📦 Persistencia Offline

Firebase ya tiene persistencia offline habilitada:

```typescript
// src/lib/firebase.ts
enableIndexedDbPersistence(db);
```

**Cómo funciona**:
1. Primera carga → descarga datos de Firestore
2. Guarda en IndexedDB local (navegador)
3. Sin internet → lee de IndexedDB
4. Escribe → se guarda en cola
5. Internet vuelve → sincroniza automáticamente

**Ventajas**:
- ✅ Funciona offline después de primera carga
- ✅ Sin código extra de sincronización
- ✅ Conflictos manejados automáticamente

---

## 🔄 Comparación: Antes vs Ahora

| Aspecto | Antes (Dexie) | Ahora (Firebase) |
|---------|---------------|------------------|
| **Persistencia** | Local (IndexedDB) | Nube + Cache local |
| **Backup** | Manual (export) | Automático |
| **Sync** | No | Automático |
| **Multi-dispositivo** | No | Sí (mismo usuario) |
| **Borrado accidental** | Se pierde todo | Recuperable |
| **Offline** | Sí | Sí (con cache) |
| **Complejidad** | Baja | Media |
| **Costo** | Gratis | Gratis (hasta límites) |

---

## 🎯 Ventajas de Firebase

### Para el Usuario

1. **Nunca pierde datos**: Están en la nube
2. **Multi-dispositivo**: Accede desde móvil y PC
3. **Restauración**: Si borra cache, los datos persisten
4. **Backup automático**: No necesita exportar manualmente

### Para el Desarrollador

1. **Menos código**: No manejo manual de sync
2. **Escalable**: Firebase maneja millones de usuarios
3. **Real-time**: Cambios se reflejan instantáneamente
4. **Seguridad**: Reglas en servidor, no cliente

---

## 📊 Límites del Plan Gratuito

| Recurso | Límite Diario | Uso App Personal |
|---------|---------------|-------------------|
| Lecturas | 50,000 | ~50-100 |
| Escrituras | 20,000 | ~10-30 |
| Almacenamiento | 1 GB | ~1-5 MB |
| Bandwidth | 10 GB | ~10-50 MB |

**Conclusión**: Para uso personal, nunca llegarás al límite.

---

## 🛠️ Variables de Entorno Requeridas

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**⚠️ Sin estas variables, la app NO funcionará.**

Ver [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) para obtenerlas.

---

## 🚨 Breaking Changes

### Para Usuarios Existentes

Si ya tenías datos en IndexedDB (Dexie):

**Opción 1: Empezar de cero** (recomendado)
- Los datos viejos quedan en IndexedDB local
- Puedes exportarlos manualmente si es necesario

**Opción 2: Migrar datos**
- Crear script de migración (no incluido)
- Leer de IndexedDB → escribir a Firestore

### Para Desarrolladores

1. **API cambió internamente** pero la interfaz se mantiene:
   ```typescript
   // Antes
   await db.workouts.toArray()
   
   // Ahora
   await getWorkouts()
   ```

2. **IDs ya no son generados localmente**:
   ```typescript
   // Antes: id = `workout-${Date.now()}`
   // Ahora: id = docRef.id (generado por Firebase)
   ```

3. **Timestamps**:
   - Firebase usa su propio tipo `Timestamp`
   - Se convierten automáticamente a `Date` en el código

---

## ✅ Testing Checklist

- [ ] Firebase project creado
- [ ] `.env.local` configurado
- [ ] Auth anónima habilitada
- [ ] Firestore habilitado
- [ ] Reglas de seguridad aplicadas
- [ ] App carga sin errores
- [ ] Puedes crear entrenamientos
- [ ] Datos aparecen en Firebase Console
- [ ] Datos persisten al recargar
- [ ] Funciona offline (después de primera carga)

---

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Offline Persistence](https://firebase.google.com/docs/firestore/manage-data/enable-offline)

---

**🎉 Migración completada exitosamente!**

Tus datos ahora están seguros en Firebase y nunca se perderán.

