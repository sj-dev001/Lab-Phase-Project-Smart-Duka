# Smart Duka — Multi-Vendor E-Commerce Marketplace

> **A full-stack MERN marketplace platform connecting local vendors with customers through a secure, scalable, and customizable digital storefront.**

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Project Objectives](#project-objectives)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Security](#security)
- [Testing Strategy](#testing-strategy)
- [Deployment Strategy](#deployment-strategy)
- [Project Scope & Limitations](#project-scope--limitations)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Future Enhancements](#future-enhancements)
- [Timeline](#timeline)

---

## Problem Statement

Small-scale vendors in local markets lack affordable, customizable digital storefronts. Existing solutions are either too expensive (Shopify, Magento), too technical to set up (WooCommerce), or do not cater to the local market context. Vendors resort to social media posts and messaging apps to manage sales, leading to:

- Disorganized order management
- Limited customer reach
- No centralized product catalog
- Difficulty scaling beyond manual processes

**Smart Duka** solves this by providing a multi-vendor marketplace where vendors can register, list products, manage orders, and accept payments — all through an intuitive web interface.

---

## Project Objectives

1. Build a multi-role marketplace with Admin, Vendor, and Customer accounts
2. Enable vendors to independently manage their product catalog and orders
3. Provide customers with a seamless browsing, cart, and checkout experience
4. Integrate secure payment processing via Paystack
5. Implement role-based access control and authentication
6. Deliver a responsive, mobile-friendly user interface

---

## Features

### Customer Features
- Browse products by category, vendor, or search query
- Filter and sort products (price, rating, popularity)
- View product details with images and reviews
- Add items to cart and manage quantities
- Checkout with secure Paystack payment integration
- Track order status
- Leave product reviews and ratings
- Manage wishlist
- User profile and order history

### Vendor Features
- Register and manage vendor profile/store
- Add, edit, and delete products with images
- Manage inventory (stock levels)
- View and process incoming orders
- Track sales analytics (basic dashboard)
- Respond to customer reviews

### Admin Features
- Approve/reject new vendor registrations
- Manage all users (suspend, delete)
- Oversee all products and categories
- View platform-wide analytics
- Manage product categories
- Monitor payments and transactions

---

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Frontend    | React with Vite + TypeScript        |
| Styling     | Tailwind CSS                        |
| State       | Redux Toolkit                       |
| Backend     | Node.js + Express.js                |
| Database    | MongoDB + Mongoose                  |
| Auth        | JWT + bcrypt                        |
| Payments    | Paystack API                        |
| Images      | Azure Blob Storage                  |
| Animations  | Framer Motion                       |
| HTTP Client | Axios                               |
| Validation  | Joi / express-validator             |

---

## System Architecture

Smart Duka follows a **client-server architecture** with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────┐
│                   Client (React)                 │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Public │ │ Customer │ │ Vendor / Admin    │  │
│  │  Pages  │ │ Dashboard│ │ Dashboard         │  │
│  └────┬────┘ └────┬─────┘ └────────┬─────────┘  │
│       │           │                │             │
│       └───────────┼────────────────┘             │
│                   │ HTTP Requests (Axios)         │
└───────────────────┼─────────────────────────────┘
                    │
┌───────────────────┼─────────────────────────────┐
│             Express REST API                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ Auth │ │Users │ │Product│ │Order │ │Payment│  │
│  │Routes│ │Routes│ │Routes│ │Routes│ │Routes │  │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘  │
│     │        │        │        │        │       │
│  ┌──┴────────┴────────┴────────┴────────┴───┐   │
│  │         Middleware Layer                  │   │
│  │  (Auth · RBAC · Validation · Rate Limit)  │   │
│  └────────────────┬─────────────────────────┘   │
│                   │                             │
│  ┌────────────────┴─────────────────────────┐   │
│  │          MongoDB (via Mongoose)           │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  External Services:                             │
│  ┌────────────┐ ┌──────────────────┐             │
│  │  Paystack  │ │  Azure Blob      │             │
│  │  Payments  │ │  Storage (Images)│             │
│  └────────────┘ └──────────────────┘             │
└─────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Redux Toolkit** over Context API for predictable state management across auth, cart, and dashboard state
- **Azure Blob Storage** for product image uploads and delivery
- **JWT with refresh tokens** for secure, stateless authentication
- **Mongoose references** for collection relationships (not embedded docs for scalability)

---

## Database Design

### Collections Overview

```
┌────────────────────────────────────────────────────────────────┐
│                       MongoDB Collections                       │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  users ────┬─── role: customer | vendor | admin                 │
│            │                                                     │
│            ├─── vendorProfile ──── vendors (shop info)           │
│            │                                                     │
│            ├─── reviews ──── reviewed products                   │
│            │                                                     │
│            └─── wishlist ──── saved products                     │
│                                                                  │
│  products ─┬─── vendor (ref → users)                            │
│            ├─── category (ref → categories)                     │
│            ├─── reviews (ref → reviews)                         │
│            └─── images (Azure Blob Storage URLs)                │
│                                                                  │
│  categories ──── name, slug, description, image                  │
│                                                                  │
│  orders ────┬─── customer (ref → users)                         │
│             ├─── items (array of product refs + quantities)     │
│             ├─── payment (ref → payments)                       │
│             └─── status: pending | confirmed | shipped |        │
│                          delivered | cancelled                  │
│                                                                  │
│  payments ──┬─── order (ref → orders)                           │
│             ├─── customer (ref → users)                         │
│             ├─── amount, currency, status                       │
│             └─── paystackReference                               │
│                                                                  │
│  reviews ───┬─── product (ref → products)                       │
│             ├─── user (ref → users)                             │
│             └─── rating, comment                                 │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Relationships

- **User → Vendor**: One-to-One (a user can optionally have a vendor profile)
- **User → Orders**: One-to-Many
- **User → Reviews**: One-to-Many
- **Vendor → Products**: One-to-Many
- **Product → Reviews**: One-to-Many
- **Category → Products**: One-to-Many
- **Order → Payments**: One-to-One

---

## API Design

The backend exposes a **RESTful JSON API** organized by resource:

### Authentication Endpoints
| Method | Endpoint              | Description              | Access     |
| ------ | --------------------- | ------------------------ | ---------- |
| POST   | `/api/auth/register`  | Register new user        | Public     |
| POST   | `/api/auth/login`     | Login user               | Public     |
| POST   | `/api/auth/logout`    | Logout user              | Authenticated |
| GET    | `/api/auth/me`        | Get current user profile | Authenticated |

### Product Endpoints
| Method | Endpoint                    | Description                | Access     |
| ------ | --------------------------- | -------------------------- | ---------- |
| GET    | `/api/products`             | List all products          | Public     |
| GET    | `/api/products/:id`         | Get single product         | Public     |
| POST   | `/api/products`             | Create product             | Vendor     |
| PUT    | `/api/products/:id`         | Update product             | Vendor/Owner |
| DELETE | `/api/products/:id`         | Delete product             | Vendor/Owner |

### Order Endpoints
| Method | Endpoint                | Description              | Access     |
| ------ | ----------------------- | ------------------------ | ---------- |
| GET    | `/api/orders`           | List user orders         | Authenticated |
| GET    | `/api/orders/:id`       | Get order details        | Authenticated |
| POST   | `/api/orders`           | Create new order         | Customer   |
| PUT    | `/api/orders/:id/status`| Update order status      | Vendor/Admin |

### Payment Endpoints
| Method | Endpoint                       | Description                    | Access     |
| ------ | ------------------------------ | ------------------------------ | ---------- |
| POST   | `/api/payments/initialize`     | Initialize Paystack payment    | Customer   |
| GET    | `/api/payments/verify`         | Verify payment after callback  | Customer   |

### Vendor Endpoints
| Method | Endpoint                    | Description                 | Access     |
| ------ | --------------------------- | --------------------------- | ---------- |
| POST   | `/api/vendors/register`    | Register as vendor          | Customer   |
| GET    | `/api/vendors/:id/products`| Get vendor's products       | Public     |
| GET    | `/api/vendors/:id/orders`  | Get vendor's orders         | Vendor     |

### Admin Endpoints
| Method | Endpoint                    | Description                 | Access  |
| ------ | --------------------------- | --------------------------- | ------- |
| GET    | `/api/admin/users`          | List all users              | Admin   |
| PUT    | `/api/admin/users/:id`      | Update user (suspend/role)  | Admin   |
| GET    | `/api/admin/vendors/pending`| List pending vendor apps    | Admin   |
| PUT    | `/api/admin/vendors/:id`    | Approve/reject vendor       | Admin   |

All protected endpoints require a **Bearer JWT token** in the `Authorization` header. Responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## Security

| Measure                     | Implementation                              |
| --------------------------- | -------------------------------------------- |
| Password Hashing            | bcrypt (salt rounds: 10)                     |
| Authentication              | JWT (access + refresh tokens)                |
| Authorization               | Role-based middleware (customer/vendor/admin) |
| HTTP Headers                | Helmet.js                                    |
| Rate Limiting               | express-rate-limit                           |
| Input Validation            | express-validator / Joi                      |
| CORS                        | Configured whitelist                         |
| XSS Protection              | Input sanitization + Helmet                  |
| Environment Variables       | All secrets via `.env`                       |
| Payment Security            | Paystack server-side verification            |

---

## Testing Strategy

| Layer       | Tool                    | Focus                                  |
| ----------- | ----------------------- | -------------------------------------- |
| Backend API | Jest + Supertest        | Route handlers, auth middleware        |
| Frontend    | React Testing Library   | Component rendering, user interactions |
| Integration | Supertest               | API + database workflows               |
| Payments    | Postman / Manual        | Paystack initialize + verify flow      |
| Validation  | Jest                    | Input validation and error handling    |

Tests will cover:

- User registration and login flows
- CRUD operations for products, orders, reviews
- Role-based access control (customer cannot access admin routes)
- Payment initialization and verification
- Error responses for invalid/malformed requests

---

## Deployment Strategy (Microsoft Azure)

The entire application will be deployed on **Microsoft Azure** using the following services:

| Component  | Azure Service                | Notes                              |
| ---------- | ---------------------------- | ---------------------------------- |
| Frontend   | Azure Static Web Apps        | Static React build, CI/CD via GitHub Actions |
| Backend    | Azure App Service            | Node.js web app with auto-scaling  |
| Database   | Azure Cosmos DB for MongoDB  | MongoDB-compatible, fully managed  |
| Images     | Azure Blob Storage           | Scalable image hosting alternative |
| Domain     | Azure DNS / Custom Domain    | Custom domain with SSL via Azure   |
| Monitoring | Azure Monitor + App Insights | Request tracking, logs, alerts     |

### Deployment Pipeline

```
Git Push → GitHub → GitHub Actions → Build → Deploy to Azure
```

### Advantages of Azure for This Project

- **Unified ecosystem** — frontend, backend, database, and storage under a single provider
- **Azure Cosmos DB for MongoDB** — provides MongoDB wire-protocol compatibility with enterprise-grade scalability, global distribution, and SLA-backed uptime
- **Static Web Apps** — free tier suitable for academic projects, with integrated authentication and custom domain support
- **App Service** — supports Node.js with easy scaling, staging slots, and environment variable management
- **Student credits** — Azure for Students provides free credits, making deployment cost-effective for academic projects
- **GitHub Actions integration** — automated CI/CD from repository to deployment

### Deployment Configuration

Environment variables will be configured via Azure App Service **Application Settings** (not `.env` files). The frontend will communicate with the backend through a configurable API URL set at build time.

```bash
# Azure-specific environment settings (configured in Azure Portal)
MONGODB_URI=mongodb://<cosmos-account>:<primary-key>@<cosmos-account>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
```

---

## Project Scope & Limitations

Due to academic time and resource constraints, the following are **out of scope** for the initial release:

- Native mobile applications (iOS/Android)
- Real-time delivery tracking system
- AI-powered product recommendations
- Multi-currency support
- Advanced analytics dashboards
- SMS/email notification system
- Multi-language (i18n) support
- Offline mode / PWA

These features are documented as future enhancements (see [Future Enhancements](#future-enhancements)).

---

## Folder Structure

```
smart-duka/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Button, Input, Modal, etc.
│   │   │   ├── layout/              # Navbar, Footer, Sidebar
│   │   │   └── product/             # ProductCard, ProductGrid
│   │   ├── features/                # Redux slices
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── vendors/
│   │   ├── pages/                   # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── Shop.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── CustomerDashboard.tsx
│   │   │   │   ├── VendorDashboard.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   └── Auth/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Helpers, constants
│   │   ├── services/                # API client (Axios)
│   │   ├── store.ts                 # Redux store
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/                  # DB connection, env vars
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   ├── middleware/              # Auth, RBAC, validation, error
│   │   │   ├── auth.ts
│   │   │   ├── rbac.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── Payment.ts
│   │   │   └── Review.ts
│   │   ├── routes/                  # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── vendor.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/            # Route handlers
│   │   ├── validators/            # Request validation schemas
│   │   └── app.ts                  # Express app setup
│   ├── server.ts                   # Entry point
│   └── package.json
│
├── .env.example                     # Environment variable template
├── .gitignore
├── package.json                     # Root (monorepo scripts)
└── README.md                        # This file
```

---

## Installation & Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas URI)
- Paystack test API keys
- Azure subscription (or Azure for Students account)

### Clone & Install

```bash
git clone https://github.com/your-username/smart-duka.git
cd smart-duka

# Install all dependencies (root + client + server)
npm run install:all
# or manually:
cd server && npm install && cd ../client && npm install && cd ..
```

### Environment Setup

```bash
cp .env.example server/.env
# Edit server/.env with your values (see Environment Variables section)
```

### Run in Development

```bash
# Start backend (port 5000)
npm run server

# Start frontend (port 5173) in a new terminal
npm run client

# Or start both concurrently
npm run dev
```

### Seed Database (Optional)

```bash
npm run seed
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartduka

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=product-images

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## Usage Guide

### Customer Flow
1. Browse the marketplace without logging in
2. Register an account (customer role)
3. Browse products, filter by category/vendor
4. Add items to cart
5. Proceed to checkout → redirected to Paystack
6. Complete payment → redirected back to order confirmation
7. Track order status from dashboard

### Vendor Flow
1. Register as a customer first
2. Apply for vendor status from dashboard
3. Admin approves the vendor application
4. Set up store profile (name, description, logo)
5. Add products with images, prices, and stock
6. View and process incoming orders
7. Track sales from vendor dashboard

### Admin Flow
1. Login with admin credentials (seeded)
2. View pending vendor applications → approve/reject
3. Manage users (suspend, change roles)
4. Oversee all products and categories
5. View platform-wide statistics

---

## Future Enhancements

- **AI-powered recommendations** — personalized product suggestions based on browsing history
- **Mobile app** — React Native companion app for iOS and Android
- **Real-time notifications** — email/SMS order updates via Nodemailer or Twilio
- **Vendor subscription plans** — freemium model with premium features (analytics, priority listing)
- **Multi-currency** — support for regional currencies with automatic conversion
- **Advanced analytics** — charts and dashboards with Recharts for vendor/admin insights
- **Fraud detection** — flag suspicious orders, review spam, and unusual activity
- **PWA support** — offline browsing and installable web app

---

## Timeline

| Day | Tasks                                                              |
| --- | ------------------------------------------------------------------ |
| 1   | Project setup, backend models, authentication system               |
| 2   | Product CRUD, categories, Azure Blob Storage integration           |
| 3   | Cart & checkout flow, Paystack payment integration                 |
| 4   | Order management, vendor dashboard                                 |
| 5   | Admin dashboard, reviews, wishlist                                 |
| 6   | Frontend polish, responsive design, edge case handling             |
| 7   | Testing, bug fixes, Azure deployment, documentation finalization   |

---

## License

This project is developed for educational purposes as part of a academic program.
