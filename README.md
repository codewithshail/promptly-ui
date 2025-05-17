# 🚀 Promptly AI Dashboard

A modern **Next.js 15** application that offers a comprehensive dashboard for discovering, managing, and tracking AI tools. Built with cutting-edge tech, intuitive UI, and personalized intelligence.

---

## 📚 Table of Contents

- [✨ Features](#-features)  
- [🧰 Tech Stack](#-tech-stack)  
- [📁 Project Structure](#-project-structure)  
- [⚙️ Getting Started](#-getting-started)  
- [🔐 Authentication](#-authentication)  
- [🗃️ Database Schema](#-database-schema)  
- [🧠 Recommendation System](#-recommendation-system)  
- [🧭 Navigation Structure](#-navigation-structure)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  

---

## ✨ Features

- 🔍 **AI Tool Discovery**: Browse a curated library of AI tools.
- 🎯 **Personalized Recommendations**: Tailored tool suggestions based on your preferences.
- 🔐 **User Authentication**: Secure login/signup using Clerk.
- 📌 **Bookmark Management**: Save and organize favorite tools.
- 📊 **Usage Tracking**: Monitor tool usage and associated costs.
- ✍️ **Custom AI Requests**: Submit requests for tailor-made AI solutions.

---

## 🧰 Tech Stack

| Layer            | Technology                     |
|------------------|---------------------------------|
| **Framework**     | Next.js 15 (App Router)         |
| **Authentication**| Clerk                          |
| **Database**      | PostgreSQL + Drizzle ORM        |
| **UI**            | Tailwind CSS + Shadcn UI        |
| **Deployment**    | Vercel                          |

---

## 📁 Project Structure

### Directory Tree
```bash
/promptly-ai/
├── public/                   # Static assets
│   ├── images/
│   │   ├── logos/            # Tool logos
│   │   ├── tools/            # Tool screenshots
│   │   └── icons/            # UI icons
│   └── favicon.ico
├── app/                      # App Router
│   ├── (auth)/               # Auth routes group
│   │   ├── login/            # Login page
│   │   │   └── page.tsx      # Clerk login page
│   │   └── signup/           # Signup page with reference selection
│   │       └── page.tsx      # Clerk signup with custom reference form
│   ├── (dashboard)/          # Auth-protected routes
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Dashboard home page
│   │   ├── settings/         # Settings page
│   │   │   └── page.tsx
│   │   └── billing/          # Billing page
│   │       └── page.tsx
│   ├── apps/                 # App library (public)
│   │   ├── page.tsx          # Main app library page
│   │   ├── [category]/       # Category-specific pages
│   │   │   └── page.tsx
│   │   └── [toolId]/         # Individual tool pages (auth-protected)
│   │       └── page.tsx
│   ├── bookmarks/            # Bookmarked tools (auth-protected)
│   │   ├── page.tsx          
│   │   └── [category]/       # Category-specific bookmarks
│   │       └── page.tsx
│   ├── custom-ai/            # Custom AI request form (public)
│   │   └── page.tsx
│   ├── api/                  # API routes
│   │   ├── tools/            # Tool-related endpoints
│   │   │   └── route.ts
│   │   ├── bookmarks/        # Bookmark management
│   │   │   └── route.ts
│   │   ├── usage/            # Usage tracking
│   │   │   └── route.ts
│   │   └── custom-ai/        # Custom AI request handling
│   │       └── route.ts
│   ├── layout.tsx            # Root layout with Clerk provider
│   └── page.tsx              # Root page (redirects to apps)
├── components/               # Shared components
│   ├── ui/                   # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── search.tsx
│   ├── layout/               # Layout components
│   │   ├── sidebar/          # Primary and contextual sidebars
│   │   │   ├── primary-sidebar.tsx
│   │   │   └── contextual-sidebar.tsx
│   │   └── navigation/       # Navigation components
│   │       ├── category-carousel.tsx
│   │       └── nav-links.tsx
│   ├── tools/                # Tool-related components
│   │   ├── tool-card.tsx     # Tool card component
│   │   ├── tool-popup.tsx    # Tool popup modal
│   │   └── tool-grid.tsx     # Tool grid display
│   ├── auth/                 # Auth-related components
│   │   └── reference-form.tsx # Reference selection form
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── recommended-tools.tsx
│   │   └── previous-tools.tsx
│   └── billing/              # Billing-specific components
│       └── usage-table.tsx
├── lib/                      # Utility functions and libraries
│   ├── db/                   # Database utilities using Drizzle
│   │   ├── index.ts          # DB connection
│   │   └── schema/           # Drizzle schema definitions
│   │       ├── users.ts
│   │       ├── tools.ts
│   │       ├── categories.ts
│   │       └── usage.ts
│   ├── utils.ts              # General utilities
│   └── recommendations.ts    # Recommendation algorithm
├── hooks/                    # Custom React hooks
│   ├── use-tools.ts
│   ├── use-bookmarks.ts
│   └── use-categories.ts
├── middleware.ts             # Next.js middleware with Clerk
├── providers/                # Context providers
│   └── theme-provider.tsx    # Theme provider
├── types/                    # TypeScript type definitions
│   ├── user.ts
│   ├── tool.ts
│   └── category.ts
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── drizzle.config.ts         # Drizzle configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts	Handles route protection and redirects with Clerk
⚙️ Getting Started

✅ Prerequisites

Node.js 18+
PostgreSQL database
Clerk account
📦 Installation
Clone the repository:

git clone https://github.com/codewithshail/promptly-ui.git
cd promptly-ai
Install dependencies:

npm install

⚙️ Environment Setup

Create a .env file in the root directory:

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/promptly"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/signup/reference


🗄️ Database Setup

Generate and push the schema:

npx drizzle-kit generate
npx drizzle-kit push:pg


🚀 Run Development Server
npm run dev
Visit http://localhost:3000 to view the app.

🔐 Authentication

This project uses Clerk for authentication.

Flow:
User signs up (email/password or social).
Redirected to reference selection form.
Reference saved to database.
Redirected to personalized dashboard.
Middleware handles:
Public vs protected route access
Automatic redirects to login for unauthorized access


🗃️ Database Schema

Table	Description
Users	Stores user profile info and reference category
Tools	AI tools with metadata
Categories	Predefined tool categories
ToolCategories	Many-to-many relation between tools & categories
Bookmarks	User-saved tools
UsageLogs	Tool usage and cost tracking
CustomRequests	Custom AI request submissions


🧠 Recommendation System

The recommendation system leverages a multi-signal scoring algorithm:

Signals Used:
Signal	Weight (%)
Reference Category	50%
Previously Used Tools	30% + recency
Bookmarked Tools	25%
Popularity Among Similar Users	15%
New Tools in Preferred Categories	20%
Fallback Strategy
For new users with insufficient data:

Popular tools in their reference category
Newest additions to the AI tool library


🧭 Navigation Structure

Primary Sidebar
Visible on all pages:

🏠 Home / Dashboard (auth)
📚 Apps (public)
📌 Bookmarks (auth)
🤖 Custom AI (public)
💳 Billing (auth)
⚙️ Settings (auth)
Contextual Sidebar
Visible only on:

🏠 Dashboard: personalized sections
📚 Apps: tool categories
📌 Bookmarks: filtered by category
🤝 Contributing



Code of Conduct
How to submit PRs and raise issues
📄 License

This project is licensed under the MIT License.
See the LICENSE file for details.

Made with ❤️ by the Promptly AI team.