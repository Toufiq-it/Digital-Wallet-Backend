
# 💳 Wallet Management System

## 📌 Project Overview
This project is a **Wallet Management System** built with **Node.js, Express, TypeScript, and MongoDB**.  
It provides **secure wallet operations** for **Users, Agents, and Admins** with **role-based access control (RBAC)**.  

- Users can register, log in, and manage their wallet.  
- Agents can perform **cash-in** (add money) and **cash-out** (withdraw money) for users.  
- Admins manage everything: users, agents, wallets, and transactions.  

---

## 🚀 Features
- 🔑 **Authentication & Authorization** (JWT-based, Role protected routes)
- 👤 **User Management**
  - Register & Login
  - Profile with wallet info
- 💰 **Wallet Management**
  - Auto wallet creation on registration
  - Add-Money / Withdraw money
  - Active / Blocked wallets
- 📜 **Transaction Management**
  - Track all transactions 
  - Pagination + Sorting for history
- 🛡️ **Admin Controls**
  - Manage users & agents
  - Approve / Suspend agents
  - Set system parameters (e.g., transaction fees)
- 🔒 **Security**
  - Users/Agents only see their own wallet and transactions

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** MongoDB, Mongoose  
- **Validation:** Zod  
- **Authentication:** JWT, Bcrypt  
- **Error Handling:** Custom AppError, http-status-codes
- **Security:** Role-based Middleware, Transactions  

---

## 📡 API Endpoints

Base URL: `/api`

---

### 🔐 Auth Routes 
| Method | Endpoint             | Description |
|--------|----------------------|-------------|
| POST   | `/auth/login`        | Login with credentials and receive JWT |
| POST   | `/auth/refresh-token`| Get a new access token using refresh token |
| POST   | `/auth/logout`       | Logout user and invalidate session |
| POST   | `/auth/reset-password` | Reset password (requires authentication) |

---

### 👤 User Routes 
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| POST   | `/user/register`       | Register a new user (wallet auto-created) |
| PATCH  | `/user/:id`            | Update user info (authenticated) |
| GET    | `/user/:slug`          | Get single user by slug/ID |

#### 💳 User Wallet Operations
| Method | Endpoint                    | Description |
|--------|-----------------------------|-------------|
| POST   | `/user/add-money`           | Add money to own wallet |
| POST   | `/user/withdraw`            | Withdraw money from own wallet |
| POST   | `/user/send-money`          | Send money to another user |
| GET    | `/user/my-transactions`     | Get logged-in user’s transactions  |
| PATCH  | `/user/status`              | Update wallet status (ACTIVE/BLOCKED)  |

---

### 🛡️ Admin Routes
| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| GET    | `/admin/users`           | Get all users |
| GET    | `/admin/agents`          | Get all agents |
| GET    | `/admin/wallets`         | Get all wallets |
| GET    | `/admin/all-transactions`| Get all transactions |

---

### 🤝 Agent Routes
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| POST   | `/agent/cash-in`       | Agent deposits (cash-in) to a user wallet |
| POST   | `/agent/cash-out`      | Agent withdraws (cash-out) from a user wallet |
| GET    | `/agent/my-transactions` | Get logged-in agent’s transaction history |
| PATCH  | `/agent/status`        | Update agent wallet status (SUSPENDED/APPROVED) |

---

### 💰 Wallet Routes 
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/wallet/my-wallet`    | Get own wallet (User/Agent only) |


