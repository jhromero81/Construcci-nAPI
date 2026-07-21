# Proyecto de Autenticación API

API de autenticación con registro e inicio de sesión construida con React y Express.js.

## Estructura del Proyecto

```
auth-project/
├── server/                 # Backend (Express.js)
│   ├── server.js          # Archivo principal del servidor
│   ├── package.json       # Dependencias del backend
│   └── node_modules/
├── client/                 # Frontend (React)
│   ├── src/               # Código fuente de React
│   │   ├── components/    # Componentes React
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── services/      # Servicios API
│   │   │   └── api.js
│   │   └── App.js
│   ├── public/
│   └── package.json
├── package.json            # Configuración raíz
└── .gitignore
```

## Instalación

### Instalar dependencias

```bash
npm run install:all
```

### Iniciar servidores por separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Iniciar ambos servidores juntos

```bash
npm start
```
(Requiere: `npm install -g concurrently`)

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/register | Registrar usuario |
| POST | /api/login | Iniciar sesión |
| GET | /api/status | Estado del servidor |

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Uso

1. Abrir http://localhost:3000
2. Hacer clic en "Regístrate aquí"
3. Crear un usuario y contraseña
4. Iniciar sesión con las credenciales creadas

## Tecnologías

- **Frontend:** React, React Router, Axios
- **Backend:** Express.js, bcryptjs, jsonwebtoken
- **Base de datos:** Almacenamiento en memoria (usar MongoDB/PostgreSQL en producción)