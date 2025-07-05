Task-Manager es un sistema de gestión de proyectos y tareas con:

Autenticación JWT con refresh tokens para seguridad mejorada

Control de acceso basado en roles (Administrador/Usuario)

API RESTful para gestión completa de:

Usuarios

Proyectos

Tareas

Asignaciones

Arquitectura MVC bien organizada

Base de datos SQL para almacenamiento persistente

task-manager/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js                 # Configuración de la base de datos
│   ├── controllers/
│   │   ├── authController.js      # Lógica de autenticación
│   │   └── projectsController.js  # Lógica de proyectos y tareas
│   ├── data/
│   │   └── taskManager.sql       # Esquema de la base de datos
│   ├── middleware/
│   │   ├── authMiddleware.js      # Middleware de autenticación JWT
│   │   └── checkRoleMiddleware.js # Middleware de verificación de roles
│   ├── models/
│   │   ├── projects.js           # Modelo de proyectos
│   │   ├── tasks.js              # Modelo de tareas
│   │   ├── token.js              # Modelo de tokens
│   │   ├── user-projects.js      # Modelo de relación usuario-proyecto
│   │   └── user.js               # Modelo de usuarios
│   ├── routers/
│   │   ├── adminRouter.js        # Rutas de administrador
│   │   ├── authRouter.js         # Rutas de autenticación
│   │   └── userRouter.js         # Rutas de usuario
│   ├── services/
│   │   ├── authService.js        # Servicios de autenticación
│   │   ├── projectService.js     # Servicios de proyectos
│   │   └── taskService.js        # Servicios de tareas
│── index.js                  # Punto de entrada de la aplicación
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por git
└── package-lock.json             # Dependencias exactas del proyecto
└── package.json                  # Configuración del proyecto y dependencias
└── Readme.md                     # documento con información sobre el proyecto