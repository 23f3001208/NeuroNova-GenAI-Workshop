# Collab-Sphere

Collab-Sphere is a collaborative project management and code analysis tool designed for Gen AI Project 2025. It integrates GitHub repositories with AI-powered features such as meeting processing, Q&A, and source code embeddings to enhance team collaboration and productivity.

**Team NeuroNova**

## Features

- User authentication and management with Clerk
- Project creation and management linked to GitHub repositories
- AI-powered meeting processing to extract issues and summaries
- Collaborative Q&A with saved questions and answers per project
- Commit tracking and history polling
- Credit-based usage system for managing resource consumption
- Team member management and project archiving
- Integration with Stripe for credit transactions
- Modern UI built with Radix UI components and Tailwind CSS
- API built with tRPC and Next.js for seamless frontend-backend communication

## Tech Stack

- Next.js (React framework)
- TypeScript
- Prisma ORM with PostgreSQL
- tRPC for API routing
- Clerk for authentication
- Tailwind CSS and Radix UI for styling and components
- AI libraries: Langchain, Google Generative AI, AssemblyAI
- Stripe for payments
- Appwrite, Firebase, Octokit integrations

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- PostgreSQL database
- GitHub account and token (optional for private repos)
- Stripe account for payments

### Installation

1. Clone the repository:

```bash
git clone https://github.com/23f3001208/NeuroNova-GenAI-Workshop.git
cd NeuroNova-GenAI-Workshop
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Please check the `.env` file in the root directory and update the variables accordingly.

4. Run database migrations and generate Prisma client:

```bash
npm run db:migrate
npm run db:generate
```

5. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Deployment

The app is deployed on Vercel and can be accessed at:  
https://collab-sphere-github.vercel.app

## Usage

- Sign up or sign in using Clerk authentication.
- Create a new project by providing a GitHub repository URL.
- The app will index the repository and track commits.
- Upload meeting URLs to process and extract issues automatically.
- Ask and save questions related to your project with AI-generated answers.
- Manage team members and monitor your credit usage.
- Archive projects when no longer needed.

## Database Schema Overview

- User: Stores user profile, credits, and relations to projects and questions.
- Project: Contains project metadata, GitHub URL, commits, meetings, and embeddings.
- Meeting: Stores meeting details and extracted issues.
- Issue: Represents summarized issues from meetings.
- Question: Stores Q&A pairs related to projects.
- Commit: Tracks GitHub commits and metadata.
- SourceCodeEmbedding: Stores AI-generated embeddings of source code files.
- StripeTransaction: Tracks user credit purchases.

## API Overview

- Project management: create, list, archive projects.
- Commit tracking: fetch commits and poll for updates.
- Meeting processing: upload meetings, extract issues, manage meetings.
- Q&A: save and retrieve questions and answers.
- User credits: check and update credit balances.
- Team management: list project team members.

Thank you for using Collab-Sphere!
