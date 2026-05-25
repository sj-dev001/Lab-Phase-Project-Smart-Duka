# Capstone Project Report: Smart Duka Marketplace

## Project Overview

Smart Duka is a modern, full-stack multi-vendor e-commerce marketplace. The project was designed and engineered as a final capstone submission for the Software Bootcamp, demonstrating modern web development principles, typesafe architecture, and cloud deployment best practices. 

---

## 1. Frontend Architecture

The Smart Duka frontend is a single-page application built with **React 18**, **TypeScript**, and **Vite**, delivering fast development builds and highly optimized production bundles. The interface is styled with **Tailwind CSS**, ensuring a responsive, mobile-friendly layout with a polished, modern aesthetic.

**React Router DOM v6** manages client-side navigation across twelve routes — including the landing page, product shop, product details, shopping cart, Paystack-powered checkout, and role-specific dashboards for customers, vendors, and administrators.

Application state is centralized using **Redux Toolkit** with dedicated slices for authentication, cart, products, orders, and vendor data. An **Axios**-based API service layer communicates with the backend REST API, automatically attaching JWT tokens to requests and handling session expiry gracefully.

**Framer Motion** powers smooth page transitions and micro-animations, while **React Hot Toast** delivers non-intrusive user notifications. Product image uploads are handled through the **Uploadthing React SDK**, which uploads directly to a global CDN for fast image delivery.

The codebase follows a modular architecture: reusable primitives in `components/common`, layout scaffolding in `components/layout`, and isolated page views in `pages`.

---

## 2. Backend Architecture

The Smart Duka backend is built on **Node.js** and **Express** using **TypeScript**, providing a robust, typesafe RESTful API. Originally designed for Azure, it has been migrated to **100% free services** for scalable, cost-effective hosting. The database layer utilizes **MongoDB Atlas** via **Mongoose**, employing structured data schemas and references to establish clean relationships between Users, Vendor Profiles, Products, Categories, Orders, and Reviews.

Security is handled via **JWT (JSON Web Tokens)** with custom middleware enforcing role-based access control (RBAC) across three distinct user roles: Customer, Vendor, and Admin. Media storage is integrated with **Uploadthing**, which manages direct client uploads and calls backend webhooks to link images to database records. Payment validation is processed through the **Paystack API**, verifying transactions before confirming order creation.

For development, a custom seeding pipeline fetches real product data from DummyJSON, Platzi, and FakeStore APIs. This pipeline implements staggered `createdAt` timestamps, ensuring high-quality, image-rich listings always appear at the top of the storefront under default sorting.

---

## 3. Deployment and Resource Overview

The Smart Duka application has been deployed using a modern, multi-provider architecture designed to eliminate infrastructure costs while maintaining production-grade performance, scalability, and security.

### Live Deployment Links
*   **Frontend Application:** [https://the-smart-duka.vercel.app](https://the-smart-duka.vercel.app)
*   **Backend REST API:** [https://smart-duka-backend.vercel.app](https://smart-duka-backend.vercel.app)

### Involved Resources and Platforms
*   **Vercel:** Hosts both the React frontend and the Express backend. The frontend is built and served as a highly optimized static site, while the backend is deployed as serverless functions using custom routing configuration rules.
*   **MongoDB Atlas:** Serves as the cloud database, hosting a free tier MongoDB cluster with automated backups and secure network access controls.
*   **Uploadthing:** Handles modern file storage and image uploads, acting as the primary content delivery network (CDN) for product and category imagery.
*   **Paystack:** Processes secure payments and transaction verification during the customer checkout flow.

### Step-by-Step Deployment Process
1.  **Database Provisioning:** A free cluster was initialized on MongoDB Atlas. Database user credentials were created and the connection string was secured to be injected via environment variables.
2.  **Storage Setup:** An application was registered on Uploadthing to retrieve the API keys and App ID, replacing the legacy Azure Blob Storage SDK.
3.  **Backend Deployment:** The Express backend was connected to Vercel. A `vercel.json` file was defined to route API requests to the server entry point. Environmental secrets (including MongoDB URI, JWT Secret, Paystack keys, and Uploadthing keys) were configured in Vercel.
4.  **Frontend Deployment:** The React client was connected to Vercel as a separate project. The `VITE_API_BASE` environment variable was set to target the deployed backend API URL, and the project was built using Vite.
5.  **Verification:** Integration testing verified that the frontend successfully uploads images directly to Uploadthing, communicates with MongoDB via the backend, and completes verification loops with Paystack.

---

## 4. Project Presentation Objective

The primary objective of this presentation is to demonstrate the technical viability, architecture, and operational efficiency of the Smart Duka marketplace as a completed capstone project. By showcasing the transition from legacy Azure services to a modern, fully integrated, and zero-cost cloud stack utilizing Vercel, MongoDB Atlas, and Uploadthing, this presentation illustrates how to build and deploy a production-ready application under modern web standards.

In alignment with the goals of the software engineering bootcamp, this presentation serves to inform the evaluation panel of the technical competency and engineering choices made throughout the development lifecycle. It details the execution of a modern client-server architecture, demonstrating the flow of data between a React frontend and a Node.js Express backend. The presentation will show how the system maintains robust security through JSON Web Tokens and custom role-based access control middleware, ensuring segregated user flows for customers, vendors, and administrators. 

Furthermore, this presentation aims to persuade the audience of the project's practical readiness and cost-effectiveness. By migrating the codebase away from expensive cloud storage subscriptions and onto modern free-tier services like Uploadthing for content delivery and MongoDB Atlas for database hosting, the project highlights resourcefulness and cloud cost-optimization. The presentation will demonstrate live features such as secure image upload widgets, server-side transaction validation using the Paystack payment gateway, and an advanced database seeding pipeline that organizes products dynamically based on timestamp priority.

By covering these components, the presentation demonstrates how the project satisfies the academic and practical expectations of the course. It shows a complete understanding of database design, RESTful API development, frontend state management with Redux Toolkit, and production deployment strategies. Ultimately, this presentation proves the application's readiness for real-world commercial use and serves as a direct reflection of the developer's growth, technical expertise, and readiness to enter the software industry as a capable full-stack developer.
