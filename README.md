# Frontend - TicoAutos

Este proyecto corresponde al frontend de **TicoAutos**, una plataforma web para la publicación y consulta de vehículos en Costa Rica.  
La interfaz permite a los usuarios registrarse, iniciar sesión, publicar vehículos y comunicarse mediante preguntas y respuestas.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Google Identity Services (OAuth)

---

## Estructura del proyecto

```
Frontend-TicoAutos/
├── HTML/                        # Páginas de la aplicación
│   ├── index.html               # Página principal (home)
│   ├── login.html               # Inicio de sesión
│   ├── register.html            # Registro de usuario
│   ├── activate.html            # Activación de cuenta
│   ├── searchVehicles.html      # Búsqueda y filtrado de vehículos
│   ├── vehiclesDetails.html     # Detalle de vehículo
│   ├── publishVehicle.html      # Publicar vehículo
│   ├── myVehicles.html          # Mis vehículos
│   └── editVehicle.html         # Editar vehículo
├── css/                         # Estilos por página
│   ├── auth.css
│   ├── home.css
│   ├── searchVehicles.css
│   ├── vehicleDetails.css
│   ├── publishVehicle.css
│   ├── myVehicles.css
│   └── editVehicle.css
├── JS/
│   ├── API/                     # Funciones de comunicación con los backends
│   │   ├── auth.js              # Login, registro, 2FA
│   │   ├── authGoogle.js        # Login con Google
│   │   ├── padron.js            # Consulta al padrón electoral
│   │   ├── searchVehicles.js    # Query GraphQL vehículos
│   │   ├── vehicleDetails.js    # Query GraphQL detalle de vehículo
│   │   ├── myVehicles.js        # Query GraphQL vehículos del usuario
│   │   ├── editVehicle.js       # Query GraphQL + REST edición
│   │   ├── publishVehicle.js    # REST publicar vehículo
│   │   └── questionAnswer.js    # Query GraphQL + REST preguntas y respuestas
│   ├── auth.js                  # Lógica del formulario de login/registro
│   ├── authGoogle.js            # Lógica del login con Google
│   ├── home.js                  # Lógica de la página principal
│   ├── searchVehicles.js        # Lógica de búsqueda y filtros
│   ├── vehicleDetails.js        # Lógica del detalle de vehículo
│   ├── publishVehicle.js        # Lógica de publicación
│   ├── myVehicles.js            # Lógica de mis vehículos
│   ├── editVehicle.js           # Lógica de edición
│   ├── activate.js              # Lógica de activación de cuenta
│   └── config.js                # Configuración global (Google Client ID)
└── img/                         # Imágenes y logos
```

---

## Funcionalidades principales

### Autenticación
- Registro de usuario con validación de cédula contra el padrón electoral
- Autocompletado de nombre y apellidos desde el padrón al ingresar la cédula
- Campo de teléfono requerido para la verificación en dos pasos (2FA)
- Inicio de sesión con email y contraseña
- Verificación en dos pasos (2FA): modal que solicita el código enviado por SMS
- Login social con Google OAuth
- Activación de cuenta por correo electrónico
- Reenvío de correo de activación

### Vehículos
- Página principal con vehículos destacados
- Búsqueda y filtrado de vehículos por marca, modelo, año y precio
- Vista de detalle de vehículo con información del propietario
- Publicar vehículo con subida de imagen
- Ver mis vehículos publicados
- Editar vehículo
- Eliminar vehículo

### Preguntas y respuestas
- Usuarios pueden hacer preguntas en la página de detalle de un vehículo
- El propietario puede responder desde la misma página
- Las conversaciones se muestran en tiempo real al cargar la página

---

## Integración con los backends

El frontend consume dos backends distintos según el tipo de operación:

| Operación | Backend | Puerto |
|-----------|---------|--------|
| Login, registro, 2FA | REST API | `:3000` |
| Publicar, editar, eliminar vehículo | REST API | `:3000` |
| Crear pregunta / respuesta | REST API | `:3000` |
| Consultar vehículos con filtros | GraphQL API | `:4000` |
| Consultar detalle de vehículo | GraphQL API | `:4000` |
| Consultar mis vehículos | GraphQL API | `:4000` |
| Consultar preguntas y respuestas | GraphQL API | `:4000` |
| Consultar usuario autenticado | GraphQL API | `:4000` |
| Validar cédula en el padrón | REST API → PHP | `:3000 → :8080` |

---

## Instalación y ejecución

El frontend no requiere instalación ni servidor de Node.js. Es un proyecto estático que puede abrirse directamente en el navegador.

1. Clonar el repositorio
2. Asegurarse de que el **Backend REST** esté corriendo en el puerto `3000`
3. Asegurarse de que el **Backend GraphQL** esté corriendo en el puerto `4000`
4. Abrir el archivo `HTML/index.html` en el navegador

---

## Variables de configuración

En el archivo `JS/config.js` se configura el Client ID de Google para el login social:

```javascript
const GOOGLE_CLIENT_ID = "tu_google_client_id";
```

Las URLs de los backends están definidas al inicio de cada archivo en `JS/API/`:

```javascript
const API = "http://localhost:3000";
const GRAPH_API = "http://localhost:4000/graphql";
```

---

## Sesión de usuario

La sesión se maneja mediante `sessionStorage`. El token JWT se guarda al iniciar sesión y se elimina al cerrar sesión:

```javascript
sessionStorage.setItem("token", token);
sessionStorage.getItem("token");
```

---

## Autor

Proyecto desarrollado como parte del curso de Web II.

- Dylan Jiménez Alfaro
- Emily Zúñiga Solano
