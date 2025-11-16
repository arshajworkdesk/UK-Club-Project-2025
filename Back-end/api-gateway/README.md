# API Gateway Service

## Overview
The API Gateway is the single entry point for all frontend requests. It handles routing to backend services, CORS configuration, and JWT token validation.

## Features
- Routes requests to appropriate microservices
- Validates JWT tokens for protected endpoints
- Configures CORS for Angular frontend
- Health check endpoint for monitoring

## Running the Service

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Build
```bash
cd api-gateway
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

Or with environment variable:
```bash
export JWT_SECRET=your-secure-secret-key-minimum-32-characters
mvn spring-boot:run
```

The service will start on port **8080**.

## Configuration

### Environment Variables
- `JWT_SECRET`: Secret key for JWT token validation (minimum 32 characters)

### Service URLs
The gateway routes to:
- **Auth Service**: `http://localhost:8081`
- **Member Service**: `http://localhost:8082`
- **Contact Service**: `http://localhost:8083`

## Endpoints

### Public Endpoints (No JWT Required)
- `POST /api/admin/login` → Auth Service
- `POST /api/membership/register` → Member Service
- `GET /api/members` → Member Service
- `POST /api/contact` → Contact Service

### Protected Endpoints (JWT Required)
- `GET /api/admin/pending-members` → Auth Service
- `POST /api/admin/approve-member/{id}` → Auth Service
- `POST /api/admin/reject-member/{id}` → Auth Service
- `POST /api/admin/assign-admin/{id}` → Auth Service
- `GET /api/admin/admins` → Auth Service

### Health Check
- `GET /actuator/health` - Service health status

## Testing

### Check if Gateway is Running
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Test CORS (from browser console)
```javascript
fetch('http://localhost:8080/actuator/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Notes
- The gateway will return 503 errors for routes until the backend services are running
- JWT validation is handled by the `JwtAuthenticationFilter`
- CORS is configured for `http://localhost:4200` (dev) and `https://arshajworkdesk.github.io` (prod)

## Next Steps
1. Build Auth Service (Phase 2)
2. Build Member Service (Phase 3)
3. Build Contact Service (Phase 4)
4. Test end-to-end flow

