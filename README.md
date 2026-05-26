# College Discovery Portal

A full-stack, responsive web application designed to help prospective students research, compare, bookmark, and discuss colleges. The platform provides a sleek user interface, side-by-side comparative analysis tools, and dedicated college forums.

## Features

- **College Exploration**: Advanced search and filter capabilities targeting location, fees, and ratings.
- **Comparison Engine**: Side-by-side analytical comparisons of up to four institutions, highlighting key features like placement data, rating margins, fees, and available courses.
- **Community Forums**: Discussion boards associated with specific institutions, allowing users to post inquiries and share feedback.
- **User Authentication**: Secure signup and login systems using salted password hashing and custom JSON Web Tokens (JWT).
- **Bookmarks & Saved Colleges**: Profile-based saving capabilities to track selected universities for future reference.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Database & ORM**: PostgreSQL with Prisma Client
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or later installed
- A running PostgreSQL database instance (local or hosted, such as Neon)

### Installation

1. Clone the repository to your local machine.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables. Create a `.env` file in the root directory and add the following keys:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NEXTAUTH_SECRET="your_secure_auth_secret_key"
   JWT_SECRET="your_secure_jwt_secret_key"
   ```

4. Push the database schema to your database instance:
   ```bash
   npx prisma db push
   ```

5. Seed the database with sample college data:
   ```bash
   npm run seed
   ```
   *(Ensure your package.json includes a script for seeding, e.g., "prisma": {"seed": "npx tsx prisma/seed.ts"})*

6. Run the local development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Directory Structure

```
├── prisma/                 # Database schema models and seed scripts
├── public/                 # Static assets
└── src/
    ├── app/                # Next.js page layouts and API endpoints
    │   ├── api/            # Serverless backend endpoints
    │   ├── colleges/       # Search and single view pages
    │   ├── compare/        # Side-by-side dashboard
    │   ├── discussions/    # Forum boards
    │   ├── login/          # Auth login portal
    │   ├── profile/        # Authenticated student profiles
    │   └── register/       # User registration page
    ├── components/         # Reusable design components
    │   ├── layout/         # Header and footer wrappers
    │   └── ui/             # Core UI visual components
    └── lib/                # API clients, helpers, and utilities
```

## High-Level System Architecture

This project is built using a modern, full-stack Three-Tier Next.js Architecture that combines frontend delivery, backend logic, and database operations into a unified serverless application.

```
┌────────────────────────────────────────────────────────┐
│                      Client Tier                       │
│  - React 19 Client Components                          │
│  - Tailwind CSS Styling (harmonious colors, shadows)   │
│  - Lucide Icons & Responsive Layouts                   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP JSON Requests
                           ▼
┌────────────────────────────────────────────────────────┐
│                      Server Tier                       │
│  - Next.js 16 App Router Serverless API Routes         │
│  - Custom JWT Proxy Middleware & Token Verification   │
│  - BcryptJS Salting & Hashing Engine                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Prisma Client Queries
                           ▼
┌────────────────────────────────────────────────────────┐
│                     Database Tier                      │
│  - Neon Serverless PostgreSQL Cloud Database           │
│  - Prisma ORM Schema & Auto-Generated Type-Definitions │
└────────────────────────────────────────────────────────┘
```

### The Power of Serverless Next.js

In traditional applications, you would have to deploy a separate React frontend (e.g., on Netlify) and an Express Node.js backend (e.g., on Render). In this architecture, both layers run seamlessly together:

- **The Frontend**: Statically rendered pages are optimized globally on Vercel's CDN. Pages that depend on real-time query inputs use React Suspense boundaries to bail out of rigid static building and run dynamic client-side hydration.
- **The Backend API**: Every file located in `/src/app/api/` is compiled into an independent, auto-scaling Vercel Serverless Function. These functions boot up instantly on demand, execute queries using the Prisma Client, and shut down, keeping operational costs at absolute zero.

## Technical Breakdown of Core Features

### The Multidimensional Comparison Engine

- **Under the Hood**:
  - **URL-Driven State**: The comparison list relies entirely on the URL search query parameters (e.g., `/compare?ids=id1,id2,id3`). This makes comparison boards fully shareable. If a student wants to show their choices to their parents or friends, they can simply copy the URL and the exact comparison state is preserved.
  - **Optimized Network Requests**: Instead of making multiple individual database round-trips for each ID, the system fetches all colleges in a single lightweight query and maps them client-side in order of preference.
  - **Dynamic Metric Highlighting**: The interface parses the compared array on the fly to determine highlight states. It calculates the highest numerical rating and the lowest annual fees in real time, injecting visual visual indicators (like the Best Price badge and Gold Star highlights) to assist decision-making instantly.
  - **Next.js Suspense Guard**: Because this page reads directly from URL parameters at build-time, it is wrapped in a React `Suspense` boundary. This prevents Next.js from throwing static rendering bails during server compilation.

### The Community Forum & Q&A Board

- **Under the Hood**:
  - **Relational Association**: A single discussion thread can exist globally or be explicitly tied to a specific university via an optional relation key (`collegeId`). This allows forums to double as general discussion boards or specific college Q&A threads.
  - **Cascading Answers**: The database schema is configured with `onDelete: Cascade` on the `Answer` relation. If a moderator or author deletes a discussion topic, all associated replies are automatically wiped by the PostgreSQL database engine, maintaining database integrity and avoiding orphaned records.

### Custom JWT Authentication & Session Proxy

- **Under the Hood**:
  - **Zero External Dependencies**: Instead of adding heavy third-party authentication services, this project implements a highly secure, custom session management pipeline using `jsonwebtoken` and `bcryptjs`.
  - **Password Protection**: During user signup, passwords are salted and hashed with a round factor of 10. Raw passwords are never stored in the database, preventing leaks.
  - **Secure Cookies**: When a user logs in, the API route generates a JSON Web Token containing the user's ID and email, signs it with `JWT_SECRET`, and sends it to the browser as a secure cookie. A custom proxy layer intercepts secure backend queries to verify the client's signature before executing protected operations.

## Database Schema Architecture

Your relational model defined in `prisma/schema.prisma` is optimized for high-performance indexing and referential integrity.

### Entity Relationship Breakdown

```
  ┌──────────────┐             ┌─────────────────┐             ┌───────────────┐
  │     User     │1           *│   Discussion    │1           *│    Answer     │
  │  - id (PK)   ├────────────►│  - id (PK)      ├────────────►│  - id (PK)    │
  │  - email (U) │             │  - authorId(FK) │             │  - authorId   │
  └──────┬───────┘             │  - collegeId(FK)│             │  - discId(FK) │
         │                     └────────▲────────┘             └───────────────┘
         │                              │
         │                              │ *
         │ Many-to-Many                 │
         │ (Bookmarked Colleges)        │ 1
         │                     ┌────────┴────────┐
         └────────────────────►│     College     │
                               │  - id (PK)      │
                               │  - name         │
                               └─────────────────┘
```

### Detailed Model Analysis

- **User Model**: Holds security credentials (`passwordHash`) and links users to their discussions, replies, and bookmarked colleges.
- **College Model**: Stores institution data including placement summaries, ratings, tuition fees, and course lists stored in dynamic PostgreSQL string arrays (`String[]`).
- **Saved Colleges (Implicit Many-to-Many)**: Prisma automatically generates a join table (internally `_CollegeToUser`) linking `User` and `College`. When a student clicks "Bookmark", a fast relational join is established, eliminating the need to write complex SQL mapping queries manually.

## End-to-End Execution Flow (How a Request Travels)

To demonstrate your understanding during a technical interview, walk through this sequence of what happens when a student bookmarks a college:

1. **User Action**: The student clicks the "Compare" or "Save" button on a college card.
2. **Client-Side Request**: The React client uses the pre-configured `apiClient` to dispatch a `POST` request to `/api/users/saved` with the target `collegeId` payload.
3. **Backend Middleware Check**: The serverless route receives the request, parses the HTTP headers to extract the JWT, and verifies the signature using `JWT_SECRET`.
4. **ORM Query Execution**: If verified, Prisma translates the relational query into safe, parameterized SQL:
   ```sql
   INSERT INTO "_CollegeToUser" ("A", "B") VALUES ('college_id', 'user_id');
   ```
5. **Response Hydration**: The API route returns a `200 OK` JSON response. The React client captures the success code, dynamically updates the state, and updates the bookmark button state immediately without reloading the page.

## Performance and Reliability Enhancements

- **Suspense-Driven Hydration**: By dividing pages into synchronous layout skeletons and asynchronous dynamic components (using `Suspense`), initial page loading speed is reduced, enhancing Core Web Vitals performance (specifically Largest Contentful Paint).
- **Prisma Connection Pooling**: To prevent serverless functions from exhausting PostgreSQL database connections during high-traffic spikes, the Prisma client is instantiated as a global singleton. In production, this prevents multiple serverless instances from spinning up duplicate connection pools.
- **Premium CSS Aesthetics**: The design does not rely on default browser elements. Every form, transition, list, and interactive modal utilizes tailwind shadows, smooth transition delays (`transition-all duration-300`), and interactive hover-scales (`hover:scale-105`) to deliver an exceptionally premium and responsive experience.

## Deployment

The application is fully compatible with Vercel for fast, global serverless hosting.

### Deploying to Vercel

1. Push your repository to GitHub.
2. Link the repository to your Vercel account and import it.
3. Configure the following environment variables in Vercel settings:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
4. In Vercel Project Settings > General, override the **Build Command** to:
   ```bash
   npx prisma generate && npx prisma db push && next build
   ```
5. Click **Deploy**. Vercel will set up the serverless APIs, migrate your database tables on Neon, and build the frontend assets synchronously.
