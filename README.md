# MS Inscripciones - Microservicio de Gestión de Inscripciones

Microservicio para la gestión de inscripciones estudiantiles en cursos, desarrollado con Node.js, Express, MongoDB y Docker.

## Despliegue

```bash
# Clonar repositorio
git clone https://github.com/camilaeec/ms-inscripciones.git
cd ms-inscripciones

# Ejecutar con Docker Compose
docker-compose up -d

# Verificar estado
docker-compose ps
```

## Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/inscripciones` | Listar todas las inscripciones |
| GET | `/inscripciones/:estudianteId/:cursoId` | Obtener inscripción específica |
| POST | `/inscripciones` | Crear nueva inscripción |
| PATCH | `/inscripciones/:id/progreso` | Actualizar progreso |
| GET | `/health` | Health check del servicio |
| GET | `/api-docs` | Documentación Swagger UI |

### URLs de Producción
- **API Base:** http://3.81.42.197:3000
- **Swagger Documentation:** http://3.81.42.197:3000/api-docs
- **Health Check:** http://3.81.42.197:3000/health

## Estructura de Datos

### Modelo Inscripción (MongoDB)
```json
{
  "estudianteId": "string",
  "cursoId": "integer",
  "estado": "activa|completada|cancelada",
  "metodoPago": "string",
  "monto": "number",
  "progreso": {
    "porcentaje": "number",
    "leccionesCompletadas": "array[number]",
    "ultimaLeccionId": "number"
  },
  "fechaInscripcion": "Date"
}
```

## Ingesta de Datos a S3

### Ejecutar Ingesta
```bash
# Ejecutar proceso de ingesta
docker-compose run --rm ingesta python ingesta_api.py

# Verificar datos en S3
aws s3 ls s3://inscripciones-data-2025-camila/ --recursive --human-readable
```

### Configuración AWS
- **Bucket S3:** inscripciones-data-2025-camila
- **Región:** us-east-1
- **Formato:** JSON en raw-data/inscripciones-{timestamp}.json

## Arquitectura

```
ms-inscripciones/
├── src/
│   ├── controllers/inscripcionController.js
│   ├── routes/inscripcionRoutes.js
│   ├── models/Inscripcion.js
│   └── app.js
├── ingesta/
│   ├── Dockerfile
│   ├── ingesta_api.py
│   └── requirements.txt
├── docker-compose.yml
├── Dockerfile
└── cloudformation.yml
```

## Tecnologías

- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB
- **Contenedores:** Docker + Docker Compose
- **Documentación:** Swagger/OpenAPI 3.0
- **Ingesta:** Python + boto3 (AWS S3)
- **Cloud:** AWS EC2, S3, IAM

## Integración con Otros Microservicios

### Para MS Progreso (Servicio Agregador)
```javascript
// Obtener inscripción específica
GET http://3.81.42.197:3000/inscripciones/est001/101

// Obtener múltiples inscripciones
GET http://3.81.42.197:3000/inscripciones?estudianteId=est001
```

### Para MS Analíticas (Data Science)
```bash
# Los datos están disponibles en:
s3://inscripciones-data-2025-camila/raw-data/
```

## Troubleshooting

### Verificar logs
```bash
# Ver logs de la aplicación
docker-compose logs -f app

# Ver logs de MongoDB
docker-compose logs -f mongo

# Ver logs de ingesta
docker-compose logs -f ingesta
```

### Reiniciar servicios
```bash
# Reiniciar solo la aplicación
docker-compose restart app

# Reconstruir y reiniciar
docker-compose up -d --build
```

### Verificar conectividad
```bash
# Health check
curl http://localhost:3000/health

# Probar base de datos
docker-compose exec mongo mongosh --eval "db.inscripcions.countDocuments()"
```
