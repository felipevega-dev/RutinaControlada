# 💪 Rutina Controlada

Aplicación web PWA para registro personal de entrenamientos, con soporte offline y optimizada para móviles.

## 🚀 Características

### ✅ Funcionalidades Implementadas

- **Dashboard**: Resumen del progreso con estadísticas clave
- **Nuevo Entrenamiento**: Selección de ejercicios y cronómetro en tiempo real
- **Registro de Sets**: Registra repeticiones o tiempo para cada ejercicio
- **Historial**: Lista completa de entrenamientos pasados con detalles
- **Estadísticas**: Gráficos de progreso y análisis de entrenamientos
- **Gestión de Ejercicios**: Agregar, editar y eliminar ejercicios personalizados
- **Tema Oscuro/Claro**: Cambio automático según preferencia
- **PWA**: Instalable como app nativa con soporte offline

### 🎨 Stack Tecnológico

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5+
- **Estilos**: TailwindCSS 4 (mobile-first)
- **Estado Global**: Zustand
- **Persistencia**: IndexedDB con Dexie
- **Gráficos**: Recharts
- **Animaciones**: Framer Motion
- **PWA**: @ducanh2912/next-pwa

## 📁 Estructura del Proyecto

```
rutina-controlada/
├── src/
│   ├── app/                    # Rutas Next.js App Router
│   │   ├── page.tsx           # Dashboard (/)
│   │   ├── entrenamiento/     # Selección y registro
│   │   ├── historial/         # Lista y detalles
│   │   ├── estadisticas/      # Gráficos y stats
│   │   └── ejercicios/        # Gestión de ejercicios
│   ├── components/
│   │   ├── layout/            # Header, BottomNav, Layout
│   │   └── ui/                # Button, Card, componentes animados
│   ├── store/                 # Zustand stores
│   │   ├── workoutStore.ts
│   │   ├── exerciseStore.ts
│   │   └── themeStore.ts
│   ├── lib/                   # Utilidades y lógica
│   │   ├── db.ts             # Configuración IndexedDB
│   │   ├── utils.ts
│   │   └── calories.ts
│   └── types/                 # Tipos TypeScript
│       └── index.ts
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icon-*.png            # Íconos de la app
└── .cursorrules              # Reglas del proyecto
```

## 🛠️ Instalación y Desarrollo

### Prerequisitos

- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar repositorio
git clone <tu-repo>
cd rutina-controlada

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Build de producción
npm start        # Servidor de producción
```

## 📱 Instalación como PWA

### En Móvil (Android/iOS)

1. Abre la app en tu navegador
2. Busca la opción "Agregar a pantalla de inicio"
3. Sigue las instrucciones

### En Desktop (Chrome/Edge)

1. Abre la app en tu navegador
2. Haz clic en el ícono de instalación en la barra de direcciones
3. Sigue las instrucciones

## 🎯 Flujo de Uso

### 1. Crear Entrenamiento

1. Ve a **Dashboard** → Clic en "Nuevo Entrenamiento"
2. Selecciona ejercicios (predefinidos o personalizados)
3. Clic en "Empezar Entrenamiento"
4. El cronómetro inicia automáticamente

### 2. Registrar Sets

1. Para cada ejercicio, ingresa repeticiones o tiempo
2. Clic en **+** para agregar set
3. Clic en **-** para eliminar último set
4. Las calorías se calculan automáticamente

### 3. Finalizar

1. Clic en "Finalizar Entrenamiento"
2. El entrenamiento se guarda en IndexedDB
3. Visible en **Historial** y **Estadísticas**

### 4. Ver Progreso

- **Historial**: Lista de entrenamientos con detalles
- **Estadísticas**: Gráficos de progreso, calorías, ejercicios más usados

### 5. Gestionar Ejercicios

1. Ve a **Ejercicios**
2. Clic en "Agregar Ejercicio Personalizado"
3. Completa el formulario con:
   - Nombre
   - Categoría (Fuerza, Cardio, Flexibilidad)
   - Calorías por repetición o por minuto
4. Guarda y aparecerá en la lista de selección

## 🔥 Ejercicios Predefinidos

La app incluye estos ejercicios por defecto:

- **Fuerza**: Abdominales, Flexiones, Sentadillas, Plancha
- **Cardio**: Burpees, Saltar la cuerda
- **Flexibilidad**: Estiramientos

## 🌙 Tema Oscuro/Claro

El tema se cambia automáticamente desde el botón en el header. La preferencia se guarda localmente.

## 💾 Persistencia de Datos

- **IndexedDB**: Todos los entrenamientos y ejercicios se guardan localmente
- **Zustand + localStorage**: Estado global y tema
- **Offline**: Funciona sin conexión una vez instalada

## 🎨 Diseño Mobile-First

La app está optimizada para móviles con:

- Navegación inferior (bottom tabs)
- Gestos táctiles
- Animaciones suaves con Framer Motion
- Scrollable content
- Safe area insets para notch

## 📊 Cálculo de Calorías

Las calorías se calculan según:

- **Ejercicios de fuerza**: `calorías = repeticiones × calorías_por_rep`
- **Ejercicios de cardio/tiempo**: `calorías = (segundos / 60) × calorías_por_minuto`

Los valores están basados en estimaciones generales.

## 🔒 Privacidad

- **100% local**: Todos los datos se almacenan en tu dispositivo
- **Sin servidor**: No se envía información a servidores externos
- **Sin analytics**: No hay tracking de usuarios

## 🐛 Problemas Conocidos

- Los íconos de PWA son placeholders (reemplazar con íconos reales)
- Recharts puede tener problemas de SSR (ya manejado con `use client`)

## 🚀 Próximas Mejoras

- [ ] Exportar datos a CSV/JSON
- [ ] Compartir entrenamientos
- [ ] Temporizadores de descanso entre sets
- [ ] Recordatorios de entrenamiento
- [ ] Modo oscuro automático según hora del día
- [ ] Sincronización en la nube (opcional)

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado como proyecto personal de registro de entrenamientos.

---

**¡Empieza a registrar tus entrenamientos! 💪🔥**
