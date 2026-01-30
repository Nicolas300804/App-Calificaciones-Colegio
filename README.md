# 📚 Sistema de Calificaciones - EduGrade Pro

Sistema completo de gestión de calificaciones para instituciones educativas, con soporte para 3 trimestres y 6 categorías de evaluación ponderadas.

## 🎯 Características

### Sistema de Calificaciones

- ✅ **3 Trimestres** por año académico
- ✅ **6 Categorías de Evaluación** con pesos personalizados:
  - Quizes (20%)
  - Tareas (20%)
  - Trabajo en Clase (10%)
  - Exposición (5%)
  - Comprensión de Lectura (5%)
  - Evaluación Final (40%)
- ✅ **Escala 0-10** para todas las calificaciones
- ✅ **Hasta 10 notas** por categoría (excepto Evaluación Final: 1)
- ✅ **Cálculos automáticos** de promedios ponderados

### Funcionalidades

- 📊 Cálculo automático de promedios por categoría
- 📈 Cálculo de calificación por trimestre (ponderado)
- 🎓 Cálculo de calificación final del curso
- ✏️ Agregar, editar y eliminar calificaciones
- 👥 Gestión de estudiantes, cursos y materias
- 🔐 Sistema de autenticación (Admin/Profesor/Estudiante)

## 🛠️ Tecnologías

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación

### Frontend

- React + Vite
- React Router
- Axios
- CSS personalizado (Gradebook Pro inspired)

## 📦 Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nicolas300804/App-Calificaciones-Colegio.git
cd App-Calificaciones-Colegio
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:

```env
PORT=5000
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

## 🚀 Uso

### Iniciar Backend

```bash
cd backend
npm start
```

El servidor correrá en `http://localhost:5000`

### Iniciar Frontend

```bash
cd frontend
npm run dev
```

La aplicación correrá en `http://localhost:5173`

## 📖 Estructura del Proyecto

```
App-Calificaciones-Colegio/
├── backend/
│   ├── config/          # Configuración de BD
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middlewares (auth, error)
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── clearGrades.js   # Script para limpiar calificaciones
│   └── index.js         # Punto de entrada
│
├── frontend/
│   ├── public/          # Archivos estáticos
│   └── src/
│       ├── api/         # Configuración de Axios
│       ├── components/  # Componentes reutilizables
│       ├── context/     # Context API (Auth)
│       ├── pages/       # Páginas principales
│       └── App.jsx      # Componente principal
│
└── README.md
```

## 🔑 Roles de Usuario

### Administrador

- Crear cursos, materias y estudiantes
- Asignar profesores a materias
- Gestión completa del sistema

### Profesor

- Ver sus cursos y materias asignadas
- Gestionar calificaciones de sus estudiantes
- Ver promedios y estadísticas

### Estudiante

- Ver sus calificaciones por trimestre
- Ver promedios por categoría
- Ver calificación final del curso

## 📊 Cálculo de Calificaciones

### Promedio de Categoría

```
Promedio = Σ(notas) / cantidad_de_notas
```

### Calificación del Trimestre

```
Calificación = Σ(promedio_categoría × peso_categoría)
```

### Calificación Final

```
Calificación Final = (Trimestre 1 + Trimestre 2 + Trimestre 3) / 3
```

## 🔧 Scripts Útiles

### Limpiar calificaciones antiguas

```bash
cd backend
node clearGrades.js
```

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Calificaciones

- `POST /api/grades` - Crear calificación
- `GET /api/grades/student/:studentId/assignment/:assignmentId` - Obtener calificaciones
- `PUT /api/grades/:gradeId` - Actualizar calificación
- `DELETE /api/grades/:gradeId` - Eliminar calificación

### Profesor

- `GET /api/teacher/my-courses` - Obtener cursos del profesor
- `GET /api/teacher/my-courses/:courseId/subjects` - Obtener materias
- `GET /api/teacher/my-classes/:courseId/:subjectId/students` - Obtener estudiantes

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Nicolás González**

- GitHub: [@Nicolas300804](https://github.com/Nicolas300804)

## 🙏 Agradecimientos

- Diseño inspirado en Gradebook Pro
- Comunidad de React y Node.js

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
