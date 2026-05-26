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
