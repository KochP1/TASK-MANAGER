
# Task-Manager 


sistema de gestión de proyectos y tareas con:

Autenticación JWT con refresh tokens para seguridad mejorada

Control de acceso basado en roles (Administrador/Usuario)

API RESTful para gestión completa de:

Usuarios

Proyectos

Tareas

Asignaciones

Arquitectura MVC

Base de datos MySql
## Estructura del proyecto

<img width="862" height="780" alt="Image" src="https://github.com/user-attachments/assets/ac614798-8f9e-4cfd-bd38-d40d82fbc11a" />


## Instalación

Este proyecto necesita las dependencias: express, bcrypt, sequelize, mysql2, dotenv y jsonwebtoken

```bash
  npm install
```
    
## Variables de entorno

Para ejecutar el proyecto se neceistan variables de entorno ubicadas en el archivo un archivo .env

`DB_HOST`

`DB_USER`

`DB_PASSWORD`

`DB_NAME`

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRES_IN`

`REFRESH_TOKEN_EXPIRES_IN`


## Endpoints de la API

#### Rutas de Autenticación (/auth)

```http
  POST /register
```

```http
  POST /login
```

```http
  POST /refresh
```

```http
  POST /logout
```

```http
  GET /list_users
```

```http
  GET /get_user/:id
```

```http
  DELETE /delete_user/:id
```

```http
  PUT /update_user/:id
```

```http
  PATCH /update_password/:id

```
#### Rutas de rol user (/user)

```http
  GET /get_tasks_by_projects/:id
```

```http
  PATCH /update_task_progress/:id
```
#### Rutas de rol administrador (/admin)

##### Gestión de proyectos
```http
  GET /get_project/:id
```

```http
  GET /get_especific_project/:id
```

```http
  POST /create_project
```

```http
  POST /assgin_project/:user_id/:project_id
```

```http
  PUT /update_assign_project/:id
```

```http
  PUT /edit_project/:id
```

```http
  DELETE /delete_project/:id
```
##### Gestión de tareas


```http
  POST /create_task
```

```http
  PUT /edit_task/:id
```

```http
  DELETE /delete_task/:id
```


## 🔗 Documentación en postman
(https://documenter.getpostman.com/view/43990736/2sB34bMjWY)

