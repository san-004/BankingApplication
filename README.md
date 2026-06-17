# SecureBank - Full Stack Banking Application

## Project Title
**SecureBank - Banking Application with Multithreading**

## Objective
A comprehensive banking application that demonstrates Full Stack Development concepts including:
- Bank account CRUD operations
- Deposit and Withdrawal functionality
- Transaction history management
- Use of Java Collections (HashMap, ConcurrentHashMap, List) for account management
- Multithreading concepts (Thread Pools, CompletableFuture, Synchronized blocks, @Async)

## Technologies Used

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 21 | Programming language |
| Spring Boot 3.2 | Application framework |
| Spring Data JPA | Database ORM |
| Spring Security | Security configuration |
| PostgreSQL 16 | Relational database |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|-----------|---------|
| Angular 17 | Frontend framework |
| TypeScript | Programming language |
| HTML5/CSS3 | UI markup and styling |
| RxJS | Reactive programming |

### Tools
| Tool | Purpose |
|------|---------|
| VS Code / IntelliJ IDEA | IDE |
| Postman | API testing |
| Git & GitHub | Version control |
| Render | Backend + DB deployment |
| Vercel | Frontend deployment |

## Features Implemented

### 1. Account Management
- Create new bank accounts (Savings, Current, Fixed Deposit)
- View all accounts with balance information
- Update account details
- Deactivate accounts (soft delete)
- Account search by name
- Account statistics (totals, averages, grouped by type)

### 2. Transaction Processing
- **Deposit** - Add funds to an account
- **Withdrawal** - Withdraw funds with balance validation
- **Fund Transfer** - Transfer between two accounts
- **Transaction History** - Complete audit trail with thread information

### 3. Multithreading Demonstration
- **ExecutorService** with FixedThreadPool (4 worker threads)
- **CompletableFuture** for async non-blocking operations
- **Synchronized blocks** for thread-safe balance updates
- **ConcurrentHashMap** for thread-safe account caching
- **@Async annotation** for Spring-managed async execution
- **Batch Processing** - Concurrent execution of multiple transactions
- **Thread visualization** - Shows which thread processed each transaction

### 4. Collections Framework Usage
- **ConcurrentHashMap** - Thread-safe account cache
- **ArrayList** - Transaction history management
- **HashMap** - Account statistics aggregation
- **Stream API** - Filtering, grouping, and aggregation operations

---

## Prerequisites

| Software | Version | Download |
|----------|---------|----------|
| JDK | 21 | https://adoptium.net/temurin/releases/?version=21 |
| Maven | 3.9+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ | https://nodejs.org |
| Angular CLI | 17+ | `npm install -g @angular/cli` |
| PostgreSQL | 16 | https://www.postgresql.org/download/ |
| Git | Latest | https://git-scm.com/downloads |

---

## Steps to Run the Application Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/BankingApplication.git
cd BankingApplication
```

### Step 2: Setup PostgreSQL Database

1. Install PostgreSQL 16 (remember the password you set for `postgres` user)
2. Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE banking_db;
```

3. Update the database password in `banking-backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

### Step 3: Run the Backend

```bash
cd banking-backend
mvn clean install
mvn spring-boot:run
```

Backend starts on: **http://localhost:8080**

Verify it works: Open http://localhost:8080/api/accounts in browser.

### Step 4: Run the Frontend

Open a **new terminal**:

```bash
cd banking-frontend
npm install
ng serve
```

Frontend starts on: **http://localhost:4200**

### Step 5: Use the Application

Open http://localhost:4200 in your browser. The app loads with 5 sample accounts automatically.

---

## Deployment on Render + Vercel (Free Tier)

### Part A: Deploy Backend + Database on Render

#### 1. Create a Render Account
- Go to https://render.com and sign up (use GitHub login)

#### 2. Create PostgreSQL Database
- Dashboard → **New** → **PostgreSQL**
- Name: `banking-db`
- Plan: **Free**
- Click **Create Database**
- Wait for it to be ready, then copy:
  - **Internal Database URL**
  - **Username**
  - **Password**

#### 3. Deploy Backend
- Dashboard → **New** → **Web Service**
- Connect your GitHub repo
- Configure:
  - **Name:** `banking-backend`
  - **Root Directory:** `banking-backend`
  - **Runtime:** Docker
  - **Plan:** Free

- Add **Environment Variables:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `jdbc:postgresql://YOUR_RENDER_DB_HOST:5432/banking_db` |
| `DATABASE_USERNAME` | *(from Render DB dashboard)* |
| `DATABASE_PASSWORD` | *(from Render DB dashboard)* |
| `FRONTEND_URL` | *(add after Vercel deploy, e.g. https://your-app.vercel.app)* |

- Click **Create Web Service**
- Wait for build to complete (5-10 minutes first time)
- Note your backend URL: `https://banking-backend-xxxx.onrender.com`

### Part B: Deploy Frontend on Vercel

#### 1. Update API URL
Before deploying, update `banking-frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://banking-backend-xxxx.onrender.com/api'  // Your Render backend URL
};
```

Commit and push this change.

#### 2. Deploy on Vercel
- Go to https://vercel.com and sign up (use GitHub login)
- Click **Add New** → **Project**
- Import your GitHub repo
- Configure:
  - **Root Directory:** `banking-frontend`
  - **Framework Preset:** Angular
  - **Build Command:** `ng build --configuration production`
  - **Output Directory:** `dist/banking-frontend/browser`
- Click **Deploy**
- Note your frontend URL: `https://your-app.vercel.app`

#### 3. Update Render CORS
Go back to Render → Your web service → Environment Variables:
- Set `FRONTEND_URL` = `https://your-app.vercel.app`
- Render will auto-redeploy

### Done! 🎉
Your app is live at your Vercel URL.

---

## API Endpoints

### Account Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/accounts | Create new account |
| GET | /api/accounts | Get all accounts |
| GET | /api/accounts/{accountNumber} | Get account by number |
| PUT | /api/accounts/{accountNumber} | Update account |
| DELETE | /api/accounts/{accountNumber} | Deactivate account |
| GET | /api/accounts/statistics | Get account statistics |
| GET | /api/accounts/search?name= | Search by name |

### Transaction Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/transactions/deposit | Process deposit |
| POST | /api/transactions/withdraw | Process withdrawal |
| POST | /api/transactions/transfer | Transfer funds |
| GET | /api/transactions/history/{accountNumber} | Transaction history |
| GET | /api/transactions/recent/{accountNumber} | Recent transactions |
| POST | /api/transactions/batch/{accountNumber} | Batch processing (multithreading demo) |
| POST | /api/transactions/async | Async transaction processing |
| GET | /api/transactions/thread-info | Thread pool information |

---

## Project Structure

```
├── banking-backend/                  # Spring Boot Backend
│   ├── src/main/java/com/banking/
│   │   ├── BankingApplication.java   # Main entry point (@EnableAsync)
│   │   ├── model/                    # JPA Entities
│   │   │   ├── Account.java
│   │   │   ├── Transaction.java
│   │   │   ├── AccountType.java
│   │   │   ├── TransactionType.java
│   │   │   └── TransactionStatus.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── AccountDTO.java
│   │   │   ├── TransactionDTO.java
│   │   │   ├── TransferDTO.java
│   │   │   └── ApiResponse.java
│   │   ├── repository/               # JPA Repositories
│   │   │   ├── AccountRepository.java
│   │   │   └── TransactionRepository.java
│   │   ├── service/                  # Business Logic
│   │   │   ├── AccountService.java          (Collections demo)
│   │   │   ├── TransactionService.java      (Synchronized blocks)
│   │   │   └── MultithreadingDemoService.java (Thread pool demo)
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AccountController.java
│   │   │   └── TransactionController.java
│   │   ├── config/                  # Configuration
│   │   │   ├── SecurityConfig.java
│   │   │   ├── AsyncConfig.java
│   │   │   └── DataInitializer.java
│   │   └── exception/               # Exception Handling
│   │       ├── AccountNotFoundException.java
│   │       ├── InsufficientFundsException.java
│   │       └── GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   ├── application.properties          (Local - PostgreSQL)
│   │   └── application-prod.properties     (Production - Render)
│   ├── Dockerfile
│   ├── render.yaml
│   └── pom.xml
│
├── banking-frontend/                 # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/       # Overview with statistics
│   │   │   │   ├── accounts/        # Account CRUD
│   │   │   │   ├── transactions/    # Deposit/Withdraw/Transfer
│   │   │   │   └── multithreading/  # Thread pool visualization
│   │   │   ├── services/
│   │   │   │   ├── account.service.ts
│   │   │   │   └── transaction.service.ts
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   │   ├── environment.ts       # Local API URL
│   │   │   └── environment.prod.ts  # Production API URL
│   │   ├── styles.css
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── banking_db_script.sql         # MySQL version (reference)
│   └── banking_db_postgresql.sql     # PostgreSQL version
│
├── .gitignore
└── README.md
```

---

## Multithreading Architecture

```
┌─────────────────────────────────────────────┐
│         Transaction Request                  │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │  ExecutorService   │
         │  (4 Worker Pool)   │
         └─────────┬─────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│Worker-1│    │Worker-2│    │Worker-3│ ...
└───┬───┘    └───┬───┘    └───┬───┘
    │              │              │
    ▼              ▼              ▼
 Deposit      Withdrawal    Deposit
(synchronized)(synchronized)(synchronized)
```

### Key Multithreading Concepts:
1. **ExecutorService** - Fixed pool of 4 threads for concurrent processing
2. **CompletableFuture** - Async computation with non-blocking result handling
3. **Synchronized Blocks** - Mutual exclusion for balance updates
4. **ConcurrentHashMap** - Lock-free thread-safe caching
5. **@Async** - Spring-managed thread execution with ThreadPoolTaskExecutor
6. **Custom ThreadFactory** - Named threads for identifiable processing

---

## Screenshots

*Screenshots to include:*
1. Dashboard page showing account statistics
2. Account creation form and account list
3. Deposit/Withdrawal operations
4. Transaction history with thread information
5. Multithreading batch processing results with thread distribution
6. API responses in Postman

---

## Author
**[Your Name]**  
Banking Application - Full Stack Development Tool Demonstration
