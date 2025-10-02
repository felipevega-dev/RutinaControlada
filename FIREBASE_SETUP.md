# 🔥 Configuración de Firebase para Rutina Controlada

## 📋 Prerequisitos

- Cuenta de Google
- Node.js instalado
- Proyecto Next.js ya configurado

---

## 🚀 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: **`rutina-controlada`** (o el que prefieras)
4. **Desactiva** Google Analytics (no lo necesitamos por ahora)
5. Click en "Crear proyecto"

---

## 🔐 Paso 2: Registrar App Web

1. En el Dashboard del proyecto, click en el ícono **Web** (`</>`)
2. Nombre de la app: **`Rutina Controlada Web`**
3. **NO marques** "Also set up Firebase Hosting"
4. Click en "Registrar app"

Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "rutina-controlada-xxxx.firebaseapp.com",
  projectId: "rutina-controlada-xxxx",
  storageBucket: "rutina-controlada-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**¡GUARDA ESTOS DATOS!** Los necesitarás en el siguiente paso.

---

## 🔧 Paso 3: Configurar Variables de Entorno

1. En la raíz de tu proyecto, crea el archivo `.env.local`:

```bash
# Windows (PowerShell)
New-Item .env.local

# Mac/Linux
touch .env.local
```

2. Abre `.env.local` y pega tu configuración:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rutina-controlada-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rutina-controlada-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rutina-controlada-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**⚠️ Reemplaza los valores con los tuyos de Firebase!**

---

## 🗄️ Paso 4: Habilitar Firestore Database

1. En Firebase Console, ve al menú lateral → **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **"Modo de producción"** (configuraremos las reglas después)
4. Elige una ubicación (recomendado: **us-east1** para mejor latencia)
5. Click en "Habilitar"

---

## 🔒 Paso 5: Configurar Reglas de Seguridad

1. En Firestore Database, ve a la pestaña **"Reglas"** (Rules)
2. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuarios autenticados (anónimos) solo accedan a sus propios datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click en **"Publicar"** (Publish)

### 🤔 ¿Qué hacen estas reglas?
- Cada usuario solo puede leer/escribir **sus propios datos**
- Los datos están organizados por `userId` (UID de Firebase Auth)
- Nadie puede ver los datos de otros usuarios

---

## 🎭 Paso 6: Habilitar Autenticación Anónima

1. En Firebase Console, ve al menú lateral → **Authentication**
2. Click en "Comenzar" (Get started)
3. Ve a la pestaña **"Sign-in method"**
4. Click en **"Anónimo"** (Anonymous)
5. **Activa** el toggle
6. Click en "Guardar"

### 🤔 ¿Por qué autenticación anónima?
- No requiere que los usuarios creen cuenta
- Firebase asigna un `userId` único automáticamente
- Los datos persisten entre sesiones
- Más adelante puedes agregar email/password o Google Sign-In

---

## ✅ Paso 7: Verificar Instalación

1. Reinicia el servidor de desarrollo:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia:
npm run dev
```

2. Abre `http://localhost:3000`

3. **Deberías ver**:
   - Loading: "Inicializando Firebase..."
   - Luego la app cargará normalmente

4. **Si ves un error**:
   - Verifica que `.env.local` existe y tiene los valores correctos
   - Verifica que copiaste las variables **exactas** de Firebase
   - Reinicia el servidor

---

## 🧪 Paso 8: Probar que Funciona

### Test 1: Crear Entrenamiento

1. Ve a **"Nuevo Entrenamiento"**
2. Selecciona ejercicios
3. Registra sets
4. Finaliza

### Test 2: Verificar en Firebase Console

1. Ve a Firebase Console → **Firestore Database**
2. Deberías ver esta estructura:

```
users/
  └─ {tu-user-id}/
      ├─ exercises/
      │   └─ {doc-id} → { name: "Abdominales", ... }
      └─ workouts/
          └─ {doc-id} → { startTime, duration, ... }
```

### Test 3: Verificar Persistencia

1. Cierra el navegador completamente
2. Ábrelo de nuevo
3. Ve a `http://localhost:3000`
4. Los datos deberían seguir ahí! 🎉

---

## 🌐 Persistencia Offline

La app ya tiene configurada **persistencia offline**:

```typescript
// src/lib/firebase.ts
enableIndexedDbPersistence(db);
```

Esto significa:
- ✅ Los datos se guardan localmente en IndexedDB
- ✅ Funciona sin internet después de la primera carga
- ✅ Se sincroniza automáticamente cuando vuelve la conexión

---

## 🔍 Debugging

### Ver usuario autenticado

Abre la consola del navegador (F12) y ejecuta:

```javascript
firebase.auth().currentUser
```

Deberías ver:
```javascript
{
  uid: "xxxxxxxxxxxxxxxxxxx",
  isAnonymous: true,
  ...
}
```

### Ver datos en Firestore

```javascript
// En la consola del navegador
const db = firebase.firestore();
db.collection('users').doc('TU_USER_ID').collection('exercises').get()
  .then(snapshot => {
    snapshot.forEach(doc => console.log(doc.id, doc.data()));
  });
```

---

## 🚨 Problemas Comunes

### Error: "Firebase config missing"

**Solución**: Verifica que `.env.local` existe y tiene todas las variables.

```bash
# Verificar que el archivo existe
ls -la | grep .env.local  # Mac/Linux
dir | findstr .env.local  # Windows
```

### Error: "Permission denied"

**Solución**: 
1. Verifica las reglas de Firestore (Paso 5)
2. Verifica que la autenticación anónima esté habilitada (Paso 6)

### Error: "Multiple tabs" en persistencia

**Normal**: Firebase solo permite persistencia en una tab. Las demás funcionarán pero sin cache local.

### Los datos no aparecen

**Solución**:
1. Abre Firebase Console → Firestore Database
2. Verifica que hay documentos
3. Verifica que el `userId` coincide con tu autenticación
4. Revisa la consola del navegador para errores

---

## 📊 Límites del Plan Gratuito

Firebase Spark (gratis) incluye:

| Recurso | Límite Gratuito |
|---------|-----------------|
| **Firestore**  | 1 GB almacenamiento |
| **Lecturas**   | 50,000/día |
| **Escrituras** | 20,000/día |
| **Deletes**    | 20,000/día |
| **Auth Users** | Sin límite |

**Para esta app** (uso personal):
- ✅ Suficiente para años de uso
- ✅ Miles de entrenamientos
- ✅ Sin costo

---

## 🎯 Próximos Pasos Opcionales

### 1. Agregar Email/Password Auth

En Firebase Console → Authentication → Sign-in method:
- Habilita "Email/password"
- Actualiza el código para mostrar formulario de login

### 2. Agregar Google Sign-In

- Habilita "Google" en Authentication
- Permite login con cuenta Google

### 3. Habilitar Hosting de Firebase

```bash
firebase init hosting
firebase deploy
```

Tu app estará en: `https://tu-proyecto.web.app`

---

## ✅ Checklist Final

- [ ] Proyecto de Firebase creado
- [ ] App web registrada
- [ ] Variables en `.env.local` configuradas
- [ ] Firestore Database habilitado
- [ ] Reglas de seguridad configuradas
- [ ] Autenticación anónima habilitada
- [ ] App funciona y guarda datos
- [ ] Datos visibles en Firebase Console

---

**¡Listo! Tus datos ahora están seguros en la nube 🚀🔥**

¿Problemas? Revisa este documento o abre un issue en GitHub.

