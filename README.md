# campus-link-delivery

An application that would get you your cravings wherever you are!



## Backend setup



The backend uses Java 25, Spring Boot 4.1.1 and Maven.

PostgreSQL is hosted on Supabase.



### Requirements



- JDK 25, with JAVA_HOME pointing to its installation folder

- Git Bash

- Database connection details for the Supabase project



Maven is included through the Maven Wrapper.



### Local configuration



From the repository root:



```bash

cd backend

cp .env.example .env

```



If you already have a configured `.env`, skip the copy command.



Fill in `.env` with the Session pooler host, port, database name,

full username and database password. Use the JDBC URL format

shown in `.env.example`.



Leave values unquoted. Write any literal backslash in the

password as two backslashes. Keep credentials out of commits.



Run the commands below from the `backend` folder so Spring

can find `.env`.



### Build and test



```bash

./mvnw test

./mvnw package

```



### Run locally



```bash

./mvnw spring-boot:run

```



Stop the application with Ctrl + C.



### Current status



The backend starts, connects to PostgreSQL and passes the

generated application context test.



Hibernate schema changes and Flyway migrations are disabled

while the existing schema is being reviewed.



Access token checks, role checks and local CORS settings are in place.

Spring Security's default security headers are enabled.

Business endpoints are still pending. RLS is being handled in Supabase

by the database developer.



Maven ignores repositories introduced by dependencies through

`.mvn/maven.config`. Any additional required repository must

be configured explicitly.


## Backend security

Supabase handles sign-in and creates access tokens. The backend checks

each token before allowing access to protected endpoints.

### Token checks

Requests must include this header:

    Authorization: Bearer <access-token>

The backend checks the token's signature, issuer, audience and expiry.

It accepts ES256 tokens signed by our Supabase project.

### Roles

The backend reads the user's role from the profiles table.

The supported roles are Customer, Courier and Admin.

Users without a profile receive no role permissions.

### Test endpoints

- GET /api/security/test requires a valid token and returns the user's
  role permissions.

- GET /api/security/test/admin also requires the Admin role.

### Local settings

Add these settings to backend/.env:

    SUPABASE_JWT_ISSUER=https://YOUR_PROJECT_REF.supabase.co/auth/v1

    SUPABASE_JWKS_URL=https://YOUR_PROJECT_REF.supabase.co/auth/v1/.well-known/jwks.json

    CORS_ALLOWED_ORIGINS=http://localhost:5173

Replace YOUR_PROJECT_REF with your Supabase project reference.

Keep passwords and access tokens out of Git.

CORS_ALLOWED_ORIGINS lists the frontend addresses allowed to call the

API from a browser. Production addresses still need to be configured.

### Testing

Run from the backend folder:

    ./mvnw verify

All 17 tests passed. Automated security tests use a simulated token

decoder. We also tested real Supabase tokens in Postman.

Manual checks confirmed:

- Valid tokens allow access.

- Missing, invalid and expired tokens return 401.

- The Customer role is read from the database.

- Customers receive 403 on the Admin test endpoint.

- Allowed and blocked origins receive the expected CORS responses.



### Remaining work

- Add business endpoints and their role permissions.

- Check production CORS and HTTPS settings.

- Verify how the backend database connection works with the RLS

  policies being handled by the database developer.