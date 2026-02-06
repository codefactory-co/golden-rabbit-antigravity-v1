# Clean Architecture Rules

This project strictly follows **Clean Architecture** principles. All contributions must adhere to these rules.

## 1. Dependency Rule

**Depend encies must ONLY point inward.**

- **Domain** (Inner most) depends on NOTHING.
- **Application** depends ONLY on **Domain**.
- **Infrastructure** depends on **Application** and **Domain**.
- **Presentation** (UI/Next.js) depends on **Application** and **Domain**.

The outer layers (Infrastructure, Presentation) are plugins to the inner layers.

## 2. Layer Definitions & Folder Structure

### 2.1 Domain Layer (`src/core/domain`)
**Pure business logic.** No frameworks, no external libraries (except strict utilities), no DB access code.
- **`entities/`**: Core business objects (e.g., `Post`). They contain data and pure logic.
- **`errors/`**: Domain-specific error classes.

### 2.2 Application Layer (`src/core/application`)
**Business Use Cases.** Orchestrates data flow to/from Domain entities.
- **`use-cases/`**: Application logic classes. Each UseCase should handle one specific business action.
- **`interfaces/`**: Repository interfaces (Ports). Defines *how* data access should behave without direct implementation.
- **`dtos/`**: Data Transfer Objects. Defines the shape of data entering/leaving the application layer.

### 2.3 Infrastructure Layer (`src/infrastructure`)
**Adapters.** Implement interfaces defined in the Application layer.
- **`repositories/`**: Concrete implementations of Repository Interfaces (e.g., `InMemoryPostRepository`, `PrismaPostRepository`).
- Connects to external services (DB, APIs).

### 2.4 Presentation Layer (`src/app`)
**Delivery Mechanism.** Next.js App Router.
- **Components**: UI components (shadcn/ui, custom).
- **Server Actions (`actions.ts`)**: Serves as the **Composition Root**.
    - This is where the Dependency Injection graph is assembled.
    - Controllers call UseCases here.

## 3. Dependency Injection (DI)
We use a **Manual Dependency Injection** pattern located in the Composition Root (e.g., `src/app/actions.ts`).

- **Do NOT** satisfy dependencies inside UseCases.
- **Do NOT** import specific Infrastructure classes (like `PrismaRepo`) inside Application or Domain code.
- **ALWAYS** pass Repository implementations (as Interfaces) into UseCase constructors.

```typescript
// Example Composition Root (src/app/actions.ts)
const postRepository = new InMemoryPostRepository(); // Infrastructure
const createPostUseCase = new CreatePostUseCase(postRepository); // Application depending on Interface
```

## 4. Testing
- **Domain & Application**: Must be unit-testable without any heavy framework mocks.
- **Infrastructure**: Integration tests allowed.
