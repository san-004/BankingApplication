# SecureBank - Banking Application

## Objective
A full stack banking application that demonstrates:
- Bank account CRUD operations (Create, Read, Update, Delete)
- Deposit and Withdrawal functionality with balance validation
- Fund Transfer between accounts
- Transaction history management with complete audit trail
- Use of Java Collections (ConcurrentHashMap, ArrayList, HashMap, Stream API) for account management
- Multithreading concepts (ExecutorService, CompletableFuture, Synchronized blocks, @Async, ThreadPoolTaskExecutor)

## Technologies Used

### Backend
- Java 21
- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- PostgreSQL 16
- Maven

### Frontend
- Angular 17
- TypeScript
- HTML5 / CSS3
- RxJS

### Tools
- VS Code
- Postman
- Git & GitHub
- Render (Backend deployment)
- Vercel (Frontend deployment)

## Features Implemented

### Account Management
- Create new bank accounts (Savings, Current, Fixed Deposit)
- View all accounts with balance information
- Update account details
- Deactivate accounts (soft delete)
- Account search and statistics

### Transaction Processing
- Deposit funds to an account
- Withdraw funds with insufficient balance validation
- Transfer funds between two accounts
- View complete transaction history with thread information

### Multithreading
- ExecutorService with FixedThreadPool (4 worker threads)
- CompletableFuture for async non-blocking operations
- Synchronized blocks for thread-safe balance updates
- ConcurrentHashMap for thread-safe account caching
- @Async annotation for Spring-managed async execution
- Batch processing with concurrent execution and thread visualization

## Steps to Run the Application

### Prerequisites
- JDK 21
- Maven 3.9+
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL 16

### Step 1: Setup Database
1. Install PostgreSQL 16
2. Open pgAdmin and create a database named `banking_db`
3. Update `banking-backend/src/main/resources/application.properties` with your PostgreSQL password

### Step 2: Run Backend
```bash
cd banking-backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### Step 3: Run Frontend
```bash
cd banking-frontend
npm install
ng serve
```
Frontend runs on: http://localhost:4200

### Step 4: Access the Application
Open http://localhost:4200 in your browser. The app loads with 5 sample accounts automatically.

## Deployment

### Live URLs
- **Frontend:** https://banking-application-n0laycmsl-ss-projects-37f5b678.vercel.app
- **Backend:** *(Your Render backend URL)*

### Backend + Database (Render)
1. Create a free PostgreSQL database on Render
2. Create a Web Service, connect GitHub repo, set root directory to `banking-backend`
3. Runtime: Docker (uses the included Dockerfile)
4. Add environment variables: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `FRONTEND_URL`

### Frontend (Vercel)
1. Import GitHub repo on Vercel
2. Root Directory: `banking-frontend`
3. Build Command: `npm install && npx ng build --configuration production`
4. Output Directory: `dist/banking-frontend/browser`
