# Auth Service

## Overview
The Auth Service handles admin authentication, JWT token generation, and all admin operations (approve/reject members, assign admin role).

## Features
- Admin login with JWT token generation
- Get pending members
- Approve/reject members
- Assign admin role
- Get all admins
- Audit logging for all admin actions

## Endpoints

### Public Endpoints
- `POST /api/admin/login` - Admin login

### Protected Endpoints (JWT Required)
- `GET /api/admin/pending-members` - Get pending members
- `POST /api/admin/approve-member/{id}` - Approve member
- `POST /api/admin/reject-member/{id}` - Reject member
- `POST /api/admin/assign-admin/{id}` - Assign admin role
- `GET /api/admin/admins` - Get all admins

## Running the Service

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL database running
- Database `uk_club_db` created and schema applied

### Build
```bash
cd auth-service
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

Or with environment variables:
```bash
export JWT_SECRET=your-secure-secret-key-minimum-32-characters
export DB_PASSWORD=your-database-password
mvn spring-boot:run
```

The service will start on port **8081**.

## Configuration

### Environment Variables
- `JWT_SECRET`: Secret key for JWT token generation (minimum 32 characters)
- `DB_PASSWORD`: PostgreSQL database password

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: uk_club_db
- **Username**: postgres

## Testing

### Test Login
```bash
curl -X POST http://localhost:8081/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ukclub.com","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": 1,
    "email": "admin@ukclub.com",
    "fullName": "Admin User",
    "role": "admin"
  },
  "token": "eyJhbGc..."
}
```

## Notes
- JWT tokens expire after 1 hour (configurable via `jwt.expiration`)
- All admin actions are logged to `audit_log` table
- The service expects user info from API Gateway via headers:
  - `X-User-Id`: Admin user ID
  - `X-User-Email`: Admin email
  - `X-User-Role`: Admin role

## Next Steps
1. Test all endpoints with Postman/curl
2. Verify database operations
3. Test JWT token flow with API Gateway
4. Proceed to build Member Service (Phase 3)

