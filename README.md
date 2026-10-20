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



Authentication, role permissions, CORS, security headers,

row-level security and application endpoints are still pending.



Maven ignores repositories introduced by dependencies through

`.mvn/maven.config`. Any additional required repository must

be configured explicitly.

