# Agent Instructions — Authentication Application

## 1. Role and Objective

You are a software engineering agent working on a personal authentication learning project.

Your responsibility is to inspect, implement, test, and document a working Login, Signup, and Logout application using the technologies and conventions already established in the repository.

The goal is to teach and demonstrate a clean separation of responsibilities between frontend, backend, database, and authentication logic.

Do not expand the project into an enterprise platform.

## 2. Project Scope

### Required functionality

- User signup.
- User login.
- User logout.
- Password hashing.
- JWT validation or the existing selected authentication mechanism.
- MongoDB persistence.
- Server-side input validation.
- Authentication error handling.
- Frontend/backend integration.
- Basic health endpoint.
- Responsive authentication UI.

### Explicitly out of scope

Unless specifically requested, do not implement:

- Multi-tenancy.
- Organizations or tenant administration.
- Organization-specific roles and permissions.
- Cloudflare configuration.
- NGINX load balancing.
- Redis session storage.
- Distributed workers or microservices.
- Enterprise subscriptions.
- SSO or OAuth.
- Password reset and email verification.
- Admin dashboards.
- Unrelated business features.

## 3. Mandatory Repository Inspection

Before changing files:

1. Read `AGENTS.md`, if present.
2. Read this `agent.md`.
3. Read `design_context.md`.
4. Read `README.md`.
5. Inspect frontend and backend package manifests.
6. Inspect the existing folder structure.
7. Inspect existing routes, controllers, services, models, middleware, utilities, and API clients.
8. Inspect the existing authentication flow and environment variables.
9. Inspect available design references.
10. Identify missing functionality and existing defects.

Do not assume that the repository uses a particular architecture simply because it is common.

If the repository already has working conventions, preserve them.

If an instruction conflicts with an existing mandatory repository rule, report the conflict before making risky changes.

## 4. Technology Constraints

Use the technologies already established in the repository.

The intended stack is:

### Backend

- Node.js.
- Express.
- MongoDB.
- Mongoose.
- bcrypt or the existing compatible bcrypt package.
- JSON Web Tokens when bearer-token authentication is selected.
- dotenv for environment configuration.

### Frontend

Use the existing frontend framework, router, styling system, form components, and API client.

Do not replace the frontend framework or install another UI library without justification.

Use JavaScript, not TypeScript, unless an existing mandatory project instruction requires otherwise.

Do not introduce unnecessary dependencies.

## 5. Architecture and Separation of Responsibilities

Respect the existing directory structure. If the project has no established structure, organize the backend around these responsibilities:

- Configuration: environment and database setup.
- Models: database schemas.
- Routes: HTTP endpoint definitions.
- Controllers: HTTP request and response handling.
- Services: authentication business logic when useful.
- Middleware: authentication and request validation.
- Utilities: small, reusable helpers.

Keep the implementation understandable for someone learning backend development.

### Routes

Routes should define HTTP methods, endpoint paths, and the middleware/controller chain.

Routes should not contain complex database queries or business logic.

### Controllers

Controllers should:

- Read validated request data.
- Call the appropriate service or model operation.
- Return consistent HTTP responses.
- Pass unexpected errors to the configured error handler.

### Services

Services should contain reusable authentication business logic when a service layer is appropriate.

Avoid creating unnecessary abstraction layers for trivial operations.

### Models

Mongoose models should define the fields, types, constraints, and indexes required by the application.

### Middleware

Middleware should handle concerns such as request validation and token verification.

Authentication middleware must reject missing, invalid, or expired credentials where authentication is required.

## 6. Required API Contract

Use these endpoints unless existing project conventions require a documented alternative:

- `GET /healthz`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`

### Signup

Validate name, email, and password.

Normalize email consistently.

Check duplicate email registration and handle unique-index violations safely.

Hash the password before storing the user.

Never return a password or password hash in an API response.

Return `201 Created` when account creation succeeds.

### Login

Validate email and password.

Find the account using a safe database query.

Verify the password using the selected bcrypt package.

Return a generic invalid-credentials message when authentication fails.

Issue a JWT only after successful authentication.

Use the configured token expiry and signing secret.

Do not return the stored password hash.

### Logout

Implement logout according to the authentication strategy already selected by the application.

For bearer-token authentication, clear the client-side token and authentication state. Explain that clearing a stateless access token on the client does not, by itself, invalidate a copied JWT on the server.

If server-side session revocation is required, implement an appropriate session strategy rather than pretending that a stateless JWT has been revoked.

For cookie-based authentication, clear the cookie using matching cookie attributes and address applicable CSRF protections.

Do not add Redis merely to implement a basic logout flow.

### Health endpoint

Return a simple health response.

If the endpoint claims database readiness, verify database connectivity before reporting readiness. Otherwise, distinguish application liveness from database readiness.

## 7. User Model and Password Security

Use only the fields required by the actual application, such as:

- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

Use a unique email index.

Avoid storing plaintext passwords.

Never expose password hashes through API responses.

Exclude the password hash from default query results where appropriate, and explicitly select it when required for login verification.

Use a configurable password policy that is documented and enforced consistently.

Do not hardcode JWT secrets.

Do not log passwords, JWTs, cookies, or other authentication secrets.

## 8. Request Validation and Injection Defense

Validate all untrusted request input on the server.

Reject unexpected object or array types for string fields.

Use explicit query filters and validated values.

Do not pass arbitrary client-provided objects directly into MongoDB filters or update operations.

Do not rely on stripping `$` or `.` characters as the sole defense against NoSQL injection.

Use Mongoose schema validation, safe query construction, appropriate error handling, and a suitable validation approach consistent with existing dependencies.

Return a clear client error for malformed input without exposing internal stack traces.

## 9. Frontend Integration

- Use the existing centralized API client when available.
- Configure the API base URL through the established environment configuration.
- Keep API requests separate from presentation components where appropriate.
- Handle loading and error states.
- Prevent duplicate submissions.
- Display validation feedback.
- Update authentication state consistently after login and logout.
- Protect authenticated routes only if such routes exist.
- Do not simulate successful authentication with fake data.
- Do not hardcode production secrets into frontend variables.

Follow `design_context.md` for the design and accessibility requirements.

## 10. Environment Configuration

Use environment variables for configuration, including relevant values such as:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- Frontend API base URL, if required.

Follow the existing variable names when they are already established.

Provide a safe example environment file containing placeholders, not real credentials.

Ensure secret environment files are excluded from version control according to existing repository rules.

Never print actual secret values in reports or logs.

## 11. Testing and Verification

Run available checks after making changes.

Verify at minimum:

- Signup with valid input.
- Signup with missing or invalid input.
- Signup with an already registered email.
- Login with valid credentials.
- Login with an incorrect password.
- Login with an unknown email.
- JWT verification, when JWT authentication is used.
- Logout and client-side authentication cleanup.
- Rejection of malformed input.
- MongoDB connection behavior.
- Frontend/backend API integration.
- Responsive Login and Signup layouts.

Run existing lint, build, and test commands where available.

Fix regressions caused by your changes.

Never report a test as passing unless it was actually executed.

If a dependency, database service, or external configuration prevents a test from running, report the blocker precisely.

## 12. Documentation

Update the existing README and relevant architecture documentation.

Document the actual implementation, not planned or hypothetical enterprise infrastructure.

Include setup commands, environment configuration, API contracts, authentication flow, and testing instructions.

Do not create redundant documentation files.

## 13. Change Management

- Make targeted changes.
- Preserve working functionality.
- Do not delete unrelated files.
- Do not modify Git history or perform Git operations.
- Do not introduce unnecessary dependencies.
- Do not invent Figma references or claim unverified design compliance.
- Do not overwrite user configuration without inspection.
- Report any potentially destructive changes before proceeding.

## 14. Completion Report

When implementation is complete, provide:

1. Summary of changes.
2. Files created or modified.
3. Final backend architecture.
4. API endpoints and behavior.
5. Environment variables required.
6. Commands to start frontend, backend, and MongoDB.
7. Tests actually executed and their results.
8. Known limitations and outstanding tasks.

The final implementation must remain a focused, working authentication application—not an enterprise multi-tenant platform.